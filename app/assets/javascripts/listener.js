function Listener() {
}

// LogIn and SignUp menu listeners

Listener.setSession = function(menu) {
  this.setForm(menu);
  this.setFooter(menu);
};

Listener.setForm = function(menu) {
  $("#menuSubmit").click(function(e) {
    e.preventDefault();
    $.post(`/${menu.template}`, menu.form.serialize())
      .done(function(resp){
        menu.evaluateResp(menu, resp);
      });
  });
};

Listener.setFooter = function(menu) {
  $(`#${menu.footer}`).click(function(e) {
    e.stopPropagation();
    e.preventDefault();
    menu.setTemplate(menu)
      .getType(menu);
  });
};

// User profile menu listeners

Listener.setNav = function(menu, resp) {
  const user = new User(resp.user);
  const linkFunc = Display.linkSelector("#menu")
  this.setUser(user, linkFunc)
    .setUserRecipes(user, linkFunc, "#mainContent")
    .setUserFavorites(user, linkFunc, "#mainContent")
    .setUserFriends(user, linkFunc, "#mainContent")
    .setLogout(menu);
};

Listener.setLogout = function(menu) {
  $("#logout").click(function(e) {
    e.preventDefault();
    e.stopPropagation();
    $("#confirmLogout").slideDown(200);
  });
  this.confirmation(menu);
};

Listener.confirmation = function(menu) {
  $("#confirmNo").click(function(e) {
    e.preventDefault();
    e.stopPropagation();
    $("#confirmLogout").slideUp(200);
  });
  $("#confirmYes").click(function(e){
    e.preventDefault();
    $.ajax({
      url:"/logout",
      method:"delete"
    }).done(function(resp) {
      $("#loggedInAs").html("")
      menu.element.slideUp(100, function() {
        menu.template = "login";
        menu.getType(menu);
        Display.alert("Logged out successfully.", "success");
        $("#loggedInAs").removeData();
        Recipe.getAllRecipes();
        Breadcrumb.reset();
      });
    });
  });
};

// Home button listener
Listener.setHome = function() {
  const $home = $("#home");
  $home.addClass("linkCursor");
  $home.one("click", function(e) {
    e.preventDefault();
    Recipe.getAllRecipes();
    Breadcrumb.reset();
  });
};

// User results listeners

Listener.setUserResults = function(users) {
  users.forEach(user => {
    const linkFunc = Display.linkSelector(`#user-${user.id}`);
    Listener.setUser(user, linkFunc, "#mainContent")
      .setUserRecipes(user, linkFunc, "#mainContent")
      .setUserFavorites(user, linkFunc, "#mainContent");
  });
};

Listener.setUser = function(user, linkSelector) {
  linkSelector(".userLink").click(function(e) {
    e.preventDefault();
    Search.backToResultsLink();
    user.displayProfile();
  }).addClass("linkCursor");
  return this;
};

Listener.setUserRecipes = function(user, linkSelector, destination) {
  linkSelector(".recipesLink").click(function(e) {
    e.preventDefault();
    Search.backToResultsLink();
    const preview = destination === "#mainContent" ? null : true;
    user.getRecipes(preview)
      .done(function(recipes) {
        user.recipes = Recipe.createFrom(recipes);
        Recipe.displayAllRecipes(user, "recipes", destination)
      });
  });
  return this;
};

Listener.setNewRecipe = function(user) {
  $("#createRecipe").one("click", function(e) {
    const el = this;
    e.preventDefault();
    Display.fromTemplate("recipe_form").toElement("#mainContent")
      .done(function() {
        $(el).hide();
        Listener.setNewRecipeForm(user);
      });
  });
};

Listener.setNewRecipeForm = function(user) {
  this.setAddIngredient()
    .setAddDirection()
    .setRemoveItems("ingredients")
    .setNewRecipeSubmit(user);
};

Listener.setNewRecipeSubmit = function(user) {
  $("#submitNewRecipe").click(function(e){
    e.preventDefault();
    $.post(`/users/${user.id}/recipes`, $("#newRecipe").serialize())
    .done(function(resp){
      debugger;
    });
  });
  return this;
};

Listener.setAddIngredient = function() {
  $("#addIngredient").click(function(e) {
    e.preventDefault();
    const i = {};
    i.id = randomId();
    Display.fromTemplate("ingredient", i);
    $("#recipeIngredients").append(Display.html);
    Listener.setRemoveItem("ingredient", i.id, $(`#remove-${i.id}`));
  });
  return this;
};

Listener.setAddDirection = function() {
  $("#addDirection").click(function(e) {
    e.preventDefault();
    const id = randomId()
    const html = `<li id="direction-${id}" class="directionList">` +
                    `<textarea name="recipe[directions][]" class="form-control form-control-sm directions" rows="2"></textarea>`+
                    `<button id='remove-${id}' class='ml-3 remove close'>&times;</button>`+
                 `</li>`;
    $("#recipeDirections").append(html);
    Listener.setRemoveItem("direction", id, $(`#remove-${id}`));
  });
  return this;
};

Listener.setRemoveItems = function(itemsType) {
  $(`#recipe${capitalize(itemsType)} .close`).each(function(i, el) {
    Listener.setRemoveItem("ingredient", i+1, el);
  });
  return this;
};

Listener.setRemoveItem = function(itemType, id, el) {
  $(el).one("click", function(e){
    $(`#${itemType}-${id}`).remove();
  });
};

Listener.setUserFavorites = function(user, linkSelector, destination) {
  linkSelector(".favoritesLink").click(function(e) {
    e.preventDefault();
    Search.backToResultsLink();
    const preview = destination === "#mainContent" ? null : true;
    user.getFavorites(preview)
      .done(function(recipes) {
        user.favorites = Recipe.createFrom(recipes);
        Recipe.displayAllRecipes(user, "favorites", destination)
      });
  });
  return this;
};

Listener.setUserFriends = function(user, linkSelector, destination) {
  linkSelector(".friendsLink").click(function(e){
    e.preventDefault();
    user.getFriends()
      .done(function(friends) {
        User.displayAllUsers(user, "friends", destination);
      });
  });
  return this;
};

// User profile listeners
Listener.setProfile = function(user) {
  $("#seeAll").show();
  user.getRecipes(true)
    .done(function(recipes) {
      user.recipes = recipes;
      user.displayPreview("Recipes", "recipes");
    });
    Listener.setPreview(user, "Recipes", "recipes")
      .setPreview(user, "Favorites", "recipes")
      .setPreview(user, "Friends", "users");
};

Listener.setPreview = function(user, tab, type) {
  const $tab = $(`#user${tab}`);
  $tab.click(function(e) {
    e.preventDefault();
    user[`get${tab}`](true)
      .done(function(assets) {
        $("ul.nav-tabs a.active").removeClass("active");
        $tab.addClass("active");
        user[`${tab.toLowerCase()}`] = assets;
        user.displayPreview(tab, type);
      })
  });
  return this;
};

Listener.setSeeAll = function(user, tab, type) {
  const $sa = $("#seeAllLink");
  $sa.attr("href", "")
    .removeClass().addClass(`${tab.toLowerCase()}Link`)
    .off("click");
  const linkFunc = Display.linkSelector("#seeAll");
  this[`setUser${tab}`](user, linkFunc, "#mainContent");
};

// Recipe results listeners

Listener.setRecipeResults = function(recipes) {
  recipes.forEach(recipe => {
    const linkFunc = Display.linkSelector(`#recipe-${recipe.id}`);
    this.setRecipe(recipe, linkFunc)
      .setUser(recipe.owner, linkFunc);
  });
};

Listener.setRecipe = function(recipe, linkSelector) {
  linkSelector(".recipeLink").click(function(e) {
    e.preventDefault();
    Search.backToResultsLink();
    recipe.get();
  });
  return this;
};

Listener.setSocial = function(recipe) {
  const linkFunc = Display.linkSelector("#social");
  this.setFavorite(recipe, linkFunc)
    .setShare(recipe, linkFunc);
  return this;
};

Listener.setFavorite = function(recipe, linkSelector) {
  const $favLink = linkSelector(".favorite");
  $favLink.click(function(e) {
    e.preventDefault();
    Listener.fav(recipe);
  });
  return this;
};

Listener.fav = function(recipe) {
  $.post(`/recipes/${recipe.id}/favorite`)
  .done(function(resp) {
    if (isEmpty(resp.errors)) {
      recipe.toggleIcon(!!resp.favoriteStatus, "favorite")
    } else if (!!resp.errors.loggedOut) {
      Display.alert(resp.errors.loggedOut, "danger");
    }
  });
};

Listener.setShare = function(recipe, linkSelector) {

  $("#shareImg").hover(function() {
    $(this).attr("src", `/assets/icons/share.png`);
  }, function() {
    $(this).attr("src", `/assets/icons/share-bw.png`);
  });
};

// Search listener

Listener.setSearch = function(search) {
  search.submit.click(function(e) {
    e.preventDefault();
    $.post("/search", search.form.serialize())
      .done(function(resp) {
        search.type = $("#type").val()
        search.query = $("#query").val()
        search.populateData()
          .resetSearchAlert()
          .evaluateResp(resp)
        $("#query").val("");
      });
  });
};

Listener.setBackToResults = function() {
  const $goBack = $("#toSearchResults");
  const data = $("#search").data();
  const search = data.search;
  $goBack.one("click", function(e) {
    e.preventDefault();
    $.post("/search", encodeURI(`type=${data.type}&query=${data.query}`))
      .done(resp => search.evaluateResp(resp));
  });
};

// Dismiss alert listener

Listener.setAlertDismiss = function(dismisser, afterDismissFunc) {
  $(dismisser).one("click", function(e) {
    e.preventDefault();
    $("#alert").slideUp(200, function() {
      // $(this).html("");
      if (typeof afterDismissName == 'function') {
        afterDismissFunc();
      }
    });
  });
};
