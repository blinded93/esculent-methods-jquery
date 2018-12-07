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
    .done(data => Recipe.displayAndSetPageLinks(data));
};


Recipe.displayAndSetPageLinks = function(data) {
  goBack.updateCurrentResults(Recipe.resultsData(data));
  breadcrumb.reset();
  Recipe.displayAllRecipes(data, "recipes", "#mainContent")
    .done(function(pageObj) {
      pageObj.setLinks("/recipes");
    });
};


Recipe.resultsData = function(data) {
  return {
    url: "/recipes",
    params: { page: data.meta.page },
    callback: data => Recipe.displayAndSetPageLinks(data)
  }
};


Recipe.displayAllRecipes = function(data, recipeType, destination) {
  const dfd = new $.Deferred();
  const recipesJson = data[`${recipeType}`];
  const pageObj = Paginate.createAndDestinate(data.meta, destination);
  const recipes = this.createFrom(recipesJson);
  const breadcrumb = Breadcrumb.current();

  if (destination === "#mainContent") {
    breadcrumb.addUserAssets(data, `${capitalize(recipeType)}`);
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
        breadcrumb.addUserAssets(recipe.owner, "Recipes");
        if (isLoggedIn()) {
          recipe.favorited()
            .done(function(resp) {
              Listener.setSocialBtns(recipe)
            });
        }
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


// Listeners //

Recipe.setResults = function(recipes) {
  recipes.forEach(recipe => {
    const linkFunc = linkSelectorFunction(`#recipe-${recipe.id}`);

    recipe.setShowLink(linkFunc)
    recipe.owner.setProfileLink(linkFunc)
  });
};


Recipe.prototype.setShowLink = function(linkSelector) {
  const recipe = this;

  linkSelector(".recipeLink").click(function(e) {
    e.preventDefault();
    goBack.show(this);
    recipe.get();
  });
  return this;
};


Recipe.prototype.setSocialBtns = function() {
  const links = $("#social a");
  const recipe = this;

  links.each(function(i, link) {
    const linkType = capitalize( $(link).attr("class") );
    recipe[`set${linkType}Link`](link)
  });
};


Recipe.prototype.setFavoriteLink = function(link) {
  const recipe = this;

  $(link).click(function(e) {
    e.preventDefault();
    recipe.favorite();
  });
  return this;
};


Recipe.prototype.setShareLink = function(link) {
  const recipe = this;
  const $dropdown = $("#shareDropdown");

  iconHover("#shareImg", "share");
  recipe.displayShareForm();

  $(link).click(function(e) {
    e.preventDefault();
    assignCurrentUser();
    recipe.toggleShare();
  return this;
  });
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
      $(element).parent().removeClass(validClass).addClass(errorClass)
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


Recipe.setForm = function(user, method, recipe) {
  this.setAddItem("ingredient")
      .setAddItem("direction")
      .setRemoveItems("ingredient")
      .setRemoveItems("direction")
      .setImageLabel()
      .setRecipeSubmit(user, method, recipe)
};


Recipe.setAddItem = function(itemType) {
  const item = capitalize(itemType);

  $(`#add${item}`).click(function(e) {
    const itemObj = {id:randomId()};
    const html = display.template(itemType, itemObj);

    e.preventDefault();
    $(`#recipe${item}s`).append(html);
    Recipe.setRemoveItem(itemType, itemObj.id, $(`#remove-${itemObj.id}`));
  });
  return this;
};


Recipe.setRemoveItems = function(itemType) {
  const item = capitalize(itemType);

  $(`#recipe${item}s .close`).each(function(i, el) {
    const id = $(el).attr("id").match(/\d+/)[0];

    Recipe.setRemoveItem(itemType, id, el);
  });
  return this;
};


Recipe.setRemoveItem = function(itemType, id, el) {
  $(el).one("click", function(e){
    $(`#${itemType}-${id}`).remove();
  });
};


Recipe.setImageLabel = function() {
  $("#recipeImage").change(function(e) {
    const labelText = !!this.files.length ? this.files[0].name : "Choose file (opt)...";

    $(".custom-file-label").text(labelText);
  });
  return this;
};


Recipe.setRecipeSubmit = function(user, method, recipe) {
  let path = `/users/${user.id}/recipes`;
  path = recipe ? path + `/${recipe.id}` : path;

  $("#recipeForm").validate({
    onkeyup: function(element, event) {
      $(element).valid();
    },
    rules: {
      "recipe[image]": {
        extension: "jpg|jpeg|png"
      }
    },
    messages: {
      "recipe[image]": {
        extension: "Please upload a jpeg or png file."
      }
    },
    onclick: function(element, event) {
      $(element).valid();
    },
    errorClass: "its-invalid is-invalid",
    validClass: "is-valid",
    errorPlacement: function(error, element) {
      $("#recipeFormErrors").html(error);
    },
    submitHandler: function(form, e) {
      e.preventDefault();
      const formData = new FormData(form);
      $.ajax({
          type: method,
          url: path,
          processData: false,
          contentType: false,
          data: formData,
          success: function(resp) {
            new Recipe(resp).display(resp);
          }
      });
    }
  });
  return this;
};

Recipe.prototype.setEditLink = function(link) {
  const recipe = this;

  iconHover("#editImg", "edit");
  $(link).click(function(e) {
    e.preventDefault();
    assignCurrentUser();
    display.fromTemplate("recipe_form", recipe)
      .toElement("#mainContent")
        .done(function() {
          Recipe.setForm(recipe.owner, "PATCH", recipe);
        });
  });
};
