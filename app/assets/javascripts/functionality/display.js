let display = {};
(function() {
  const templates = HandlebarsTemplates;
  let templateHTML;


  this.fromTemplate = function(template, obj) {
    templateHTML = templates[template](obj);
    return this;
  };
  

  this.hbsPartial = function(template) {
    return templates[template];
  };


  this.template = function(template, obj) {
    return templates[template](obj);
  };


  this.toElement = function(elementId, elapsedTime, isInbox=false) {
    const dfd = new $.Deferred();
    const time = elapsedTime || 250;

    $(`${elementId}`).fadeOut(time, function() {
      display.width(isInbox);
      $(this).html(templateHTML).fadeIn(time);
      dfd.resolve();
    });
    return dfd.promise();
  };


  this.width = function(isInbox) {
    const $main = $("#mainContent");
    toggleClass($main, "inbox", isInbox);
    return !!isInbox;
  };


  this.nothingHere = function(destination, time, isInbox=false) {
    templateHTML = "<div class='text-center'>Nothing to show here!</div>";
    this.toElement(destination, time, isInbox);
  };
}).apply(display);
