$(function() {
  Display.homeSetup();
  Recipe.getAllRecipes();
});

function Display() {
}

Display.templates = HandlebarsTemplates;

Display.homeSetup = function() {
  Search.setup();
  Menu.setup();
};

Display.fromTemplate = function(template, obj) {
  this.html = this.templates[template](obj);
  return this;
};

Display.toElement = function(elementId, removeElements, time) {
  const html = this.html;
  const dfd = new $.Deferred();
  const t = time || 250;
  $(`${elementId}`).fadeOut(t, function() {
    $(this).html(html).fadeIn(t);
    $(this).find(removeElements).remove();
    dfd.resolve();
  });
  return dfd.promise();
};

Display.alert = function(message, type) {
  this.createAlert(message, type);
  $("#alert").slideDown(200).delay(2000).slideUp(200, function() {
    $(this).html("");
  });
};

Display.createAlert = function(message, type) {
  const div = $(`<div id="alertMessage" class="alert alert-${type} small">`).html(message);
  $("#alert").html(div);
  return this;
};

Display.createSearchAlert = function(query) {
  const html = `<a href='' id='toSearchResults'>Return to results for '${query}'...</a><button id='alertDismiss' type='button' class='close'><span>&times;</span></button>`;
  this.createAlert(html, "light");
  Listener.setAlertDismiss("#alert", Listener.setBackToResults);
  Listener.setAlertDismiss("#alertDismiss");
};

Display.createEditImageAlert = function(imgName, user) {
  const html = `Update your image to <b>${imgName}</b>? <span class='float-right'><a href='' id='confirmImg'>Yes</a> / <a href='' id='denyImg'>No</a></span>`;
  this.createAlert(html, "light");
  Listener.setAlertDismiss("#confirmImg", Listener.setProfileImageSubmit(user))
    .setAlertDismiss("#denyImg");
  return this;
};

Display.createErrorAlert = function(message) {
  this.alert(message, "danger");
  return this;
};

Display.toggleAlert = function() {
  const $a = $("#alert");
  $a.is(":hidden") ? $a.slideDown(200) : $a.slideUp(200);

  return this;
};

Display.alertLogIn = function() {
  this.alert("Must be logged in to do that", "danger");
};

Display.linkSelector = function(parent) {
  return function(child) { return $(`${parent} ${child}`) };
};

Display.nothingHere = function(destination) {
  Display.html = "<div class='text-center'>Nothing to show here!</div>";
  Display.toElement(destination);
};
