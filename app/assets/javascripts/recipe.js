function Recipe(json) {
  this.id = json.id;
  this.name = json.name;
  this.directions = json.directions;
  this.cookTime = json.cook_time;
  this.prepTime = json.prep_time;
  this.servings = json.servings;
  this.skillLevel = json.skill_level;
  this.ingredients = this.assignIngredients(json.ingredient_amounts);
  this.owner = this.assignUser(json.owner);
}

Recipe.getAllRecipes = function(scope) {
  //adjust scope into data hash
  $.get("/recipes", data => {
    const objs = data.recipes.map(recipe => new Recipe(recipe));
    Display.fromTemplate("recipe_results", {recipes:objs});
    objs.forEach(recipe => {
      recipe.resultListeners();
    })
  });
};

Recipe.prototype.get = function() {
  const owner = this.owner;
  $.get(`/users/${owner.id}/recipes/${this.id}`, data => {
    const obj = new Recipe(data.recipe);
    Display.fromTemplate("recipe", obj);
    owner.adjustBreadcrumb();
    owner.listener(".breadcrumb");
  });
};

Recipe.prototype.resultListeners = function() {
  this.listener(`#recipe-${this.id}`);
  this.owner.listener(`#recipe-${this.id}`);
};

Recipe.prototype.listener = function(recipeDiv) {
  const recipe = this;
  $(recipeDiv).find(".recipeLink").click(function(e) {
    e.preventDefault();
    recipe.get();
  });
};

Recipe.prototype.assignUser = function(user) {
  return user ? new User(user) : undefined;
};

Recipe.prototype.assignIngredients = function(ingredients) {
  return ingredients ? ingredients.map(i => new Ingredient(i)) : [];
};
