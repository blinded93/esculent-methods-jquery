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
        .getType()
          .done(user => user.setLoggedInAs());
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
    const dfd = new $.Deferred();

    $.get("/current_user")
      .done(resp => {
        this.load(resp);

        if (!!$("#dropdownMenu form").length) {
          this.setSession();
        } else {
          const user = new User(resp.user);

          inbox.assignOwner(user);

          this.setNav(user);
          dfd.resolve(user);
        }
      });
      return dfd.promise();
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
    $("#loggedInAs").html("");
    $("#dropdownMenu").slideUp(100, function() {
      template = "login";
      menu.getType();
      AlertMessage.createAutoDismiss("Logged out successfully.", "success");
      $("#loggedInAs").removeData();
      Recipe.getAll();
      breadcrumb.reset();
    });
  };

  this.displayNav = function(userData) {
    const user = new User(userData);

    $("#dropdownMenu").slideUp(200, () => {
      template = "nav";
      this.getType();
      user.setLoggedInAs();
      AlertMessage.createAutoDismiss(`Logged in as ${user.username}`, "success");
    });
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
      session[template]();
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
      const successFunc = this.confirmSuccess;

      e.preventDefault();
      session.logout(successFunc);
    });
    return this;
  };


}).apply(menu);
