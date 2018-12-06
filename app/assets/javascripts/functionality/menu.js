function Menu(template) {
  this.element = $("#dropdownMenu");
  this.template = template || "login";
  this.form = null;
  this.footer = null;
}


Menu.setup = function() {
  const menu = new this();
  
  menu.slideEffect()
      .getType();
};


Menu.prototype.setSession = function() {
  this.setForm()
      .setFooterType()
      .setFooter();
};


Menu.prototype.setFooterType = function() {
  switch (this.template) {
    case "login":
      this.footer = "toSignUp";
      break;
    case "signup":
      this.footer = "toLogIn";
      break;
    case "nav":
      this.footer = null;
      break;
  }
  return this;
};


Menu.prototype.setNav = function(user) {
  const linkFunc = linkSelectorFunction("#menu");
  const links = ["Profile", "Recipes", "Favorites", "Friends", "Inbox"];

  $("#menu").data({menu:this});
  this.setLogoutLink();
  links.forEach(function(linkType) {
    user[`set${linkType}Link`](linkFunc, "#mainContent")
  });
};


Menu.prototype.confirmSuccess = function() {
  const menu = this;
  const breadcrumb = $(".breadcrumb").data("breadcrumb");

  return function() {
    $("#loggedInAs").html("");
    $("#dropdownMenu").slideUp(100, function() {
      menu.template = "login";
      menu.getType();
      AlertMessage.createAutoDismiss("Logged out successfully.", "success");
      $("#loggedInAs").removeData();
      Recipe.getAllRecipes();
      breadcrumb.reset();
    });
  }
};


Menu.prototype.getType = function() {
  const menu = this;

  $.get("/current_user")
    .done(function(resp) {
      menu.load(resp);

      if (!!menu.form.length) {
        menu.setSession();
      } else {
        const user = new User(resp.user);

        user.setLoggedInAs();
        menu.setNav(user);
      }
    });
};


Menu.prototype.load = function(resp) {
  const menu = this;
  if (!!resp) { menu.template = "nav"; }
  const html = display.menuTemplate(menu.template, resp);

  menu.element.html(html);
  menu.form = $("#dropdownMenu form");
  return this;
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
  return this;
};


Menu.prototype.evaluateResp = function(menu, resp) {
  const respObj = resp.session || resp.user;
  const errors = respObj.errors;

  if (isEmpty(errors)) {
    menu.element.slideUp(200, function() {
      menu.template = "nav";
      menu.getType();
      AlertMessage.createAutoDismiss(`Logged in as ${respObj.username}`, "success");
    });
  } else {
    menu.formErrors(errors);
  }
};


Menu.prototype.formErrors = function(errors) {
  this.resetInputs();
  for (let field in errors) {
    const message = $("<dd>").html(`${errors[field]}`);

    $(`#${field}`).addClass("is-invalid");
    $(`#${field}`).parent().children(".invalid-feedback").html(message);
  }
};


Menu.prototype.resetInputs = function() {
  const $inputs = $(".menuForm input");

  $inputs.each(function(index, value){
    $(value).removeClass("is-invalid");
  });
};


Menu.prototype.setTemplate = function() {
  this.template = this.template === "login" ? "signup" : "login";
  return this;
};


// Listeners //

Menu.prototype.setForm = function() {
  const menu = this;

  $("#menuSubmit").click(function(e) {
    e.preventDefault();
    $.post(`/${menu.template}`, menu.form.serialize())
      .done(function(resp){
        menu.evaluateResp(menu, resp);
      });
  });
  return this;
};


Menu.prototype.setFooter = function() {
  const menu = this;

  $(`#${menu.footer}`).click(function(e) {
    e.stopPropagation();
    e.preventDefault();
    menu.setTemplate(menu)
        .getType();
  });
};


Menu.prototype.setLogoutLink = function() {
  $("#logout").click(function(e) {
    e.preventDefault();
    e.stopPropagation();
    $("#confirmLogout").slideDown(200);
  });
  this.confirmation();
};


Menu.prototype.confirmation = function() {
  const menu = this;

  this.setConfirmNo()
      .setConfirmYes();
};


Menu.prototype.setConfirmNo = function() {
  $("#confirmNo").click(function(e) {
    e.preventDefault();
    e.stopPropagation();
    $("#confirmLogout").slideUp(200);
  });
  return this;
};


Menu.prototype.setConfirmYes = function() {
  const menu = this;

  $("#confirmYes").click(function(e){
    e.preventDefault();
    $.ajax({
      url:"/logout",
      method:"delete",
      success: menu.confirmSuccess()
    });
  });
  return this;
};
