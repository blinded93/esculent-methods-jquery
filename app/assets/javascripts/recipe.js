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
  $.get("/recipes")
    .done(function(data) {
    Recipe.displayAllRecipes(data);
  });
};

Recipe.displayAllRecipes = function(data) {
  const objs = data.recipes.map(recipe => new Recipe(recipe));
  Display.fromTemplate("recipe_results", {recipes:objs})
    .done(function() {
      Listener.setRecipeResults(objs);
    });
};

Recipe.prototype.get = function() {
  const recipe = this;
  const owner = this.owner;
  $.get(`/users/${owner.id}/recipes/${this.id}`)
    .done(function(data) {
      recipe.display(owner, data);
    });
};

Recipe.prototype.display = function(owner, data) {
  const recipe = this;
  const obj = new Recipe(data.recipe);
  Display.fromTemplate("recipe", obj)
    .done(function() {
      recipe.favorited(recipe)
        .done(function(resp) {
          const linkFunc = Display.linkSelector(".breadcrumb");
          Listener.setSocial(recipe);
          Listener.setUser(recipe.owner, linkFunc);
          Breadcrumb.adjust(recipe.owner.username, "userLink")
        });
    });
};

Recipe.prototype.favorited = function(recipe) {
  const dfd = new $.Deferred();
  $.get(`/recipes/${recipe.id}/favorited`)
    .done(function(resp) {
      recipe.toggleIcon(!!resp.favorite, "favorite");
      dfd.resolve(resp);
    });
  return dfd.promise();
};

Recipe.prototype.toggleIcon = function(boolean, iconName) {
  const offImg = `${iconName}-bw`;
  const onImg = `${iconName}`;
  const $i = $(`#${iconName}Img`);
  if (boolean) {
    $i.attr("src", `/assets/icons/${onImg}.png`);
    $i.off("mouseenter mouseleave");
  } else {
    $i.attr("src", `/assets/icons/${offImg}.png`);
    $i.hover(function() {
      $(this).attr("src", `/assets/icons/${onImg}.png`);
    }, function() {
      $(this).attr("src", `/assets/icons/${offImg}.png`);
    });
  }
};

Recipe.prototype.share = function(recipe) {
  const $shareImg = $(`#share-${this.id}`);
  $shareImg.click(function(e) {
    e.preventDefault();
    
  }).hover(function() {
    $(`#shareImg`).attr("src", `/assets/icons/share.png`);
  }, function() {
    $(`#shareImg`).attr("src", `/assets/icons/share-bw.png`);
  });
};

Recipe.prototype.assignUser = function(user) {
  return user ? new User(user) : undefined;
};

Recipe.prototype.assignIngredients = function(ingredients) {
  return ingredients ? ingredients.map(i => new Ingredient(i)) : [];
};
