function Recipe(json) {
  this.assignIngredients = (ingredients) => {
    const array = [];
    if (ingredients) {
      ingredients.forEach((ingredient) => {
        array.push(ingredient);
      });
    }
    return array;
  };

  this.name = json.name;
  this.directions = json.directions;
  this.cookTime = json.cook_time;
  this.prepTime = json.prep_time;
  this.servings = json.servings;
  this.skillLevel = json.skill_level;
  this.ingredients = this.assignIngredients(json.ingredient_amounts);
  this.user = new User(json.user)
}

Recipe.createObjs = (recipes) => {
  recipes.recipes.forEach((recipe) => {
    recipeObjs.push(new Recipe(recipe));
  });
}

Recipe.getJson = () => {
  recipeObjs = [];
  $.get("/recipes", Recipe.createObjs);
  return recipeObjs;
};

Recipe.displayAll = (recipeObjs) => {
  $("#mainContent")
    .append(HandlebarsTemplates.recipe_results({recipes:recipeObjs}));
};

$(function() {
  $("#esculentMethods").click(() => {})
  Recipe.displayAll();
})
