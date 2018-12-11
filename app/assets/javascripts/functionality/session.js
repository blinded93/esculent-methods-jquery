let session = {};
(function() {
  this.signup = () => { this.post("/signup"); };

  this.login = () => { this.post("/login"); };


  this.post = function(route) {
    $.post(route, $("#dropdownMenu form").serialize())
      .done(resp => {
        session.evaluateResp(resp);
      });
  };


  this.evaluateResp = function(resp) {
    const respObj = resp.session || resp.user;

    if (isEmpty(respObj.errors)) {
      menu.displayNav(respObj);
    } else {
      menu.formErrors(respObj.errors);
    }
  };


  this.logout = function(successFunc) {
    $.ajax({
      url     : "/logout",
      method  : "delete",
      success : successFunc
    });
  };
}).apply(session);
