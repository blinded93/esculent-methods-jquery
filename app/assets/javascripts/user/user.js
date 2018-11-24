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
        if (pageObj) { pageObj.displayLinks(dfd, destination) }
      });
  }
  return dfd.promise();
};

User.prototype.displayInbox = function(destination) {
  const user = this;
  const friends = $("#loggedInAs").data("friends");

  if (destination === "#mainContent") {Breadcrumb.userAssets(user, "Messages");}
  Display.fromTemplate("inbox", {recipients:friends})
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
    Display.nothingHere(destination, "", isInbox);
  } else {
    Display.fromTemplate("messages", {messages: user.messages})
      .toElement(destination, "", isInbox)
        .done(function() {
          Listener.setMessages(user.messages);
          if (pageObj) { pageObj.displayLinks(dfd) }
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
    $("#unreadCount").text(`${this.messages.length}`);
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
  const friendIds = $("#loggedInAs").data("friendIds");
  const pendingIds = $("#loggedInAs").data("pendingFriendIds");

  return function() {
    const params = { "friend_id": user.id, "request": true };
    const $addFriendLink = linkSelector(`#user-${user.id}`)(".addFriend");
    const pendingHtml = "<small class='text-success'>Pending</small>";

    $.post(`/users/${currentUserId}/friend`, params)
      .done(function(data) {
        friendIds.push(user.id);
        pendingIds.push(user.id);
        AlertMessage.createAutoDismiss(`Friend invitation has been sent to ${data.friendship.friend.username}!`, "success");
        // Display.alert(`Friend invitation has been sent to ${data.friendship.friend.username}!`, "success");
        $addFriendLink.after(pendingHtml)
          .remove();
      });
  };
};

User.prototype.confirmFriend = function(currentUserId) {
  const user = this;
  const friendIds = $("#loggedInAs").data("friendIds");

  return function() {
    const params = {"friend_id": user.id};
    $.post(`/users/${currentUserId}/friend`, params)
      .done(function(data) {
        friendIds.push(user.id);
        AlertMessage.createAutoDismiss(`You are now friends with ${data.friendship.friend.username}!`, "success");
        // Display.alert(`You are now friends with ${data.friendship.friend.username}!`, "success");
      });
  };
};

User.prototype.setData = function() {
  const user = this;
  user.getRecipients()
    .done(function(data) {
      const pendingIds = data.friendships.map(function(f) {
        if (!!f.request) { return f.friend.id }
      });
      const friends = data.friendships.map(f => f.friend);
      $("#loggedInAs").data({
        id:user.id,
        username:user.username,
        friends: friends,
        pendingFriendIds: pendingIds,
        friendIds: friends.map(f => f.id)
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
  return $.get(`/users/${this.id}/friendships`);
}
