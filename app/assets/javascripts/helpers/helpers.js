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
  return $(img).hover(function() { changeIconSrc(this, icon); },
                      function() { changeIconSrc(this, `${icon}-bw`); });
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
  if (boolean) { element.addClass(klass); }
  else { element.removeClass(klass); }
}

function isMessage(el) {
  return !!$(el).parents(".message").length;
}

function isMenuItem(el) {
  return $(el).parent().is("#menu");
}
