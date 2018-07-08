$(function() {
  Display.attachListeners();
  Recipe.getAllRecipes();
});

function Display() {
}

Display.templates = HandlebarsTemplates;

Display.attachListeners = function() {
  Display.searchListener();
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

Display.searchListener = function() {
  const $form = $("#search");
  $form.submit(function(e) {
    e.preventDefault();
    const params = $form.serialize();
    $.post("/search", params)
      .done(function(resp) {
        debugger;
      });
  });
};

// Menu

function loadMenu() {

}
