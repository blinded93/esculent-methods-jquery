function User(json) {
  this.username = json.username;
  this.email = json.email;
  this.id = json.id;
  this.recipes = this.assignRecipes(json.recipes);
}

User.displayAllUsers = function(data) {
  const objs = data.users.map(user => new User(user));
  Display.fromTemplate("users", {users:objs});
  objs.forEach(user => {
    user.resultListeners();
  });
};

User.prototype.assignRecipes = function(recipes) {
  return recipes ? recipes.map(r => new Recipe(r)): [];
};

User.prototype.resultListeners = function() {
  const parent = `#user-${this.id}`;
  this.listener(parent);
  this.favoritesListener(parent);
  this.recipesListener(parent);
};

User.prototype.recipesListener = function(parentDiv) {

};

User.prototype.favoritesListener = function(parentDiv) {

};

User.prototype.listener = function(parentDiv) {
  const user = this;
  $(parentDiv).find(".userLink").click(function(e) {
    e.preventDefault();
    user.displayProfile();
  }).addClass("linkCursor");
};

User.prototype.profileListeners = function() {
  // this.listener(`#user-${this.id}`);
};

User.prototype.displayProfile = function() {
  Display.fromTemplate("user", this);
  this.adjustBreadcrumb();
  this.profileListeners();
};

User.prototype.getRecipes = function() {
  const user = this;
  $.get(`/users/${user.id}/recipes`, data => {
    Recipe.displayAllRecipes(data);
    // user.displayRecipes(user, data);
  });
};

// User.prototype.displayRecipes = function(user, data) {
//   let objs = data.user.recipes.map(recipe => new Recipe(recipe));
//   Display.fromTemplate("recipe_results", {recipes:objs});
//   objs.forEach(recipe => {
//     recipe.owner = user;
//     recipe.listener(`#recipe-${recipe.id}`);
//   });
//   user.adjustBreadcrumb();
// };

User.prototype.adjustBreadcrumb = function() {
  const $bc = $(".breadcrumb");
  const $li = $("<li>", {"class": "breadcrumb-item userLink"}).html(this.username);
  Display.homeListener();
  Display.removeLastBreadcrumb();
  $bc.append($li);
};
