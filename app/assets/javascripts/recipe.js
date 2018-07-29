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

Recipe.getAllRecipes = function() {
  $.get("/recipes", data => {
    Recipe.displayAllRecipes(data);
  });
};

Recipe.displayAllRecipes = function(data) {
  const objs = data.recipes.map(recipe => new Recipe(recipe));
  Display.fromTemplate("recipe_results", {recipes:objs});
  objs.forEach(recipe => {
    recipe.resultListeners();
  });
};

Recipe.prototype.get = function() {
  let recipe = this;
  const owner = this.owner;
  $.get(`/users/${owner.id}/recipes/${this.id}`, data => {
    recipe.display(owner, data);
  });
};

Recipe.prototype.display = function(owner, data) {
  const obj = new Recipe(data.recipe);
  Display.fromTemplate("recipe", obj);
  this.socialListeners();
  owner.adjustBreadcrumb();
  owner.listener(".breadcrumb");
};

Recipe.prototype.socialListeners = function() {
  this.favorited(this);
  this.share(this);
};

Recipe.prototype.favorited = function(recipe) {
  $.get(`/recipes/${recipe.id}/favorited`)
    .done(function(resp) {
      recipe.toggleIcon(!!resp.favorite, "favorite");
      recipe.favoriteListener(recipe, resp.favorite);
    });
};

Recipe.prototype.favoriteListener = function(recipe, favoriteId) {
  this.favImg = $(`#favorite-${recipe.id}`);
  this.favImg.click(function(e) {
    e.preventDefault();
    $.post(`/recipes/${recipe.id}/favorite`, {favorite_id:favoriteId}, function(resp) {
      const boolean = $(recipe.favImg).attr("src").includes("bw");
      recipe.toggleIcon(boolean, "favorite");
    });
  }).hover(function() {
    const boolean = $(this).attr("src").includes("bw");
    recipe.toggleIcon(boolean, "favorite");
  });
};

Recipe.prototype.toggleIcon = function(boolean, iconName) {
  const imageName = boolean ? iconName : `${iconName}-bw`;
  $(`#${iconName}-${this.id}`).attr("src", `/assets/icons/${imageName}.png`);
};

Recipe.prototype.share = function(recipe) {
  const $shareImg = $(`#share-${this.id}`);
  $shareImg.click(function(e) {
    e.preventDefault();

  }).hover(function() {
    const boolean = $(this).attr("src").includes("bw");
    recipe.toggleIcon(boolean, "share");
  });
};

Recipe.prototype.resultListeners = function() {
  const parent = `#recipe-${this.id}`;
  this.listener(parent);
  this.owner.listener(parent);
};

Recipe.prototype.listener = function(parent) {
  const recipe = this;
  const owner = this.owner;
  $(parent).find(".recipeLink").click(function(e) {
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
