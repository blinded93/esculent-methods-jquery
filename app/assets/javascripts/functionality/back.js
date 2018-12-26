let goBack = {};
(function() {

  const o = {
    url: "",
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
    $("#backButton").click(e => {
      e.preventDefault();
      array.pop();
      $.get(this.last("url"), this.last("params"))
        .done(this.last("callback"))
        .done(() => this.toggle());
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
