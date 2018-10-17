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
  if (destination === "#mainContent") {
    Breadcrumb.userAssets(data, "Friends");
  }
  if (isEmpty(users)) {
    Display.nothingHere(destination);
  } else {
    Display.fromTemplate("users", {users:users})
      .toElement(destination).done(function() {
          Listener.setUserResults(users);
          Display.fromTemplate("pagination", pageObj)
            .toElement("#pageinationNav", 1).done(function() {
              dfd.resolve(pageObj);
            });
      });
  }
  return dfd.promise();
};

User.prototype.displayInbox = function(destination) {
  const user = this;
  const dfd = new $.Deferred();
  const pageObj = Paginate.createAndDestinate(user.meta, destination);
  if (destination === "#mainContent") {
    Breadcrumb.userAssets(user, "Messages");
  }
  Display.fromTemplate("inbox")
    .toElement(destination, "", true).done(function() {
      Listener.setInboxBtns(user);
      user.displayMessages("#messageInbox")
        .done(function() {
          Display.deleteBtnOnCheck()    ;
          Display.fromTemplate("pagination", pageObj)
            .toElement("#paginationNav", 1).done(function() {
              dfd.resolve(pageObj);
            });
        });
    });
  return dfd.promise();
};

User.prototype.displayMessages = function(destination) {
  const user = this;
  user.messages = Message.createFrom(user.messages);
  const dfd = new $.Deferred();
  if (isEmpty(user.messages)) {
    Display.nothingHere("#messageInbox", "", true);
  } else {
    const isInbox = destination === "#messageInbox" ? true : false
    Display.fromTemplate("messages", {messages: user.messages})
      .toElement(destination, "", isInbox)
        .done(function() {
          $(".deleteCheckSpans").remove();
          Listener.setMessages(user.messages);
          dfd.resolve();
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
