let display = {};
(function() {
  const templates = HandlebarsTemplates;
  let templateHTML;


  this.fromTemplate = function(template, obj) {
    templateHTML = templates[template](obj);
    return this;
  };


  this.toElement = function(elementId, elapsedTime, isInbox=false) {
    const dfd = new $.Deferred();
    const time = elapsedTime || 250;

    $(`${elementId}`).fadeOut(t, function() {
      display.width(isInbox);
      $(this).html(templateHTML).fadeIn(t);
      dfd.resolve();
    });
  };


  this.width = function(isInbox) {
    const $main = $("#mainContent");
    toggleClass($main, "inbox", isInbox);
  };


  this.alert = function(message, type) {
    this.createAlert(message, type);
    $("#alert").slideDown(200).delay(2000).slideUp(200, function() {
      $(this).html("");
    });
  };


  this.createAlert = function(message, type) {
    const $div = $(`<div id="alertMessage" class="alert alert-${type} small">`).html(message);
    $("#alert").html($div);
    return this;
  };


  this.setAlertDismiss = function(dismisser, afterDismissFunc) {
    $(dismisser).one("click", function(e) {
      e.preventDefault();
      $("#alert").slideUp(200, function() {
        $("#mainContent").animate({'padding-top':16}, 200);
        if (typeof afterDismissfunc == "function") {
          afterDismissFunc();
        }
      });
    });
    return this;
  };


  this.createSearchAlert = function(query) {
    html = `<a href='' id='toSearchResults'>Return to results for '${query}'...</a><button id='alertDismiss' type='button' class='close'><span>&times;</span></button>`;

    this.createAlert(html, "light")
      .setAlertDismiss("#alert", Listener.setBackToResults)
      .setAlertDismiss("#alertDismiss");
  };


  this.createEditImageAlert = function(imgName, user) {
    html = `Update your image to <b>${imgName}</b>? <span class='float-right'><a href='' id='confirmImg'>Yes</a> / <a href='' id='denyImg'>No</a></span>`;
    this.createAlert(html, "light")
      .setAlertDismiss("#conirmImg", Listener.setProfileImageSubmit(user))
      .setAlertDismiss("#denyImg");
      return this;
  };


  this.createAddFriendAlert = function(user) {
    const currentUserId = $("#loggedInAs").data("id");
    html = `Send "${user.username}" a friend request? <span class='float-right'><a href='' id='confirmFriend'>Yes</a> / <a href='' id='denyFriend'>No</a></span>`;

    this.createAlert(html, "warning")
      .setAlertDismiss("#confirmmFriend", user.addFriend(currentUserId))
      .setAlertDismiss("#denyFriend")
      .toggleAlert();
      return this;
  }



}).apply(display);
