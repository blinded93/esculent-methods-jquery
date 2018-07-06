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
};

Display.fromTemplate = function(template, obj) {
  const html = this.templates[template](obj);
  $("#mainContent").hide().html(html).fadeIn(1000);
};

Display.homeListener = function() {
  const $home = $("#home");
  $home.addClass("linkCursor");
  $home.click((e) => {
    e.preventDefault();
    $(".breadcrumb li:not(:first)").remove();
    Recipe.getAllRecipes();
    $home.removeClass("linkCursor");
    $home.off("click");
  });
};

// Menu

function loadMenu() {

}
