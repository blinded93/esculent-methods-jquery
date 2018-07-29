function Session(form) {
  this.form = form;
}

Session.prototype.signUp = function() {
  const session = this;
  $.post("/signup", session.form.serialize())
    .done(function(resp){

    });
};

Session.prototype.logIn = function() {
  const session = this;
  $.post("/login", session.form.serialize())
    .done(function(resp){

    });
};
