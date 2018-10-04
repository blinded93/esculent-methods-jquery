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
  $("#menu").data({menu:menu});
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
        user.recipes = recipes;
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
        Listener.setRecipeForm(user, "POST");
      });
  });
};

Listener.setRecipeForm = function(user, method, recipe) {
  this.setAddItem("ingredient")
    .setAddItem("direction")
    .setRemoveItems("ingredient")
    .setRemoveItems("direction")
    .setRecipeSubmit(user, method, recipe);
  $("#recipeImage").change(function(e) {
    const text = !!this.files.length ? this.files[0].name : "Choose file (opt)...";
    $(".custom-file-label").text(text);
  });
};

Listener.setRecipeSubmit = function(user, method, recipe) {
  const path = recipe ? `/users/${user.id}/recipes/${recipe.id}` : `/users/${user.id}/recipes`
  $("#recipeForm").validate({
    onkeyup: function(element, event) {
      $(element).valid();
    },
    rules: {
      "recipe[image]": {
        extension: "jpg|jpeg|gif|png"
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

Listener.setAddItem = function(itemType) {
  $(`#add${capitalize(itemType)}`).click(function(e) {
    e.preventDefault();
    const i = {id:randomId()};
    Display.fromTemplate(itemType, i);
    $(`#recipe${capitalize(itemType)}s`).append(Display.html);
    Listener.setRemoveItem(itemType, i.id, $(`#remove-${i.id}`));
  });
  return this;
};

Listener.setRemoveItems = function(itemType) {
  $(`#recipe${capitalize(itemType)}s .close`).each(function(i, el) {
    const id = $(el).attr("id").match(/\d+/)[0];
    Listener.setRemoveItem(itemType, id, el);
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
  Listener.setEditProfileImageBtn(user)
    // .setProfileImageSubmit(user)
    .setPreview(user, "Recipes", "recipes")
    .setPreview(user, "Favorites", "recipes")
    .setPreview(user, "Friends", "users");
};

Listener.setEditProfileImageBtn = function(user) {
  $("#upload").hover(function() {
    changeIconSrc(`#${this.id}`, "upload-on");
  }, function() {
    changeIconSrc(`#${this.id}`, "upload-off");
  });
  this.setProfileImageTypeCheck(user);
  return this;
};

Listener.setProfileImageTypeCheck = function(user) {
  $("#profileImageInput").change(function(e) {
    const imgName = this.value.replace(/^.*[\\\/]/, '');
    if (["jpeg", "jpg", "gif", "png"].includes(getExt(this))) {
      Display.createEditImageAlert(imgName, user)
        .toggleAlert();
    } else {
      const border = "border border-danger rounded";
      $("#upload").addClass(border).delay(2150).queue(function() {
        $("#profileImageInput").val("");
        $(this).removeClass(border).dequeue();
      });
      Display.createErrorAlert("Profile image must be jpeg or png.");
    }
  });
};

Listener.setProfileImageSubmit = function(user) {
  return function() {
    const form = document.getElementById("editProfileImage");
    const formData = new FormData(form);
    $.ajax({
      type: 'PATCH',
      url: `/users/${user.id}`,
      processData: false,
      contentType: false,
      data: formData,
      success: function(resp) {
        const url = resp.user.avatar.url;
        $("#userAvatar").fadeOut(200, function() {
          $("#userAvatar").attr("src", url);
        }).fadeIn(200);
        const menu = $("#menu").data().menu;
        menu.getType(menu);
      }
    });
  };
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
    .setShare(recipe, linkFunc)
    .setEditRecipe(recipe, linkFunc);
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
    changeIconSrc(this, "share");
  }, function() {
    changeIconSrc(this, "share-bw");
  }).click(function(e) {
    e.preventDefault();

  })
  return this;
};

Listener.setEditRecipe = function(recipe, linkSelector) {
  $("#editImg").hover(function() {
    changeIconSrc(this, "edit");
  }, function() {
    changeIconSrc(this, "edit-bw");
  }).click(function(e) {
    e.preventDefault();
    getCurrentUser();
    if (isLoggedInAs(recipe.owner.id)) {
      Display.fromTemplate("recipe_form", recipe)
      .toElement("#mainContent")
      .done(function() {
        Listener.setRecipeForm(recipe.owner, "PATCH", recipe);
      });
    } else {
      Display.createErrorAlert("You do not own this recipe.")
    }
  })
};
// Search listener

Listener.setSearch = function(search) {
  $("#query").on("keyup", function(e) {
    $(this).removeClass("is-invalid");
  })
  search.submit.click(function(e) {
    const url = search.typeToURL();
    const query = search.processQuery();
    e.preventDefault();
    $.get(url, {query:query})
      .done(function(data) {
        if ($("#query").val()) {
          search.type = $("#type").val()
          search.query = $("#query").val()
          search.populateData(data.meta)
          .resetSearchAlert()
          .evaluateResp(data)
          $("#query").val("");
        } else {
          $("#query").addClass("is-invalid");
          Display.createSearchErrorAlert();
        }
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
      if (typeof afterDismissFunc == "function") {
        afterDismissFunc();
      }
    });
  });
  return this;
};
