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
  if (json.image) {
    this.imageUrl = json.image.url;
    this.thumbUrl = json.image.thumb.url;
  }
}

Recipe.getAllRecipes = function() {
  $.get("/recipes")
    .done(function(data) {
      Recipe.displayAllRecipes(data, "recipes", "#mainContent")
        .done(function(pageObj) {
          pageObj.setLinks("/recipes")
        })
  });
};

Recipe.displayAllRecipes = function(data, recipeType, destination) {
  const dfd = new $.Deferred();
  const recipesJson = data[`${recipeType}`];
  const pageObj = new Paginate(data.meta);
  const recipes = this.createFrom(recipesJson);
  let removeElements;
  if (destination === "#mainContent") {
    Breadcrumb.userAssets(data, `${capitalize(recipeType)}`);
  }
  if (isEmpty(recipes)) {
    Display.nothingHere(destination);
  } else {
    if (data instanceof User) {
      removeElements = ".recipeOwnerLink";
    }
    Display.fromTemplate("recipes", {recipes:recipes})
      .toElement(destination, removeElements).done(() => Listener.setRecipeResults(recipes));
            dfd.resolve(pageObj);
  }
  return dfd.promise();
};

Recipe.createFrom = function(data) {
  return data ? data.map(recipe => new Recipe(recipe)) : [];
};

Recipe.prototype.get = function() {
  const recipe = this;
  const owner = this.owner;
  $.get(`/users/${owner.id}/recipes/${this.id}`)
    .done(function(data) {

      recipe.display(data);
    });
};

Recipe.prototype.display = function(data) {
  const recipe = new Recipe(data.recipe);
  recipe.owner ? recipe.owner : recipe.owner = this.owner;
  Display.fromTemplate("recipe", recipe)
    .toElement("#mainContent")
      .done(function() {
        recipe.favorited()
          .done(function(resp) {
            const linkFunc = Display.linkSelector(".breadcrumb");
            Breadcrumb.userAssets(recipe.owner, "Recipes");
            Listener.setSocial(recipe)
              .setUser(recipe.owner, linkFunc)
          });
      });
};

Recipe.prototype.favorited = function() {
  const recipe = this;
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
    changeIconSrc($i, `${onImg}`);
    $i.off("mouseenter mouseleave");
  } else {
    $i.attr("src", `/assets/icons/${offImg}.png`);
    $i.hover(function() {
      changeIconSrc(this, `${onImg}`);
    }, function() {
      changeIconSrc(this, `${offImg}`);
    });
  }
};

Recipe.prototype.assignUser = function(user) {
  return user ? new User(user) : undefined;
};

Recipe.prototype.assignIngredients = function(ingredients) {
  return ingredients ? ingredients.map(i => new Ingredient(i)) : [];
};
