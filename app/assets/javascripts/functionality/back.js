let goBack = {};
(function() {

  const array = [];
  

  this.last = function (key) {
    const lastEl = array[array.length - 1];
    return key ? lastEl[key] : lastEl;
  };

  this.data = function() {
    return o;
  }

  this.updateCurrentResult = function(obj) {
    let newObj

    if (Object.keys(obj).length === 3) {
      newObj = obj;
    } else {
      const params = {...this.last("params"), ...obj.params};

      newObj = {...this.last(), ...{params:params}};
    }
    if (!equalTo(newObj, this.last())) array.push(newObj);
    goBack.toggle();
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
