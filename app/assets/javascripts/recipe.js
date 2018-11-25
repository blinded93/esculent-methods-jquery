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
  const pageObj = Paginate.createAndDestinate(data.meta, destination);
  const recipes = this.createFrom(recipesJson);
  if (destination === "#mainContent") {
    Breadcrumb.userAssets(data, `${capitalize(recipeType)}`);
  }
  if (isEmpty(recipes)) {
    display.nothingHere(destination);
  } else {
    display.fromTemplate("recipes", {recipes:recipes})
      .toElement(destination)
        .done(function() {
          Listener.setRecipeResults(recipes);
          if (pageObj) { pageObj.displayLinks(dfd, destination); }
        });
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
  display.fromTemplate("recipe", recipe)
    .toElement("#mainContent")
      .done(function() {
        recipe.favorited()
          .done(function(resp) {
            const linkFunc = Display.linkSelector(".breadcrumb");
            Breadcrumb.userAssets(recipe.owner, "Recipes");
            Listener.setSocialBtns(recipe)
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

Recipe.prototype.favorite = function() {
  const recipe = this;
  $.post(`/recipes/${recipe.id}/favorite`)
    .done(function(resp) {
      if (isEmpty(resp.errors)) {
        recipe.toggleIcon(!!resp.favoriteStatus, "favorite");
      } else if (!!resp.errors.loggedOut) {
        AlertMessage.createAutoDismiss(resp.errors.loggedOut, "danger");
      }
    });
};

Recipe.prototype.toggleIcon = function(boolean, iconName) {
  const icon = `#${iconName}Img`;
  if (boolean) {
    changeIconSrc(icon, iconName);
    $(icon).off("mouseenter mouseleave");
  } else {
    changeIconSrc(icon, `${iconName}-bw`)
    iconHover(icon, iconName);
  }
};

Recipe.prototype.setShareSubmit = function() {
  const recipe = this;
  $("#shareRecipeForm").validate({
    onclick: function(element, event) {
      $(element).valid();
    },
    onchange: function(element, event) {
      $(element).valid();
    },
    highlight: function(element, errorClass, validClass) {
      $(element).parent().removeClass(validClass).  addClass(errorClass)
    },
    unhighlight: function(element, errorClass, validClass) {
      $(element).parent().removeClass(errorClass).addClass(validClass);
    },
    errorClass: "its-invalid is-invalid",
    validClass: "is-valid",
    errorPlacement: function(error, element) {
      $("#idontexist").html(error);
    },
    submitHandler: function(form, e) {
      e.preventDefault();
      const formData = new FormData(form);
      $.ajax({
        type: 'post',
        url: `/recipes/${recipe.id}/share`,
        processData: false,
        contentType: false,
        data: formData,
        success: function(resp) {
          if (isEmpty(resp.errors)) {
            recipe.toggleShare();
            AlertMessage.createAutoDismiss(`Shared ${recipe.name} with `, "success");
            $(form).trigger("reset");
          }
        }
      });
    }
  });
};

Recipe.prototype.setShareForm = function() {
  const recipe = this;
  const friends = $("#loggedInAs").data("friends");

  display.fromTemplate("recipe_share", {friends:friends})
    .toElement(".shareForm", 1)
    .done(function(data) {
      recipe.setShareSubmit();
    });
};

Recipe.prototype.ownedBy = function(id) {
  return id === this.owner.id;
};

Recipe.prototype.toggleShare = function() {
  $("#shareDropdown").slideToggle(200);
};

Recipe.prototype.assignUser = function(user) {
  return user ? new User(user) : undefined;
};

Recipe.prototype.assignIngredients = function(ingredients) {
  return ingredients ? ingredients.map(i => new Ingredient(i)) : [];
};
