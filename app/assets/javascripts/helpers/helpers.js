// Handlebars
Handlebars.registerHelper("debug", function(optionalValue) {
  // console.log("Context");
  // console.log("===");
  // console.log(this);

  if (optionalValue) {
    console.log("Value");
    console.log("===");
    console.log(optionalValue);
  }
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
    if ($("#loggedInAs").data("friendIds").includes(id)) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  }
});

Handlebars.registerHelper("ifPending", function(id, options) {
  if ($("#loggedInAs").data("pendingFriendIds").includes(id)) {
    return options.fn(this);
  }
});

Handlebars.registerHelper("unlessResponse", function(subject, options) {
  if (subject !== "You have a new friend!") {
    return options.fn(this);
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
  return id === currentUser("id");
}

function isLoggedIn() {
  return !isEmpty(currentUser());
}

function currentUser(identifier) {
  return $("#loggedInAs").data(identifier);
}

function assignCurrentUser() {
  getCurrentUser()
    .done(resp => {
      if (resp) {
        $("#loggedInAs").data({
          "id": resp.user.id,
          "username": resp.user.username
        });
      }
    });
}

function getCurrentUser() {
  return $.get("/current_user");
}

function randomId() {
  return Math.floor(Math.random() * 100000);
}

function iconHover(img, icon) {
  return $(img).hover(function() {
    changeIconSrc(this, icon);
  }, function() {
    changeIconSrc(this, `${icon}-bw`);
  });
}

function changeIconSrc(btn, imgName) {
  return $(btn).attr("src", `/assets/icons/${imgName}.png`);
}

function getExt(element) {
  return $(element).val().split(".").pop().toLowerCase();
}

function getFilename(path) {
  return path.match(/[^/]+$/)[0];
}

function dateString(date) {
  const d = date ? new Date(date) : new Date();
  return d.toDateString();
}

function formattedDate(dateStr) {
  const today = dateString();
  const date = dateString(dateStr);
  return today === date ? "Today" : date.split(" ").slice(1, 3).join(" ");
}

function linkSelectorFunction(parent) {
  return function(child) { return $(`${parent} ${child}`) };
}

function toggleClass(element, klass, boolean) {
  if (boolean) {
    element.addClass(klass);
  } else {
    element.removeClass(klass);
  }
}
