String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

function Menu(template) {
  this.element = $("#dropdownMenu");
  this.template = template || "login";
  this.form = null;
  this.footer = null;
}

Menu.setup = function() {
  const menu = new this();
  menu.slideEffect();
  menu.getType(menu);
};

Menu.prototype.setFooter = function() {
  switch (this.template) {
    case "login":
      this.footer = "toSignUp";
      break;
    case "signup":
      this.footer = "toLogIn";
      break;
    case "nav":
      this.footer = undefined;
      break;
  }
};

Menu.prototype.getType = function(menu) {
  $.get("/current_user", function(resp) {
    menu.load(menu, resp);
    menu.form = $("#dropdownMenu form");
    if (!!menu.form.length) {
      menu.setFooter();
      Listener.setSession(menu);
    } else {
      Listener.setNav(menu, resp);
      $("#loggedInAs").html(`<small class='blue'>Logged in as:</small> ${resp.user.username}`);
    }
  });
};

Menu.prototype.load = function(menu, resp) {
  if (!!resp) {
    menu.template = "nav";
  }
  const html = Display.templates[menu.template](resp);
  menu.element.html(html);
};

Menu.prototype.slideEffect = function() {
  $('.dropdown').on('show.bs.dropdown', function() {
    $("#dropdownMenu").slideDown(200);
  });
  $('.dropdown').on('hide.bs.dropdown', function() {
    $("#dropdownMenu").slideUp(200, function() {
      $("#confirmLogout").hide();
    });
  });
};

Menu.prototype.evaluateResp = function(menu, resp) {
  const respObj = resp.session || resp.user;
  const errors = respObj.errors;
  if (isEmpty(errors)) {
    $("#loggedInAs").html(respObj.username)
    menu.element.slideUp(200, function() {
      menu.template = "nav";
      menu.getType(menu);
      Display.alert(`Logged in as ${respObj.username}`, "success");
    });
  } else {
    menu.formErrors(errors);
  }
};

Menu.prototype.formErrors = function(errors) {
  this.resetInputs();
  for (let field in errors) {
    $(`#${field}`).addClass("is-invalid");
    const message = $("<dd>").html(`${errors[field]}`);
    $(`#${field}`).parent().children(".invalid-feedback").html(message);
  }
};

Menu.prototype.resetInputs = function() {
  const $inputs = $(".menuForm input");
  $inputs.each(function(index, value){
    $(value).removeClass("is-invalid");
  });
};

Menu.prototype.setTemplate = function(menu) {
  menu.template = menu.template === "login" ? "signup" : "login";
};
