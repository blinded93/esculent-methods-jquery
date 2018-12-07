let goBack = {};
(function() {
  const o = {
    url: "/recipes",
    params: {
      page: 1
    },
    callback: () => {}
  };

  this.data = function() {
    return o;
  }


  this.updateCurrentResults = function(obj) {
    for (let key in obj) {
      o[key] = obj[key];
    }
  };


  this.set = function() {
    $("#backButton").off("click");
    $("#backButton").click(function(e) {
      e.preventDefault();
      $.get(o.url, o.params)
        .done(o.callback);
        $("#goBack").fadeOut();
    });
    return this;
  };


  this.show = function(el) {
    if (!isMessage(el) && !isMenuItem(el)) {
      $("#goBack").fadeIn();
    }
  }


  this.hideIf = function(bool) { if (bool) { $("#goBack").fadeOut(); } };


  this.now = function() {

  };
}).apply(goBack);
