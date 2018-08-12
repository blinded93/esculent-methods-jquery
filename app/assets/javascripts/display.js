function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

function isLoggedIn() {
  const dfd = new $.Deferred();
  $.get("/current_user")
    .done(function(resp) {
      if (!!resp) {
        dfd.resolve(!!resp);
      } else {
        dfd.reject(!!resp);
      }
    });
  return dfd.promise();
}

$(function() {
  Display.homeSetup();
  Recipe.getAllRecipes();
});

function Display() {
}

Display.templates = HandlebarsTemplates;

Display.homeSetup = function() {
  Search.setup();
  Menu.setup();
};

Display.fromTemplate = function(template, obj) {
  const html = this.templates[template](obj);
  const dfd = new $.Deferred();
  $("#mainContent").fadeOut(250, function() {
    $(this).html(html).fadeIn(500);
    dfd.resolve();
  });
  return dfd.promise();
};

Display.alert = function(message, type) {
  this.createAlert(message, type);
  $("#alert").slideDown(200).delay(1500).slideUp(200, function() {
    $(this).html("");
  });
};

Display.alertLogIn = function() {
  this.alert("Must be logged in to do that", "danger");
};

Display.createAlert = function(message, type) {
  const div = $(`<div id="alertMessage" class="alert alert-${type} small">`).html(message);
  $("#alert").html(div);
};

Display.removeLastBreadcrumb = function() {
  $bc = $(".breadcrumb");
  if ($bc.children()[1]) {
    $bc.children().last().remove();
  }
};

Display.linkSelector = function(parent) {
  return function(child) { return $(`${parent} ${child}`) };;
};

// const resultSelection = function(parent) {
//   return function(child) { return $(`#${parent} .${child}`); };
// };
// const linkSelectorFunc = resultSelection(`user-${this.id}`);
