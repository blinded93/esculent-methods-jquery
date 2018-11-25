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
  const linkFunc = linkSelectorFunction("#menu");
  this.setUser(user, linkFunc)
    .setUserRecipes(user, linkFunc, "#mainContent")
    .setUserFavorites(user, linkFunc, "#mainContent")
    .setUserFriends(user, linkFunc, "#mainContent")
    .setUserInbox(user, linkFunc, "#mainContent")
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
      $("#loggedInAs").html("");
      menu.element.slideUp(100, function() {
        menu.template = "login";
        menu.getType(menu);
        AlertMessage.createAutoDismiss("Logged out successfully.", "success");
        $("#loggedInAs").removeData();
        Recipe.getAllRecipes();
        Breadcrumb.reset();
      });
    });
  });
};

// User results listeners

Listener.setUserResults = function(users) {
  users.forEach(user => {
    const linkFunc = linkSelectorFunction(`#user-${user.id}`);
    Listener.setUser(user, linkFunc, "#mainContent")
      .setUserRecipes(user, linkFunc, "#mainContent")
      .setUserFavorites(user, linkFunc, "#mainContent")
      .setAddFriendBtn(user, "16", linkFunc);
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

Listener.setAddFriend = function(user, linkSelector) {
  linkSelector(".addFriend").click(function(e) {
    e.preventDefault();
    Search.backToResultsLink();
    AlertMessage.createAddFriend(user);
  });
};

Listener.setUserRecipes = function(user, linkSelector, destination) {
  linkSelector(".recipesLink").click(function(e) {
    const preview = destination === "#mainContent" ? null : true;

    e.preventDefault();
    Search.backToResultsLink();
    user.getRecipes(preview)
      .done(function(data) {
        user.assignAssetsAndMeta(data);
        Recipe.displayAllRecipes(user, "recipes", destination)
          .done(function(pageObj) {
            pageObj.setLinks(`/users/${user.id}/recipes`, preview);
          });
      });
  });
  return this;
};

Listener.setNewRecipe = function(user) {
  $("#createRecipe").one("click", function(e) {
    const el = this;
    e.preventDefault();
    e.stopPropagation();
    display.fromTemplate("recipe_form").toElement("#mainContent")
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
  const path = recipe ? `/users/${user.id}/recipes/${recipe.id}` : `/users/${user.id}/recipes`;
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

Listener.setAddItem = function(itemType) {
  $(`#add${capitalize(itemType)}`).click(function(e) {
    e.preventDefault();
    const i = {id:randomId()};
    display.fromTemplate(itemType, i);
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
      .done(function(data) {
        user.assignAssetsAndMeta(data);
        Recipe.displayAllRecipes(user, "favorites", destination)
          .done(function(pageObj) {
            pageObj.setLinks(`/users/${user.id}/favorites`, preview);
          });
      });
  });
  return this;
};

Listener.setUserFriends = function(user, linkSelector, destination) {
  linkSelector(".friendsLink").click(function(e){
    e.preventDefault();
    const preview = destination === "#mainContent" ? null :true;
    user.getFriends()
      .done(function(data) {
        user.assignAssetsAndMeta(data);
        User.displayAllUsers(user, "friends", destination)
          .done(function(pageObj) {
            pageObj.setLinks(`/users/${user.id}/friends`, preview);
          });
      });
  });
  return this;
};

Listener.setUserInbox = function(user, linkSelector, destination) {
  linkSelector(".messagesLink").click(function(e) {
    e.preventDefault();
    user.getMessages("all")
      .done(function(data) {
        user.assignAssetsAndMeta(data);
        user.displayInbox(destination)
      });
  });
  return this;
};

Listener.setUserMessages = function(user, linkSelector, destination) {
  linkSelector(".messagesLink").click(function(e) {
    e.preventDefault();
    user.getMessages("unread")
      .done(function(data) {
        user.messages = data.messages;
        user.displayMessages(destination)
          .done(function() {

          });
      });
  });
  return this;
};

// User inbox listeners

Listener.setInboxBtns = function(user) {
  Message.deleteBtnOnCheck();
  Listener.setComposeBtn(user)
    .setDeleteBtn()
    .setFilterSelect(user);
};

Listener.setMessages = function(messages) {
  messages.forEach(function(message, i) {
    const linkFunc = linkSelectorFunction(`#message-${message.id}`);
    Listener.setUser(message.sender, linkFunc)
            .setMessage(message, linkFunc);
  });
};

Listener.setMessage = function(message, linkSelector) {
  const $messageRow = $(`#message-${message.id} span`);

  linkSelector(".messageLink").click(function(e) {
    e.preventDefault();
    e.stopPropagation();
    $messageRow.addClass("bg-light-blue");
    message.display()
      .setClose("html, #messageDropdown a.closeMessage");
    $("#messageDropdown").click((e) => e.stopPropagation())
      .slideDown(200);
    Search.backToResultsLink();
  }).addClass("linkCursor");

  return this;
};

Listener.setComposeBtn = function(user) {
  Message.setForm(user);
  $("#composeBtn").click(function(e) {
    e.preventDefault();
    $("#composeDropdown").slideToggle(200);
  });
  return this;
};

Listener.setDeleteBtn = function() {
  $("#deleteBtn").click(function(e) {
    e.preventDefault();
    const checked = $(".deleteChecks:checked");
    Message.deleteAll(checked);
  });
  return this;
};

Listener.setFilterSelect = function(user) {
  $("#messageFilterInput").change(function(e) {
    const selectedScope = $(this).children("option:selected").val();
    user.getMessages(selectedScope)
      .done(function(data) {
        user.messages = data.messages;
        user.displayMessages("#messageInbox")
          .done(function() {
            Message.deleteBtnOnCheck();
          })
      })
  });
};

// User profile listeners
Listener.setProfile = function(user) {
  const linkFunc = linkSelectorFunction(".profileImage");
  $("#seeAll").show();
  user.getRecipes(true)
    .done(function(data) {
      user.recipes = data.recipes;
      user.displayPreview("Recipes", "recipes");
    });
  user.getMessages("count")
    .done(function(data) { $("#unreadCount").text(`${data.unread_count}`)});
  Listener.setEditProfileImageBtn(user)
    .setAddFriendBtn(user, "24", linkFunc)
    .setPreview(user, "Recipes", "recipes")
    .setPreview(user, "Favorites", "recipes")
    .setPreview(user, "Friends", "users")
    .setPreview(user, "Notifications", "messages");
};

Listener.setEditProfileImageBtn = function(user) {
  iconHover("#upload", "upload");
  this.setProfileImageTypeCheck(user);
  return this;
};

Listener.setProfileImageTypeCheck = function(user) {
  $("#profileImageInput").change(function(e) {
    const imgName = this.value.replace(/^.*[\\\/]/, '');
    if (["jpeg", "jpg", "png"].includes(getExt(this))) {
      AlertMessage.createEditImage(imgName, user);
    } else {
      window.setTimeout(changeIconSrc, 50, "#upload", "upload-wrong");
      window.setTimeout(changeIconSrc, 2250, "#upload", "upload-bw");
      $("#profileImageInput").val("");
      AlertMessage.createError("Profile image must be jpeg or png.");
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

Listener.setAddFriendBtn = function(user, size, linkFunc) {
  iconHover(".addFriendImg", `add-friend-${size}`);
  this.setAddFriend(user, linkFunc);
  return this;
};

Listener.setPreview = function(user, tab, type) {
  const $tab = $(`#user${tab}`);
  const tabName = $tab.data("tab");

  $tab.click(function(e) {
    e.preventDefault();
    user[`get${tabName}`](true)
      .done(function(assets) {
        $("ul.nav-tabs a.active").removeClass("active");
        $tab.addClass("active");
        user[tabName.toLowerCase()] = assets[tabName.toLowerCase()];
        user.displayPreview(tabName, type);
      });
  });
  return this;
};

Listener.setSeeAll = function(user, tab, type) {
  const $sa = $("#seeAllLink");
  let tabName;
  tabName = tab === "Messages" ? "Inbox" : tab;
  $sa.attr("href", "")
    .removeClass().addClass(`${tab.toLowerCase()}Link`)
    .off("click");
  const linkFunc = linkSelectorFunction("#seeAll");
  this[`setUser${tabName}`](user, linkFunc, "#mainContent");
};

// Recipe results listeners

Listener.setRecipeResults = function(recipes) {
  recipes.forEach(recipe => {
    const linkFunc = linkSelectorFunction(`#recipe-${recipe.id}`);
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

Listener.setSocialBtns = function(recipe) {
  const linkFunc = linkSelectorFunction("#social");
  this.setFavorite(recipe, linkFunc)
    .setShare(recipe, linkFunc)
    .setEditRecipe(recipe, linkFunc);
  return this;
};

Listener.setFavorite = function(recipe, linkFunc) {
  const $favLink = linkFunc(".favorite");
  $favLink.click(function(e) {
    e.preventDefault();
    recipe.favorite();
  });
  return this;
};

Listener.setShare = function(recipe, linkFunc) {
  const $shareLink = linkFunc(".share");
  const $dropdown = $("#shareDropdown");

  iconHover("#shareImg", "share");
  recipe.setShareForm();

  $shareLink.click(function(e) {
    e.preventDefault();
    assignCurrentUser();
    if (isLoggedInAs(recipe.owner.id)) {
      recipe.toggleShare();
    } else {
      AlertMessage.createAutoDismiss("Must be logged in to do that", "danger");
    }


  });
  return this;
};

Listener.setEditRecipe = function(recipe, linkSelector) {
  iconHover("#editImg", "edit")
    .click(function(e) {
      e.preventDefault();
      assignCurrentUser();
      if (!isLoggedIn()) {
        AlertMessage.createError("Must be logged in to do that.");
      } else if (isLoggedInAs(recipe.owner.id)) {
        display.fromTemplate("recipe_form", recipe)
          .toElement("#mainContent")
            .done(function() {
              Listener.setRecipeForm(recipe.owner, "PATCH", recipe);
            });
      } else {
        AlertMessage.createError("You do not own this recipe.");
      }
    });
};
// Search listener

Listener.setSearch = function(search) {
  $("#query").on("keyup", (e) => $(this).removeClass("is-invalid"));

  search.submit.click(function(e) {
    const url = search.typeToURL();
    const query = search.processQuery();

    e.preventDefault();
    $.get(url, {query:query})
      .done(function(data) {
        if ($("#query").val()) {
          search.type = $("#type").val();
          search.query = $("#query").val();
          search.populateData(data.meta)
            .resetSearchAlert()
            .evaluateResp(data);
          $("#query").val("");
        } else {
          $("#query").addClass("is-invalid");
          AlertMessage.createError("A search term is required.");
        }
      });
  });
};

Listener.setBackToResults = function() {
  const $goBack = $("#toSearchResults");
  const data = $("#search").data();
  const search = data.search;
  const url = search.typeToURL(data.type);
  $goBack.one("click", function(e) {
    e.preventDefault();
    $.get(url, {query:data.query, page: data.page})
      .done(resp => search.evaluateResp(resp));
  });
};

// Dismiss alert listener

Listener.setAlertDismiss = function(dismisser, afterDismissFunc) {
  $(dismisser).one("click", function(e) {
    e.preventDefault();
    $("#alert").slideUp(200, function() {
      $("#mainContent").animate({'padding-top':16}, 200);
      if (typeof afterDismissFunc == "function") {
        afterDismissFunc();
      }
    });
  });
  return this;
};
