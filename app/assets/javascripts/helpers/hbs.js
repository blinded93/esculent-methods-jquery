Handlebars.registerHelper("debug", function(optionalValue) {
  console.log("Context", this);
  if (optionalValue) { console.log("Value", optionalValue); }
});

Handlebars.registerPartial("ingredient", display.hbsPartial("ingredient"));
Handlebars.registerPartial("direction", display.hbsPartial("direction"));
Handlebars.registerPartial("messages", display.hbsPartial("messages"));
Handlebars.registerPartial("messageForm", display.hbsPartial("message_form"));
Handlebars.registerPartial("recipeShare", display.hbsPartial("recipe_share"));

Handlebars.registerHelper("ifUnowned", function(id, options) {
  if (!$(".breadcrumb-item").last().text().includes("My")) {
    return options.fn(this);
  }
});

Handlebars.registerHelper("shortenString", function(length, string) {
  if (string.length > length) {
    return string.slice(0, length) + "...";
  } else {
    return string;
  }
});

Handlebars.registerHelper("getFilename", function(string) {
  return getFilename(string);
});

Handlebars.registerHelper("showIfMoreThanOnePage", function(pages, options) {
  if (pages > 1) { return options.fn(this); }
});

Handlebars.registerHelper("selectAttribute", function(attr, options) {
  let $el = $("<select />").html(options.fn(this));
  $el.find(`[value="${attr}"]`).attr("selected", true);
  return $el.html();
});

Handlebars.registerHelper("textAreaDirection", function(direction, options) {
  let $el = $("<li />").html(options.fn(this));
  if (direction.length) {
    $el.find("textarea").text(direction);
  }
  return $el.html();
});

Handlebars.registerHelper("idOrIndex", function(id, index, options) {
  return id ? id : index;
});

Handlebars.registerHelper("direction", function(direction, options) {
  let $el = $("<div />").html(options.fn(this));
  if (!direction) {
    $el.find("li").addClass("disabled");
  }
  return $el.html();
});

Handlebars.registerHelper("firstLast", function(place, current, options) {
  let $el = $("<div />").html(options.fn(this));
  $el.find("a").data("page", place);
  if (place != current && Math.abs(current - place) != 1) {
    return $el.html();
  }
});

Handlebars.registerHelper("prevNext", function(direction, options){
  let $el = $("<div />").html(options.fn(this));
  if (direction) {
    $el.find("a").text(direction);
    return $el.html();
  }
});

Handlebars.registerHelper("formattedDate", function(date) {
  return formattedDate(date);
});

Handlebars.registerHelper("ifOwned", function(ownerId, options) {
  if (ownerId === currentUser("id")) {
    return options.fn(this);
  }
});

Handlebars.registerHelper("ifLoggedIn", function(options) {
  if (isLoggedIn()) {
    return options.fn(this);
  }
});

Handlebars.registerHelper("ifFriend", function(id, options) {
  if (id && !isLoggedInAs(id)) {
    if (isFriend(id) || isPending(id)) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  }
});

Handlebars.registerHelper("ifPending", function(id, options) {
  if (isPending(id)) {
    return options.fn(this);
  }
});

Handlebars.registerHelper("unlessResponse", function(subject, options) {
  if (subject !== "You have a new friend!") {
    return options.fn(this);
  }
});
