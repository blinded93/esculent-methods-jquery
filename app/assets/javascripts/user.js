function User(json) {
  this.username = json.username;
  this.email = json.email;
  this.id = json.id;
  this.recipes = this.assignRecipes(json.recipes);
}

// User.linkListeners = function() {
//   User.link();
//   User.recipeLink();
// };
//
// User.links = function() {
//   $(".userLink").each((i, link) => {
//     const $link = $(link);
//     $link.click({link:$link}, (e) => {
//       e.preventDefault();
//       User.getRecipes($link.data("id"));
//     });
//   });
// };

User.prototype.assignRecipes = function(recipes) {
  return recipes ? recipes.map(r => new Recipe(r)): [];
};

User.getRecipes = function(id) {
  $.get(`/users/${id}/recipes`, owner => {
    let objs = owner.recipes.map(recipe => {
      return new Recipe(recipe);
    });
    Display.adjustBreacrumb();
    Display.fromTemplate("recipe_results", {recipes:objs});
    Display.linkListeners();
  })
};
