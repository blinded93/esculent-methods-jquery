$(function() {
  Display.attachListeners();
  Recipe.getAllRecipes();
});

function setSearchForm(path) {
  $("#searchForm").off("submit");
  $("#searchForm").submit(function(e) {
    e.preventDefault();
    console.log($("#searchBar").val());
  });
}

function Display() {
}

Display.templates = HandlebarsTemplates;

Display.attachListeners = function() {
  setSearchForm();
  $("#home").click(() => Recipe.getAllRecipes());
};

Display.fromTemplate = function(template, obj) {
  let html = this.templates[template](obj);
  $("#mainContent").hide().html(html).fadeIn("slow");
}

Display.linkListeners = function() {
  // Display.links(".recipeLink", Recipe.get)
  Display.links(".userLink", User.getRecipes)
};

Display.links = function(linkClass, getFunc) {
  $(linkClass).each((i, link) => {
    const $link = $(link);
    $link.click(e => {
      e.preventDefault();
      getFunc($link.data("id"));
    });
  });
};

Display.adjustBreacrumb = function() {
  $bc = $("#breadcrumbOl");

  debugger;
}



// Menu

function loadMenu() {

}
