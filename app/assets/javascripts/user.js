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
  if (destination === "#mainContent") {Breadcrumb.userAssets(data, "Friends");}
  if (isEmpty(users)) {
    Display.nothingHere(destination);
  } else {
    Display.fromTemplate("users", {users:users})
      .toElement(destination).done(function() {
        Listener.setUserResults(users);
        Display.fromTemplate("pagination", pageObj)
          .toElement("#paginationNav", 1).done(function() {
            dfd.resolve(pageObj);
          });
      });
  }
  return dfd.promise();
};

User.prototype.displayInbox = function(destination) {
  const user = this;
  const dfd = new $.Deferred();
  const pageObj = Paginate.createAndDestinate(user.meta, destination)
  const friends = $("#loggedInAs").data("friends");

  pageObj.user = user;
  if (destination === "#mainContent") {Breadcrumb.userAssets(user, "Messages");}
  Display.fromTemplate("inbox", {recipients:friends})
    .toElement(destination, "", true).done(function() {
      Listener.setInboxBtns(user);
      user.displayMessages("#messageInbox", pageObj)
        .done(function() {
          Message.deleteBtnOnCheck();
          Display.fromTemplate("pagination", pageObj)
            .toElement("#paginationNav", 1, true).done(function() {
              dfd.resolve(pageObj);
            });
        });
    });
  return dfd.promise();
};

User.prototype.displayMessages = function(destination, pageObj) {
  const user = this;
  const dfd = new $.Deferred();
  const isInbox = destination === "#messageInbox" ? true : false
  user.messages = Message.createFrom(user.messages);
  if (isEmpty(user.messages)) {
    Display.nothingHere(destination, "", isInbox);
  } else {
    Display.fromTemplate("messages", {messages: user.messages})
      .toElement(destination, "", isInbox)
        .done(function() {
          if (destination === "#profileContent") {$(".deleteCheckSpans").remove();}
          Listener.setMessages(user.messages);
          dfd.resolve(pageObj);
        });
  }
  return dfd.promise();
};

User.createFrom = function(data) {
  return data ? data.map(user => new User(user)) : [];
};

User.prototype.displayProfile = function() {
  const user = this;
  $.get(`/users/${user.id}`)
    .done(function(data) {
      Display.fromTemplate("user", user)
        .toElement("#mainContent")
          .done(function() {
            Breadcrumb.profile(user);
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
    this.displayMessages(destination);
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
    const $addFriendLink = linkSelector(`#user-${user.id}`)(".addFriend");
    const html = "<span class='small text-success'>Pending</span>";

    $.post(`/users/${currentUserId}/friend`, params)
      .done(function(data) {
        Display.alert(`Friend invitation has been sent to ${data.friendship.friend.username}!`, "success");
        $addFriendLink.after(html)
          .addClass("disabled");
      });
  };
};

User.prototype.confirmFriend = function(currentUserId) {
  const user = this;
  return function() {
    const params= {"friend_id": user.id};
    $.post(`/users/${currentUserId}/friend`, params)
      .done(function(data) {
        Display.alert(`You are now friends with ${data.friendship.friend.username}!`, "success");
      });
  };
};

User.prototype.setData = function() {
  const user = this;
  user.getRecipients()
    .done(function(data) {
      const friends = User.createFrom(data.users)
      $("#loggedInAs").data({
        id:user.id,
        username:user.username,
        friends:friends
      });
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
  return $.get(`/users/${this.id}/friends`, {"scope":"recipients"});
}
