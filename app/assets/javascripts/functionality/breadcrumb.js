function Breadcrumb() {
  this.list = $(".breadcrumb");
  this.home = $("#home");
}

Breadcrumb.prototype.listItems = function() { return $(".breadcrumb-item"); };

Breadcrumb.current = function() {
  return $(".breadcrumb").data("breadcrumb");
};


Breadcrumb.createAndSave = function() {
  const bc = new Breadcrumb();

  $("ol.breadcrumb").data("breadcrumb", bc);
};


Breadcrumb.prototype.setHome = function() {
  const bc = this;

  if (!jQuery._data($("#home")[0], "events")) {
    bc.home.addClass("linkCursor")
      .one("click", function(e) {
        e.preventDefault();
        Recipe.getAllRecipes();
        bc.reset();
      });
  }
  return this;
};


Breadcrumb.prototype.reset = function() {
  this.listItems().not(":first").remove();
  this.home.removeClass("linkCursor");
  return this;
};


Breadcrumb.prototype.addLink = function(title, classLink) {
  const $li = $("<li>", {"class": `breadcrumb-item ${classLink}`}).html(title);

  this.setHome()
      .list.append($li);
  return this;
};


Breadcrumb.prototype.addSearch = function() {
  const userTitle = $("#type option:selected").text();
  const searchQuery = $("#search").data("query");

  this.reset()
      .addLink(userTitle, "userLink")
      .addLink(searchQuery, "searchLink");
  return this;
};


Breadcrumb.prototype.addProfile = function(user) {
  const userTitle = isLoggedInAs(user.id) ? "My Profile" : user.username;

  this.reset()
      .addLink(userTitle, "userLink");
  return this;
};


Breadcrumb.prototype.addUserAssets = function(user, items) {
  const linkFunc = linkSelectorFunction(".breadcrumb");

  if (!!user.id) {
    this.reset();

    if (isLoggedInAs(user.id)) {
      this.addLink(`My ${items}`, `${items.toLowerCase()}Link`)
          .addNewRecipeLink();
    } else {
      this.addProfile(user)
          .addLink(items, `${items.toLowerCase()}Link`);
      Listener.setUser(user, linkFunc);
    }

  }
};


Breadcrumb.prototype.addNewRecipeLink = function() {
  const lastItem = this.listItems().last();
  const html = "<a href=''id='createRecipe' class='black small'>&nbsp;&nbsp;(New)</a>";

  if (lastItem.text().includes("Recipes")) {
    lastItem.append(html);
    this.setNewRecipeLink();
  }
};


Breadcrumb.prototype.setNewRecipeLink = function() {
  $("#createRecipe").one("click", function(e) {
    const el = this;

    e.preventDefault()
    e.stopPropagation();
    display.fromTemplate("recipe_form").toElement("#mainContent")
      .done(function() {
        $(el).hide();
        Listener.setRecipeForm(user, "POST");
      });
  });
};
