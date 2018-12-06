function User(json) {
  this.username = json.username;
  this.email = json.email;
  this.id = json.id;
  this.recipes = [];
  this.favorites = [];
  this.friends = [];
  this.messages = [];
  if (json.avatar) {
    this.avatarURL = json.avatar.url;
    this.thumbURL = json.avatar.thumb.url;
  }
}


User.displayAllUsers = function(data, userType, destination) {
  const dfd = new $.Deferred();
  const usersJson = data[`${userType}`];
  const pageObj = Paginate.createAndDestinate(data.meta, destination);
  const users = User.createFrom(usersJson);
  const breadcrumb = Breadcrumb.current();

  if (destination === "#mainContent") {breadcrumb.addUserAssets(data, "Friends");}

  if (isEmpty(users)) {
    display.nothingHere(destination);
  } else {
    display.fromTemplate("users", {users:users})
           .toElement(destination).done(function() {
             Listener.setUserResults(users);
             if (pageObj) { pageObj.displayLinks(dfd, destination) }
           });
  }
  return dfd.promise();
};


User.prototype.displayInbox = function(destination) {
  const user = this;
  const friends = $("#loggedInAs").data("friends");
  const breadcrumb = Breadcrumb.current();

  if (destination === "#mainContent") {breadcrumb.addUserAssets(user, "Messages");}
  display.fromTemplate("inbox", {recipients:friends})
         .toElement(destination, "", true).done(function() {
           Listener.setInboxBtns(user);
           user.displayMessages("#messageInbox")
               .done(function(pageObj) {
                 Message.deleteBtnOnCheck();
                 pageObj.setLinks(`/users/${user.id}/messages`);
               });
         });
};


User.prototype.displayMessages = function(destination) {
  const user = this;
  const dfd = new $.Deferred();
  const pageObj = Paginate.createAndDestinate(user.meta, destination)
  const isInbox = destination === "#messageInbox" ? true : false
  user.messages = Message.createFrom(user.messages);

  if (destination === "#messageInbox") {pageObj.user = user;}

  if (isEmpty(user.messages)) {
    display.nothingHere(destination, "", isInbox);
  } else {
    display.fromTemplate("messages", {messages: user.messages})
           .toElement(destination, "", isInbox)
             .done(function() {
               Listener.setMessages(user.messages);
               if (pageObj) { pageObj.displayLinks(dfd, destination) }
               else { $(".deleteCheckSpans").remove(); }
             });
  }
  return dfd.promise();
};


User.createFrom = function(data) {
  return data ? data.map(user => new User(user)) : [];
};


User.prototype.displayProfile = function() {
  const user = this;
  const breadcrumb = Breadcrumb.current();

  $.get(`/users/${user.id}`)
    .done(function(data) {
      display.fromTemplate("user", user)
             .toElement("#mainContent")
               .done(function() {
                 breadcrumb.addProfile(user);
                 Listener.setProfile(user);
               });
    });
};


User.prototype.displayPreview = function(tab, type) {
  const assets = this[tab.toLowerCase()];
  const destination = "#profileContent";

  Listener.setSeeAll(this, tab, type);
  if (type === "recipes") {
    Recipe.displayAllRecipes(this, tab.toLowerCase(), destination);
  } else if (type === "users") {
    User.displayAllUsers(this, tab.toLowerCase(), destination);
  } else if (type === "messages") {
    $("#unreadCount").text(`${this.messages.length}`);
    this.displayMessages(destination);
  }
};


User.prototype.displayUnreadCount = function() {
  if (isLoggedIn()) {
    this.getMessages("count")
      .done(function(data) { $("#unreadCount").text(`${data.unread_count}`)});
  }
};


User.prototype.assignAssetsAndMeta = function(data) {
  user = this;
  Object.keys(data).forEach(function(key) {
    user[key] = data[key];
  });
};

User.prototype.addFriend = function(currentUserId) {
  const user = this;

  return function() {
    const params = { "friend_id": user.id, "request": true };
    const $addFriendLink = $(`#user-${user.id} .addFriend`);
    const pendingHtml = "<small class='text-success'>Pending</small>";

    $.post(`/users/${currentUserId}/friend`, params)
      .done(function(data) {
        user.addData("friendIds", "pendingFriendIds");
        AlertMessage.createAutoDismiss(`Friend invitation has been sent to ${data.friendship.friend.username}!`, "success");
        $addFriendLink.after(pendingHtml)
                      .remove();
      });
  };
};


User.prototype.confirmFriend = function(currentUserId) {
  const user = this;

  return function() {
    const params = {"friend_id": user.id};
    $.post(`/users/${currentUserId}/friend`, params)
      .done(function(data) {
        user.addData("friendIds");
        AlertMessage.createAutoDismiss(`You are now friends with ${data.friendship.friend.username}!`, "success");
      });
  };
};


User.prototype.setLoggedInAs = function() {
  const html = `<small class='blue'>Logged in as:</small> <a href="" id="loggedInUser" class="black userLink">${this.username}</a>`;

  $("#loggedInAs").html(html);
  this.setData();
};


User.prototype.setData = function() {
  const user = this;
  const linkFunc = linkSelectorFunction("#loggedInAs");

  user.getRecipients()
    .done(function(data) {
      const friends = data.friendships.map(f => f.friend);
      const pendingIds = data.friendships.map(function(f) {
        if (!!f.request) { return f.friend.id }
      });

      $("#loggedInAs").data({
                      id: user.id,
                username: user.username,
                 friends: friends,
        pendingFriendIds: pendingIds,
               friendIds: friends.map(f => f.id)
      });
      user.setUserLink(linkFunc);
    });
  return this;
};

User.prototype.addData = function(attrs) {
  const user = this;

  attrs.forEach(function(attr) {
    $("#loggedInAs").data(attr).push(user.id);
  });
};


User.prototype.getRecipes = function(preview) {
  const previewObj = preview ? {"preview":preview} : {};

  return $.get(`/users/${this.id}/recipes`, previewObj);
};


User.prototype.getFavorites = function(preview) {
  const previewObj = preview ? {"preview":preview} : {};

  return $.get(`/users/${this.id}/favorites`, previewObj);
};


User.prototype.getFriends = function(preview) {
  const previewObj = preview ? {"preview":preview} : {};

  return $.get(`/users/${this.id}/friends`, previewObj);
};


User.prototype.getMessages = function(scope) {
  return $.get(`/users/${this.id}/messages`, {"scope":scope});
};


User.prototype.getRecipients = function() {
  return $.get(`/users/${this.id}/friendships`);
};


//  Listeners //

User.prototype.setUserLink = function(linkSelector) {
  const user = this;

  linkSelector(".userLink").click(function(e) {
    e.preventDefault();
    Search.backToResultsLink();
    user.displayProfile();
  }).addClass("linkCursor");
  return this;
};

User.prototype.setUserRecipesLink = function(linkSelector, destination) {
  const user = this;
  const preview = destination === "#mainContent" ? null : true;

  linkSelector(".recipesLink").click(function(e) {
    e.preventDefault();
    Search.backToResultsLink();
    user.getRecipes(preview)
      .done(function(data) {
        user.assignAssetsAndMeta(data);
        Recipe.displayAllRecipes(user, "recipes", destination)
          .done(function(pageObj) {
            pageObj.setLinks(`/users/${user.id}/recipes`, preview);
          });
      });
  });
  return this;
};

User.prototype.setUserFavoritesLink = function(linkSelector, destination) {
  const user = this;
  const preview = destination === "#mainContent" ? null : true;

  linkSelector(".favoritesLink").click(function(e) {
    e.preventDefault();
    Search.backToResultsLink();
    user.getFavorites(preview)
      .done(function(data) {
        user.assignAssetsAndMeta(data);
        Recipe.displayAllRecipes(user, "favorites", destination)
          .done(function(pageObj) {
            pageObj.setLinks(`/users/${user.id}/favorites`, preview);
          });
      });
  });
  return this;
};

User.prototype.setUserFriendsLink = function(linkSelector, destination) {
  const user = this;
  const preview = destination === "#mainContent" ? null :true;

  linkSelector(".friendsLink").click(function(e){
    e.preventDefault();
    user.getFriends()
      .done(function(data) {
        user.assignAssetsAndMeta(data);
        User.displayAllUsers(user, "friends", destination)
          .done(function(pageObj) {
            pageObj.setLinks(`/users/${user.id}/friends`, preview);
          });
      });
  });
  return this;
};

User.prototype.setUserInboxLink = function(linkSelector, destination) {
  const user = this;

  linkSelector(".messagesLink").click(function(e) {
    e.preventDefault();
    user.getMessages("all")
      .done(function(data) {
        user.assignAssetsAndMeta(data);
        user.displayInbox(destination)
      });
  });
  return this;
};
