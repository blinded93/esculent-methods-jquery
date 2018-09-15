function User(json) {
  this.username = json.username;
  this.email = json.email;
  this.id = json.id;
  this.recipes = this.assignRecipes(json.recipes);
  this.favorites = [];
  this.friends = [];
}

User.displayAllUsers = function(data, userType, destination) {
  const usersJson = data[`${userType}`]
  const users = User.createFrom(usersJson);
  if (destination === "#mainContent") {
    Breadcrumb.userAssets(data, "Friends");
  }
  if (isEmpty(users)) {
    Display.nothingHere(destination);
  } else {
    Display.fromTemplate("users", {users:users})
      .toElement(destination)
        .done(function() {
          Listener.setUserResults(users);
        });
  }
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
  Listener.setSeeAll(this, tab, type);
  if (type === "recipes") {
    Recipe.displayAllRecipes(this, tab.toLowerCase(), "#profileContent");
  } else {
    User.displayAllUsers(this, tab.toLowerCase(), "#profileContent");
  }
};

User.prototype.getRecipes = function(preview) {
  const user = this;
  const dfd = $.Deferred();
  const previewObj = preview ? {"preview":preview} : {};
  $.get(`/users/${user.id}/recipes`, previewObj)
    .done(function(data) {
      const recipes = Recipe.createFrom(data.recipes);
      dfd.resolve(recipes);
    });
    return dfd.promise();
};

User.prototype.getFavorites = function(preview) {
  const user = this;
  const dfd = $.Deferred();
  $.get(`/users/${user.id}/favorites`, {"preview":preview})
    .done(function(data) {
      const recipes = Recipe.createFrom(data.recipes);
      dfd.resolve(recipes);
    });
    return dfd.promise();
};

User.prototype.getFriends = function(preview) {
  const user = this;
  const dfd = $.Deferred();
  $.get(`/users/${user.id}/friends`, {"preview":preview})
    .done(function(data) {
      const friends = User.createFrom(data.friends);
      dfd.resolve(friends);
    });
    return dfd.promise();
};
