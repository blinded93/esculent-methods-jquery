function Breadcrumb() {
}

Breadcrumb.adjust = function(title, classLink) {
  const $li = $("<li>", {"class": `breadcrumb-item ${classLink}`}).html(title);
  Listener.setHome();
  $(".breadcrumb").append($li);
  return this;
};

Breadcrumb.link = function() {
  Listener.setBcLink();
};

Breadcrumb.navItem = function(title, classLink) {
  const bc = this;
  return function() {
    bc.reset()
      .adjust(`My ${title}`, classLink);
  };
};

Breadcrumb.removeLast = function() {
  if ($(".breadcrumb").children()[1]) {
    $(".breadcrumb").children().last().remove();
  }
  return this;
};

Breadcrumb.reset = function() {
  $(".breadcrumb li:not(:first)").remove();
  $("#home").removeClass("linkCursor");
  return this;
};

Breadcrumb.search = function() {
  Breadcrumb.reset()
    .adjust($("#type option:selected").text())
    .adjust(`'${$('#search').data('query')}'`, "searchLink");
};

Breadcrumb.profile = function(user) {
  const userTitle = isLoggedInAs(user.id) ? "My Profile" : user.username;
  this.reset()
    .adjust(userTitle, "userLink");
  return this;
};

Breadcrumb.userAssets = function(user, items, optionalItems) {
  if (!!user.id) {
    if (isLoggedInAs(user.id)) {
      this.reset()
        .adjust(`My ${items}`, `${items.toLowerCase()}Link`);
    } else {
      this.reset()
        .profile(user)
        .adjust(optionalItems || items, `${items.toLowerCase()}Link`);
    }
  }
};
