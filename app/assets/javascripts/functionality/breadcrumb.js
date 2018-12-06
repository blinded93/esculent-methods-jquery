let breadcrumb = {};
(function() {
  const list = $(".breadcrumb");
  const home = $("#home");
  const listItems = $(".breadcrumb-item");


  this.listItems = function() { return $(".breadcrumb-item"); }

  this.setHome = function() {
    if (!$._data($("#home")[0], "events")) {
      $("#home").addClass("linkCursor")
                .one("click", function(e) {
                  e.preventDefault();
                  Recipe.getAllRecipes();
                  breadcrumb.reset();
                });
    };
    return this;
  };


  this.reset = function() {
    this.listItems().not(":first").remove();
    $("#home").removeClass("linkCursor");
    return this;
  };


  this.addLink = function(title, classLink) {
    const linkCursor = !title.includes("Messages") ? "linkCursor " : "";
    const $li = $("<li>", {"class": `${linkCursor} breadcrumb-item ${classLink}`}).html(title);

    this.setHome()
    $(".breadcrumb").append($li);
    return this;
  }


  this.addSearch = function() {
    const userTitle = $("#type option:selected").text();
    const searchQuery = $("#search").data("query");

    this.reset()
        .addLink(userTitle, "userLink")
        .addLink(searchQuery, "searchLink");

    return this;
  };


  this.addProfile = function(user) {
    const userTitle = isLoggedInAs(user.id) ? "My Profile" : user.username;

    this.reset()
        .addLink(userTitle, "userLink");
    return this;
  };


  this.addUserAssets = function(user, items) {
    const linkFunc = linkSelectorFunction(".breadcrumb");

    if (!!user.id) {
      this.reset()

      if (isLoggedInAs(user.id)) {
        this.addLink(`My ${items}`, `${items.toLowerCase()}Link`)
            .addNewRecipeLink(user);

        if (!items.includes("Messages")) { user[`set${items}Link`](linkFunc, "#mainContent"); }
      } else {
        this.addProfile(user)
            .addLink(items, `${items.toLowerCase()}Link`);
        user.setProfileLink(linkFunc);
      }
    }
  };


  this.addNewRecipeLink = function(user) {
    const lastItem = this.listItems().last();
    const html = "<a href='' id ='createRecipe' class'black small'>&nbsp;&nbsp;(New)</a>";

    if (lastItem.text().includes("Recipes")) {
      lastItem.append(html);
      this.setNewRecipeLink(user);
    }
  };


  this.setNewRecipeLink = function(user) {
    $("#createRecipe").one("click", function(e) {
      const el = this;

      e.preventDefault();
      e.stopPropagation();
      display.fromTemplate("recipe_form").toElement("#mainContent")
        .done(function() {
          $(el).hide();
          Recipe.setForm(user, "POST");
        });
    });
  };
}).apply(breadcrumb);
