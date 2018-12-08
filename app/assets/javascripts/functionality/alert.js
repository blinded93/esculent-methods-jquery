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

  alert.setDismissLink("#confirmImg", user.setProfileImageSubmit())
       .setDismissLink("#denyImg")
       .toggle();
};


AlertMessage.createAddFriend = function(user) {
  const currentUserId = $("#loggedInAs").data("id");
  const html = `Send "${user.username}" a friend request? <span class='float-right'><a href='' id='confirmFriend'>Yes</a> / <a href='' id='denyFriend'>No</a></span>`;
  const alert = this.create(html, "warning");

  this.toggle();
  alert.setDismissLink("#confirmFriend", user.addFriend(currentUserId))
       .setDismissLink("#denyFriend");
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
