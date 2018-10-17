// Handlebars
Handlebars.registerHelper("debug", function(optionalValue) {
  console.log("Context");
  console.log("===");
  console.log(this);

  if (optionalValue) {
    console.log("Value");
    console.log("===");
    console.log(optionalValue);
  }
});

Handlebars.registerPartial("ingredient", Display.templates.ingredient);
Handlebars.registerPartial("direction", Display.templates.direction);

Handlebars.registerHelper("ifUnowned", function(id, options) {
  let $el = $("<div />").html(options.fn(this));
  if (!$(".breadcrumb-item").last().text().includes("My")) {
    return $el.html();
  }
})
Handlebars.registerHelper("shortenString", function(length, string) {
  return string.slice(0, length) + "...";
});

Handlebars.registerHelper("getFilename", function(string) {
  return getFilename(string);
})

Handlebars.registerHelper("showIfMoreThanOnePage", function(pages, options) {
  let $el = $("<div />").html(options.fn(this));
  if (pages > 1) { return $el.html(); }
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

//Javascript
function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

function switchElementData(from, to) {
  const data = $(from).data();
  $(to).data(data);
}

function isLoggedInAs(id) {
  return id === $("#loggedInAs").data("id");
}

function currentUser(identifier) {
  return $("#loggedInAs").data(identifier);
}

function getCurrentUser() {
  $.get("/current_user")
    .done((resp) => {
      $("#loggedInAs").data({
        "id": resp.user.id,
        "username": resp.user.username
      });
    });
}

function randomId() {
  return Math.floor(Math.random() * 100000)
}

function changeIconSrc(btn, imgName) {
  $(btn).attr("src", `/assets/icons/${imgName}.png`);
}

function getExt(element) {
  return $(element).val().split(".").pop().toLowerCase();
}

function getFilename(path) {
  return path.match(/[^/]+$/)[0];
}
