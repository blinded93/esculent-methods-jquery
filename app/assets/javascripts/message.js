function Message(json) {
  this.id = json.id;
  this.subject = json.subject;
  this.body = json.body;
  this.readAt = json.read_at;
  this.createdAt = json.created_at;
  this.sender = new User(json.sender);
  if (json.user) { this.user = new User(json.user); }
  if (json.recipe) { this.recipe = new Reicipe(json.recipe); }
}

Message.createFrom = function(data) {
  return data ? data.map(message => new Message(message)) : [];
};

Message.prototype.close = function(callback) {
  $("#messageDropdown").slideUp(200, callback);
};

Message.setCloseForm = function() {
  $("#composeDropdown .closeMessage").click(function(e) {
    e.preventDefault();
    $("#composeDropdown").slideUp(200);
  });
  return this;
};

Message.deleteBtnOnCheck = function() {
  const $checks = $(".deleteChecks").change(function() {
    const checked = $checks.is(':checked');
    $("#deleteBtn").stop().fadeTo(200, checked ? 1 : 0);
  });
};

Message.setForm = function(user) {
  this.setCloseForm()
    .setSubmit(user, "#newMessageForm", function(resp) {
      $("#composeDropdown").slideUp(200, function() {
        $("#newMessageForm").trigger("reset");
        Message.setForm(user);
      });
      Display.alert("Message sent!", "success");
    });
  return this;
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
    submitHandler: Message.submit(successFunc)
  });
}

};

Message.submit = function(successFunc) {
  return function(form, e) {
    e.preventDefault();
    const formData = new FormData(form);
    $.ajax({
      type: "post",
      url: `/users/${user.id}/messages`,
      data: formData,
      processData: false,
      contentType: false,
      success: successFunc
    });
  };
};

Message.prototype.display = function() {
  Display.fromTemplate("message", this);
  $("#messageDropdown").html(Display.html);
  this.parse()
    .setDelete(this.deleteSuccess);
  return this;
};

Message.prototype.parse = function() {
  if (!!this.user) {
    this.setAccept();
    $("#messageBody").html(`${this.user.username} has sent you a friend request.`);
  } else if (!!this.recipe) {
    this.setView();
    $("#messageBody").html(`${this.recipe.name} has shared a recipe.`)
  } else {
    this.setReply();
  }
  return this;
};

Message.prototype.setAccept = function() {
  const message = this;
  const currentUserId = $("#loggedInAs").data("id");
  $("#accept").click(function(e) {
    message.close(message.sender.confirmFriend(currentUserId));
    Display.alert(`You are now friends with ${message.sender.username}!`, "success");
    message.delete(message.deleteSuccess);
  });
};

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

Message.prototype.setClose = function(selectors) {
  const message = this;
  $(selectors).one("click", function(e) {
    e.preventDefault();
    $("#messageDropdown").slideUp(200);
    $(`#message-${message.id} span`).removeClass("bg-light-blue");
  });
  return this;
};

Message.prototype.setReplyCancel = function() {
  const message = this;
  $("#cancel").click(function(e) {
    e.preventDefault();
    $("#messageDropdown").fadeOut(200, function() {
      message.display();
      $(this).fadeIn(200);
    });
  });
  return this;
};

Message.prototype.setReplySubmit = function(html) {
  Message.setSubmit(this.sender, "#replyMessageForm", function(resp) {
    $("#messageDropdown").slideUp(200);
    Display.alert("Message sent!", "success");
  });
  return this;
};



Message.prototype.setDelete = function(ids, successFunc) {
  $("#delete").click(function(e) {
    $.ajax({
      url:`/users/1/messages`,
      data:ids,
      type:'DELETE',
      success: successFunc
    });
  });
  return this;
};

Message.prototype.deleteRowsSuccess = function(resp) {
  resp.message_ids.forEach(function(id, i, arr){
    $(`#message-${id}`).slideUp(200, function() {
      $(this).remove();
      if (!$(".deleteChecks").length) {
        Display.nothingHere("#messageInbox", "", true);
      }
      $("#deleteBtn").fadeOut(200);
      $("#messageDropdown").slideUp(200);
    });
  });
};
