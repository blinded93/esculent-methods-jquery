// Handlebars
Handlebars.registerHelper("debug", function(optionalValue) {
  console.log("Context");
  console.log("===");
  console.log(this);
  console.log(this.length)

  if (optionalValue) {
    console.log("Value");
    console.log("===");
    console.log(optionalValue);
  }
});

Handlebars.registerPartial("ingredient", Display.templates.ingredient);
Handlebars.registerPartial("direction", Display.templates.direction);

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

// function getFilename(path) {
//   return $(path) {
//
//   }
// }
