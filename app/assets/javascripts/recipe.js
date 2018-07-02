function Recipe(json) {
  this.name = json.name;
  this.directions = json.directions;
  this.cookTime = json.cook_time;
  this.prepTime = json.prep_time;
  this.servings = json.servings;
  this.skillLevel = json.skill_level;
  this.ingredients = this.assignIngredients(json.ingredient_amounts);
  this.owner = this.assignUser(json.owner);
}

Recipe.getAllRecipes = function(route="/recipes") {
  $.get(route, recipes => {
    let objs = recipes.map(recipe => {
      return new Recipe(recipe)
    });
    Display.fromTemplate("recipe_results", {recipes:objs});
    Display.linkListeners();
  });
};

Recipe.get = function(userId, recipeId) {
  $.get(`/users/${userId}/recipes/${recipeId}`, recipe => {
    debugger;
  })
}
// Recipe.links = function() {
//   // $(".recipeLink").each((i, link) => {
//   //   const $link = $(link);
//   //   $link.click({link:$link}, (e) => {
//   //     e.preventDefault();
//   //     User.getRecipes($link.data("id"));
//   //   });
//   // });
// };

Recipe.prototype.assignUser = function(user) {
  return user ? new User(user) : undefined;
};

Recipe.prototype.assignIngredients = function(ingredients) {
  return ingredients ? ingredients.map(i => new Ingredient(i)) : [];
};
