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


AlertMessage.createMissingIngredientAction = function(results) {
  const html = display.template("ingredient_action", results);
  const alert = this.create(html, "warning");
  const newQuery = results.ingredients.map(i => i.name);

  alert.setDismissLink("span.close");

  for (const ingredient in results.containing) {
    results.containing[ingredient].forEach(altIngredient => {
      alert.setDismissLink(`#ingredient-${altIngredient.id}`, function() {
        newQuery.push(altIngredient.name);
        search.fire(newQuery);
        breadcrumb.addSearch(newQuery.join(", "));
      });
    });
  }

  if (!isEmpty(results.containing) || !isEmpty(results.missing)) {alert.down()}

};


AlertMessage.createError = function(message) {
  this.createAutoDismiss(message, "danger");
};


AlertMessage.prototype.setDismissLink = function(dismisser, afterDismissFunc) {
  const alert = this;

  $(dismisser).one("click", (e) => {
    e.preventDefault();
    alert.element.slideUp(200, function(e) {
      if (typeof afterDismissFunc == "function") { afterDismissFunc(e); }
    });
  });
  return this;
};


AlertMessage.prototype.toggle = function() {
  if (this.element.is(":hidden")) {
    this.down();
  } else {
    this.up();
  }
  return this;
};


AlertMessage.prototype.down = function() { this.element.slideDown(200); };
AlertMessage.prototype.up = function() { this.element.slideUp(200); };