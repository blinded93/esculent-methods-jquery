function User(json) {
  this.username = json.username;
  this.email = json.email;
  this.id = json.id;
  this.recipes = this.assignRecipes(json.recipes);
}

User.displayAllUsers = function(data) {
  const objs = data.users.map(user => new User(user));
  Display.fromTemplate("users", {users:objs})
    .done(function() {
      objs.forEach(user => {
        Listener.setUserResults(user);
        // user.resultListeners();
      });
    });
};

User.prototype.assignRecipes = function(recipes) {
  return recipes ? recipes.map(r => new Recipe(r)): [];
};

User.prototype.displayProfile = function() {
  const user = this;
  Display.fromTemplate("user", user)
    .done(function() {
      Breadcrumb.adjust(user.username, "userLink")
      user.profileListeners();
    });
};

User.prototype.getRecipes = function(user) {
  $.get(`/users/${user.id}/recipes`, data => {
    Breadcrumb.adjust("My Recipes", "recipeLink")
    user.adjustBreadcrumb("My Recipes");
    Recipe.displayAllRecipes(data);
  });
};

User.prototype.getFavorites = function(user) {
  $.get(`/users/${user.id}/favorites`, data => {
    user.adjustBreadcrumb("My Favorites");
    Recipe.displayAllRecipes(data);
  });
};

User.prototype.getFriends = function(user) {
  $.get(`/users/${user.id}/friends`, data => {
    user.adjustBreadcrumb("Friends");
    User.displayAllUsers(data);
  });
};

User.prototype.adjustBreadcrumb = function(title) {
  const $bc = $(".breadcrumb");
  const $li = $("<li>", {"class": "breadcrumb-item userLink"}).html(title || this.username);
  Listener.setHome();
  Display.removeLastBreadcrumb();
  $bc.append($li);
};
