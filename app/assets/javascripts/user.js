function User(json) {
  this.username = json.username;
  this.email = json.email;
  this.id = json.id;
  this.recipes = this.assignRecipes(json.recipes);
  this.favorites = [];
  this.friends = [];
  if (json.avatar) {
    this.avatarURL = json.avatar.url;
    this.thumbURL = json.avatar.thumb.url;
  }
}

User.displayAllUsers = function(data, userType, destination) {
  const dfd = new $.Deferred();
  const usersJson = data[`${userType}`]
  const pageObj = new Paginate(data.meta);
  pageObj.destination = destination;
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

User.createFrom = function(data) {
  return data ? data.map(user => new User(user)) : [];
};

User.prototype.assignRecipes = function(recipes, type='recipes') {
  this[`${type}`] = recipes ? Recipe.createFrom(recipes) : [];
};

User.prototype.assignFriends = function(friends) {
  this.friends = User.createFrom(friends);
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
  const assets = this[`${tab.toLowerCase()}`];
  const url = `/users/${this.id}/${tab.toLowerCase()}`;
  Listener.setSeeAll(this, tab, type);
  if (type === "recipes") {
    Recipe.displayAllRecipes(assets, type, "#profileContent")
      .done(function(pageObj) {
        pageObj.setLinks(url);
      })
  } else {
    User.displayAllUsers(this, tab.toLowerCase(), "#profileContent")
      .done(function(pageObj) {
        pageObj.setLinks(url);
      });
  }
};

User.prototype.getRecipes = function(preview) {
  const user = this;
  const previewObj = preview ? {"preview":preview} : {};
  return $.get(`/users/${user.id}/recipes`, previewObj);
};

User.prototype.getFavorites = function(preview) {
  const user = this;
  const previewObj = preview ? {"preview":preview} : {};
  return $.get(`/users/${user.id}/favorites`, {"preview":preview});
};

User.prototype.getFriends = function(preview) {
  const user = this;
  const previewObj = preview ? {"preview":preview} : {};
  return $.get(`/users/${user.id}/friends`, {"preview":preview});
};
