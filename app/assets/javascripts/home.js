function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
};

$(function() {
  Display.attachListeners();
  Recipe.getAllRecipes();
});

function Display() {
}

Display.templates = HandlebarsTemplates;

Display.attachListeners = function() {
  Search.setup();
  Menu.setup();
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

Display.removeLastBreadcrumb = function() {
  $bc = $(".breadcrumb");
  if ($bc.children()[1]) {
    $bc.children().last().remove();
  }
};
