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
    menu.setTemplate(menu);
    menu.getType(menu);
  });
};

// User profile menu listeners

Listener.setNav = function(menu, resp) {
  const user = new User(resp.user);
  const linkFunc = Display.linkSelector("#menu");
  Listener.setUser(user, linkFunc);
  Listener.setUserRecipes(user, linkFunc);
  Listener.setUserFavorites(user, linkFunc);
  Listener.setUserFriends(user, linkFunc);
  Listener.setLogout(menu);
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
        Display.alert("Logged out successfully.", "success")
        Recipe.getAllRecipes();
        Display.removeLastBreadcrumb();
      });
    });
  });
};

// Home button listener
Listener.setHome = function() {
  const $home = $("#home");
  $home.addClass("linkCursor");
  $home.click(function(e) {
    e.preventDefault();
    $(".breadcrumb li:not(:first)").remove();
    Recipe.getAllRecipes();
    $home.removeClass("linkCursor");
    $home.off("click");
  });
};

// User results listeners
Listener.setUserResults = function(user) {
  const linkFunc = Display.linkSelector(`#user-${user.id}`);
  this.setUser(user, linkFunc);
  this.setUserRecipes(user, linkFunc);
  this.setUserFavorites(user, linkFunc);
};

Listener.setUser = function(user, linkSelector) {
  linkSelector(".userLink").click(function(e) {
    e.preventDefault();
    user.displayProfile();
  });
};

Listener.setUserRecipes = function(user, linkSelector) {
  linkSelector(".recipesLink").click(function(e) {
    e.preventDefault();
    user.getRecipes(user);
  });
};

Listener.setUserFavorites = function(user, linkSelector) {
  linkSelector(".favoritesLink").click(function(e) {
    e.preventDefault();
    user.getFavorites(user);
  });
};

Listener.setUserFriends = function(user, linkSelector) {
  linkSelector(".friendsLink").click(function(e){
    e.preventDefault();
    user.getFriends(user);
  });
};

// User profile listeners
Listener.setProfile = function(user) {

};

// Recipe results listeners
Listener.setRecipeResults = function(recipes) {
  recipes.forEach(recipe => {
    const linkFunc = Display.linkSelector(`#recipe-${recipe.id}`);
    this.setRecipe(recipe, linkFunc);
    this.setUser(recipe.owner, linkFunc);
  });
};

Listener.setRecipe = function(recipe, linkSelector) {
  linkSelector(".recipeLink").click(function(e) {
    e.preventDefault();
    recipe.get();
  });
};

Listener.setSocial = function(recipe) {
  const linkFunc = Display.linkSelector("#social");
  this.setFavorite(recipe, linkFunc);
  this.setShare(recipe, linkFunc);
};

Listener.setFavorite = function(recipe, linkSelector) {
  const $favLink = linkSelector(".favorite");
  $favLink.click(function(e) {
    e.preventDefault();
    Listener.fav(recipe);
  });
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
