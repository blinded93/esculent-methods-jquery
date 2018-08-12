function Breadcrumb() {
};

Breadcrumb.adjust = function(title, classLink) {
  const $li = $("<li>", {"class": `breadcrumb-item ${classLink}`}).html(title);
  Listener.setHome();
  this.removeLast();
  $(".breadcrumb").append($li);
};

Breadcrumb.removeLast = function() {
  if ($(".breadcrumb").children()[1]) {
    $(".breadcrumb").children().last().remove();
  }
};
