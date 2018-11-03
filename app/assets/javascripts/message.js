function Message(json) {
  this.id = json.id;
  this.subject = json.subject;
  this.body = json.body;
  this.readAt = json.read_at;
  this.createdAt = json.created_at;
  this.sender = new User(json.sender);
}

Message.createFrom = function(data) {
  return data ? data.map(message => new Message(message)) : [];
};

Message.setCloseForm = function() {
  $("#composeDropdown .closeMessage").click(function(e) {
    e.preventDefault();
    $("#composeDropdown").slideUp(200);
  });
  return this;
};

Message.setNewForm = function(user) {
  $("#newMessageForm").validate({
    onkeyup: function(element, event) {
      $(element).valid();
    },
    errorClass: "its-invalid is-invalid",
    validClass: "is-valid",
    errorPlacement: function(error, element) {
      $("#newMessageErrors").html(error);
    },
    submitHandler: function(form, e) {
      e.preventDefault();
      const formData = new FormData(form);
      $.ajax({
        type: "post",
        url: `/users/${user.id}/messages`,
        data: formData,
        success: function(resp) {
        }
      });
    }
  });
};
