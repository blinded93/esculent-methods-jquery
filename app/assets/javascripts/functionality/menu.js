let menu = {};
(function() {

  let template = "login";
  let footer;
  const footerTypes = {
    "login"  : "toSignUp",
    "signup" : "toLogIn",
    "nav"    : null
  };


  this.set = function() {
    this.slideEffect()
        .getType();
  };


  this.slideEffect = function() {
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


  this.getType = function() {
    $.get("/current_user")
      .done(resp => {
        this.load(resp);

        if (!!$("#dropdownMenu form").length) {
          this.setSession();
        } else {
          const user = new User(resp.user);

          inbox.assignOwner(user);
          user.setLoggedInAs();
          this.setNav(user);
        }
      });
  };


  this.load = function(resp) {
    if (!!resp) { template = "nav"; }
    const html = display.template(template, resp);
    $("#dropdownMenu").html(html);
    return this;
  };


  this.confirmation = function() {
    this.setConfirmNo()
        .setConfirmYes();
  };


  this.confirmSuccess = function() {
    $("#loggedInas").html("");
    $("#dropdownMenu").slideUp(100, function() {
      template = "login";
      menu.getType();
      AlertMessage.createAutoDismiss("Logged out successfully.", "success");
      $("#loggedInAs").removeData();
      Recipe.getAll();
      breadcrumb.reset();
    });
  };


  this.evaluateResp = function(resp) {
    const respObj = resp.session || resp.user;
    if (isEmpty(respObj.errors)) {
      $("#dropdownMenu").slideUp(200, () => {
        template = "nav";
        this.getType();
        AlertMessage.createAutoDismiss(`Logged in as ${respObj.username}`, "success");
      });
    } else {
      this.formErrors(respObj.errors);
    }
  };


  this.formErrors = function(errors) {
    this.resetInputs();
    for(let field in errors) {
      const message = $("<dd>").html(`${errors[field]}`);

      $(`#${field}`).addClass("is-invalid");
      $(`#${field}`).parent().children(".invalid-feedback").html(message);
    }
  };


  this.resetInputs = function() {
    const $inputs = $(".menuForm input");

    $inputs.each((index, value) => $(value).removeClass("is-invalid"));
  };


  // Listeners //

  this.setSession = function() {
    this.setForm()
        .setFooter();
  };


  this.setForm = function() {
    $("#menuSubmit").click(e => {
      e.preventDefault();
      $.post(`/${template}`, $("#dropdownMenu form").serialize())
        .done(resp => {
          this.evaluateResp(resp);
        });
    });
    return this;
  };


  this.setFooter = function() {
    footer = footerTypes[template];
    if (!!footer) {
      $(`#${footer}`).click(e => {
        e.stopPropagation();
        e.preventDefault();
        this.setTemplate()
            .getType();
      });
    }
  };


  this.setTemplate = function() {
    template = template === "login" ? "signup" : "login";
    return this;
  };


  this.setNav = function(user) {
    const linkFunc = linkSelectorFunction("#menu");
    const links = ["Profile", "Recipes", "Favorites", "Friends", "Inbox"];

    this.setLogoutLink();
    links.forEach(linkType => {
      user[`set${linkType}Link`](linkFunc, "#mainContent");
    });
  };


  this.setLogoutLink = function() {
    $("#logout").click(e => {
      e.stopPropagation();
      e.preventDefault();
      $("#confirmLogout").slideDown(200)
    });
    this.confirmation();
  };


  this.setConfirmNo = function() {
    $("#confirmNo").click(e => {
      e.stopPropagation();
      e.preventDefault();
      $("#confirmLogout").slideUp(200);
    });
    return this;
  };


  this.setConfirmYes = function() {
    $("#confirmYes").click(e => {
      e.preventDefault();
      $.ajax({
        url     : "/logout",
        method  : "delete",
        success : this.confirmSuccess
      });
    });
    return this;
  };


}).apply(menu);
