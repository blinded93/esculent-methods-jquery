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


Recipe.getAll = function() {
  $.get("/recipes")
    .done(data => Recipe.displayAndSetPageLinks(data));
};


Recipe.displayAndSetPageLinks = function(data) {
  goBack.updateCurrentResult(Recipe.resultsData(data));
  breadcrumb.reset();
  Recipe.displayAll(data, "recipes", "#mainContent")
    .done(pageObj => {
      pageObj.setLinks("/recipes");
    });
};


Recipe.prototype.resultData = function(data) {
  return {
    url: `/users/${data.recipe.owner.id}/recipes/${this.id}`,
    params: {},
    callback: data => this.display(data)
  }
};


Recipe.resultsData = function(data) {
  return {
    url: "/recipes",
    params: { page: data.meta.page },
    callback: data => Recipe.displayAndSetPageLinks(data)
  }
};


Recipe.displayAll = function(data, recipeType, destination) {
  const dfd = new $.Deferred();
  const recipesJson = data[`${recipeType}`];
  const pageObj = Paginate.createAndDestinate(data.meta, destination);
  const recipes = Recipe.createFrom(recipesJson);

  if (destination === "#mainContent") {
    breadcrumb.addUserAssets(data, `${capitalize(recipeType)}`);
  }
  if (isEmpty(recipes)) {
    display.nothingHere(destination);
  } else {
    display.fromTemplate("recipes", {recipes:recipes})
      .toElement(destination)
        .done(() => {
          Recipe.setResults(recipes);
          if (pageObj) { pageObj.displayLinks(dfd, destination); }
        });
  }
  return dfd.promise();
};


Recipe.createFrom = function(data) {
  return data ? data.map(recipe => new Recipe(recipe)) : [];
};


Recipe.prototype.get = function() {
  $.get(`/users/${this.owner.id}/recipes/${this.id}`)
    .done(data => {
      this.display(data);
    });
};


Recipe.prototype.display = function(data) {
  const recipe = new Recipe(data.recipe);
  recipe.owner = recipe.owner ? recipe.owner : this.owner;

  goBack.updateCurrentResult(this.resultData(data));
  display.fromTemplate("recipe", recipe)
    .toElement("#mainContent")
      .done(() => {
        breadcrumb.addUserAssets(recipe.owner, "Recipes");
        if (isLoggedIn()) {
          recipe.favorited()
            .done(resp => {
              recipe.setSocialBtns()
            });
        }
      });
};


Recipe.prototype.favorited = function() {
  const dfd = new $.Deferred();

  $.get(`/recipes/${this.id}/favorited`)
    .done(resp => {
      this.toggleIcon(!!resp.favorite, "favorite");
      dfd.resolve(resp);
    });
  return dfd.promise();
};


Recipe.prototype.favorite = function() {
  $.post(`/recipes/${this.id}/favorite`)
    .done(resp => {
      if (isEmpty(resp.errors)) {
        this.toggleIcon(!!resp.favoriteStatus, "favorite");
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


Recipe.prototype.displayShareForm = function() {
  const friends = $("#loggedInAs").data("friends");

  display.fromTemplate("recipe_share", {friends:friends})
         .toElement(".shareForm", 1)
           .done(data => {
             this.setShareValidate();
           });
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


// Listeners //

Recipe.setResults = function(recipes) {
  recipes.forEach(recipe => {
    const linkFunc = linkSelectorFunction(`#recipe-${recipe.id}`);

    recipe.setShowLink(linkFunc);
    profile.setLink(recipe.owner, linkFunc);
  });
};


Recipe.prototype.setShowLink = function(linkSelector) {
  linkSelector(".recipeLink").click(e => {
    e.preventDefault();
    goBack.show(this);
    this.get();
  });
  return this;
};


Recipe.prototype.setSocialBtns = function() {
  const links = $("#social a");

  links.each((i, link) => {
    const linkType = capitalize( $(link).attr("class") );
    this[`set${linkType}Link`](link)
  });
};


Recipe.prototype.setFavoriteLink = function(link) {
  const recipe = this;

  $(link).click(e => {
    e.preventDefault();
    this.favorite();
  });
  return this;
};


Recipe.prototype.setShareLink = function(link) {
  const $dropdown = $("#shareDropdown");

  iconHover("#shareImg", "share");
  this.displayShareForm();

  $(link).click(e => {
    e.preventDefault();
    assignCurrentUser();
    this.toggleShare();
  return this;
  });
};


Recipe.prototype.setShareValidate = function() {
  $("#shareRecipeForm").validate({
    onclick: (element, event) => {
      $(element).valid();
    },
    onchange: (element, event) => {
      $(element).valid();
    },
    highlight: (element, errorClass, validClass) => {
      $(element).parent().removeClass(validClass).addClass(errorClass)
    },
    unhighlight: (element, errorClass, validClass) => {
      $(element).parent().removeClass(errorClass).addClass(validClass);
    },
    errorClass: "its-invalid is-invalid",
    validClass: "is-valid",
    errorPlacement: (error, element) => {
      $("#idontexist").html(error);
    },
    submitHandler: (form, e) => this.shareSubmit(form, e)
  });
};


Recipe.prototype.shareSubmit = function(form, e) {
  e.preventDefault();
  $.ajax({
    type: 'post',
    url: `/recipes/${this.id}/share`,
    processData: false,
    contentType: false,
    data: new FormData(form),
    success: resp => this.setShareSuccessFunc(resp)
  });
};


Recipe.prototype.setShareSuccessFunc = function(resp) {
  if (isEmpty(resp.errors)) {
    this.toggleShare();
    AlertMessage.createAutoDismiss(`Shared ${this.name} with ${resp.friend.username}`, "success");
    $("#shareRecipeForm").trigger("reset");
  } else {

  }
};


Recipe.setForm = function(user, method, recipe) {
  this.setAddItem("ingredient")
      .setAddItem("direction")
      .setRemoveItems("ingredient")
      .setRemoveItems("direction")
      .setImageLabel()
      .setRecipeValidate(user, method, recipe)
};


Recipe.setAddItem = function(itemType) {
  const item = capitalize(itemType);

  $(`#add${item}`).click(e => {
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

  $(`#recipe${item}s .close`).each((i, el) => {
    const id = $(el).attr("id").match(/\d+/)[0];

    Recipe.setRemoveItem(itemType, id, el);
  });
  return this;
};


Recipe.setRemoveItem = function(itemType, id, el) {
  $(el).one("click", e => {
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


Recipe.setRecipeValidate = function(user, method, recipe) {
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
    submitHandler: (form, e) => {
      e.preventDefault()
      Recipe.submit(form, method, path);
    }
  });
  return this;
};


Recipe.submit = function(form, method, path) {
  $.ajax({
      type: method,
      url: path,
      processData: false,
      contentType: false,
      data: new FormData(form),
      success: function(resp) {
        new Recipe(resp).display(resp);
      }
  });
};


Recipe.prototype.setEditLink = function(link) {
  const recipe = this;

  iconHover("#editImg", "edit");
  $(link).click(e => {
    e.preventDefault();
    assignCurrentUser();
    display.fromTemplate("recipe_form", recipe)
      .toElement("#mainContent")
        .done(function() {
          Recipe.setForm(recipe.owner, "PATCH", recipe);
        });
  });
};
