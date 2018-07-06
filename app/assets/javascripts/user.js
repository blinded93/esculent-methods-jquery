function User(json) {
  this.username = json.username;
  this.email = json.email;
  this.id = json.id;
  this.recipes = this.assignRecipes(json.recipes);
}

User.prototype.assignRecipes = function(recipes) {
  return recipes ? recipes.map(r => new Recipe(r)): [];
};

User.prototype.listener = function(parentDiv) {
  const user = this;
  $(parentDiv).find(".userLink").click(function(e) {
    e.preventDefault();
    user.getRecipes();
  }).addClass("linkCursor");
};

User.prototype.getRecipes = function() {
  const user = this;
  $.get(`/users/${user.id}/recipes`, owner => {
    let objs = owner.recipes.map(recipe => new Recipe(recipe));
    Display.fromTemplate("recipe_results", {recipes:objs});
    objs.forEach(recipe => {
      recipe.owner = user;
      recipe.listener(`#recipe-${recipe.id}`);
    });
    user.adjustBreadcrumb();
  });
};

User.prototype.adjustBreadcrumb = function() {
  $bc = $(".breadcrumb");
  const $li = $("<li>", {"class": "breadcrumb-item userLink"}).html(this.username);
  Display.homeListener();
  $bc.children(".userLink").remove();
  $bc.append($li);
};
