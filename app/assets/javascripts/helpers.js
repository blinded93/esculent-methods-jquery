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

function randomId() {
  return Math.floor(Math.random() * 100000)
}

function changeIconSrc(btn, imgName) {
  $(btn).attr("src", `/assets/icons/${imgName}.png`);
}

function getExt(element) {
  return $(element).val().split(".").pop().toLowerCase();
}
