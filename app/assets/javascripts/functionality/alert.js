function AlertMessage(message, type) {
  this.element = $("#alert");
  this.message = message;
  this.type = type;
}


AlertMessage.create = function(message, type) {
  const alert = new AlertMessage(message, type);
  const $div = $(`<div id="alertMessage" class="alert alert-${type} small">`).html(message);

  alert.element.html($div);
  return alert;
};


AlertMessage.createAutoDismiss = function(message, type) {
  const alert = this.create(message, type);

  alert.element.slideDown(200).delay(2000).slideUp(200, function() {
    $(this).html("");
  });
};


AlertMessage.createEditImage = function(imgName, user) {
  const html = `Update your image to <b>${imgName}</b>? <span class='float-right'><a href='' id='confirmImg'>Yes</a> / <a href='' id='denyImg'>No</a></span>`;
  const alert = this.create(html, "warning");

  alert.setDismissLink("#confirmImg", profile.setImageSubmit())
       .setDismissLink("#denyImg", () => $("#profileImageInput").val(""))
       .toggle();
};


AlertMessage.createFriendAction = function(type, user) {
  const currentUserId = $("#loggedInAs").data("id");
  const messages = {
    "add":`Send '${user.username}' a friend request?`,
    "remove":`Remove ${user.username}?`
  }
  const html = `${messages[type]} <span class='float-right'><a href='' id='confirm'>Yes</a> / <a href='' id='deny'>No</a></span>`;
  const alert = this.create(html, "warning");

  alert.toggle()
       .setDismissLink("#confirm", user[`${type}Friend`](currentUserId))
       .setDismissLink("#deny");
};


AlertMessage.createError = function(message) {
  this.createAutoDismiss(message, "danger");
};


AlertMessage.prototype.setDismissLink = function(dismisser, afterDismissFunc) {
  const alert = this;

  $(dismisser).one("click", (e) => {
    e.preventDefault();
    alert.element.slideUp(200, function() {
      $("#mainContent").animate({'padding-top':16}, 200);
      if (typeof afterDismissFunc == "function") { afterDismissFunc(); }
    });
  });
  return this;
};


AlertMessage.prototype.toggle = function() {
  const $el = this.element;
  if ($el.is(":hidden")) {
    $el.slideDown(200);
    $("#mainContent").animate({ 'padding-top':35}, 200);
  } else {
    $el.slideUp(200);
    $("#mainContent").animate({'padding-top':16}, 200);
  }
  return this;
};

AlertMessage.toggle = function() {
  (new this()).toggle();
};

AlertMessage.prototype.down = function() { this.element.slideDown(200); };
AlertMessage.prototype.up = function() { this.element.slideUp(200); };