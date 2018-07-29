String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}
function Menu(template) {
  this.element = $("#dropdownMenu");
  this.template = template || "login";
  this.form;
  this.footer;
}

Menu.setup = function() {
  const menu = new this();
  menu.getType(menu)
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
  }).done(function() {
    menu.form = $("#dropdownMenu form");
    if (!!menu.form.length) {
      menu.setFooter();
      menu.setSessionListeners(menu);
    } else {
      menu.setNavListeners(menu);
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

Menu.prototype.setSessionListeners = function(menu) {
  menu.formListener(menu);
  menu.footerListener(menu);
};

Menu.prototype.formListener = function(menu) {
  $("#menuSubmit").click(function(e) {
    e.preventDefault();
    $.post(`/${menu.template}`, menu.form.serialize())
      .done(function(resp){
        menu.evaluateResp(resp);
      });
  });
};

Menu.prototype.evaluateResp = function(resp) {

  const respObj = resp.session || resp.user;
  const errors = respObj.errors;
  if (isEmpty(errors)) {
    this.template = "nav";
    this.getType(this);
    this.element.toggleClass("show");
  } else {
    this.formErrors(errors)
  }
};

Menu.prototype.formErrors = function(errors) {
  this.resetInputs();
  for (let field in errors) {
    $(`#${field}`).addClass("is-invalid");
    let message = $("<dd>").html(`${errors[field]}`);
    $(`#${field}`).parent().children(".invalid-feedback").html(message);
  }
};

Menu.prototype.resetInputs = function() {
  let $inputs = $(".menuForm input");
  $inputs.each(function(index, value){
    $(value).removeClass("is-invalid");
  });
};

Menu.prototype.footerListener = function(menu) {
  $(`#${menu.footer}`).click(function(e) {
    e.stopPropagation();
    e.preventDefault();
    menu.setTemplate(menu);
    menu.getType(menu);
  });
};

Menu.prototype.setTemplate = function(menu) {
  if (menu.template === "signup") {
    menu.template = "login";
  } else if (menu.template === "login") {
    menu.template = "signup";
  }
};

Menu.prototype.setNavListeners = function(menu) {
  $.get("/current_user", function(data) {
    const user = new User(data.user);
    menu.recipesListener(user);
    menu.profileListener(user);
    menu.friendsListener(user);
    menu.logoutListener(menu);
  })
};

Menu.prototype.profileListener = function(user) {
  $("#profile").click(function(e) {
    e.preventDefault();
    user.displayProfile();
  });
};

Menu.prototype.recipesListener = function(user) {
  $("#recipes").click(function(e) {
    e.preventDefault();
    user.getRecipes();
  })
};

Menu.prototype.friendsListener = function(user) {
  $("#friends").click(function(e) {
    e.preventDefault();

  })
};

Menu.prototype.logoutListener = function(menu) {
  $("#logout").click(function(e){
    e.preventDefault();
    $.ajax({
      url:"/logout",
      method:"delete"
    }).done(function(resp){
      menu.template = "login";
      menu.getType(menu);
    });
  });
}
