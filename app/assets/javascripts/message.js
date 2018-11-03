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
Message.deleteBtnOnCheck = function() {
  const $checks = $(".deleteChecks").change(function() {
    const checked = $checks.is(':checked');
    $("#deleteBtn").stop().fadeTo(200, checked ? 1 : 0);
  });
};
Message.setSubmit = function(user, form, onSuccessFunc) {
  $(form).validate({
    onkeyup: function(element, event) {
      $(element).valid();
    },
    errorClass: "its-invalid is-invalid",
    validClass: "is-valid",
    errorPlacement: function(error, element) {
      $("#messageErrors").html(error);
    },
    submitHandler: function(form, e) {
      e.preventDefault();
      const formData = new FormData(form);
      $.ajax({
        type: "post",
        url: `/users/${user.id}/messages`,
        data: formData,
        processData: false,
        contentType: false,
        success: onSuccessFunc
      });
    }
  });
Message.prototype.setDisplay = function() {

}

Message.prototype.display = function() {
  Display.fromTemplate("message", this);
  $("#messageDropdown").html(Display.html);
  this.setReply()
    .setDelete($("#messageDropdown input"), this.deleteRowsSuccess);

    return this;
};

Message.prototype.setReply = function() {
  const message = this;
  $("#reply").click(function(e) {
    $("#messageDropdown").fadeOut(200, function() {
      Display.fromTemplate("message_reply", message);
      $(this).html(Display.html).fadeIn(200, function() {
        message.setReplyCancel()
          .setReplySubmit()
          .setClose("#messageDropdown a.closeMessage");
      });
    });
  });
  return this;
};
};
