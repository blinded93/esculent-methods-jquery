function Message(json) {
  this.id = json.id;
  this.subject = json.subject;
  this.body = json.body;
  this.readAt = json.read_at;
  this.createdAt = json.created_at;
  this.sender = new User(json.sender);
  if (json.user) { this.user = new User(json.user); }
  if (json.recipe) { this.recipe = new Recipe(json.recipe); }
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

Message.setSubmit = function(user, form, successFunc) {
  $(form).validate({
    onkeyup: function(element, event) {
      $(element).valid();
    },
    errorClass: "its-invalid is-invalid",
    validClass: "is-valid",
    errorPlacement: function(error, element) {
      $("#messageErrors").html(error);
    },
    submitHandler: Message.submit(user, successFunc)
  });
};

Message.submit = function(user, successFunc) {
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
    .markAsRead()
    .setDelete(Message.deleteSuccess);
  return this;
};

Message.prototype.markAsRead = function() {
  const message = this;
  if (!message.readAt) {
    let unreadCount = parseInt($("#unreadCount").text());
    $.post(`/users/${currentUser("id")}/messages/${message.id}/read`)
      .done(function(resp) {
        $(`#message-${resp.message_id}`).removeClass("unread")
        $("#unreadCount").text(unreadCount -= 1);
      });
  }
  return this;
}

Message.prototype.parse = function() {
  if (!!this.recipe) {
    this.setView();
    $("#messageBody").html(`<center class="h6 pt-1">${this.recipe.name}</center><img src="${this.recipe.imageUrl}" style="width:100%"/>`)
  } else if (!!this.user) {
    this.setAccept();
    $("#messageBody").html(`<img src="${this.user.thumbURL}" class="pt-2 pr-2"/>${this.user.username} has sent you a friend request.`);
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
    message.delete();
  });
};

Message.prototype.setView = function() {
  const message = this;
  const recipe_data = {recipe:message.recipe};

  $("#view").click(function(e) {
    message.close(function() {
      message.recipe.get();
    });

  });
};

Message.prototype.setReply = function() {
  const message = this;

  $("#reply").click(function(e) {
    message.close(function() {
      Display.fromTemplate("message_reply", message);
      $(this).html(Display.html).slideDown(200, function() {
        message.setReplyCancel()
          .setReplySubmit()
          .setClose("#messageDropdown .closeMessage");
      });
    });
  });
  return this;
};

Message.prototype.setClose = function(selectors) {
  const message = this;
  $(selectors).one("click", function(e) {
    e.preventDefault();
    message.close();
    $(`#message-${message.id} span`).removeClass("bg-light-blue");
  });
  return this;
};

Message.prototype.setReplyCancel = function() {
  const message = this;
  $("#cancel").click(function(e) {
    e.preventDefault();
    message.close(function() {
      message.display();
      $(this).slideDown(200);
    });
  });
  return this;
};

Message.prototype.setReplySubmit = function(html) {
  const message = this;
  Message.setSubmit(this.sender, "#replyMessageForm", function(resp) {
    message.close();
    Display.alert("Message sent!", "success");
  });
  return this;
};



Message.prototype.setDelete = function(successFunc) {
  const message = this;
  $("#delete").click(function(e) {
    message.delete();
  });
  return this;
};

Message.prototype.delete = function() {
  const message = this;
  $.ajax({
    url:`/users/1/messages/${this.id}`,
    type:'DELETE',
    success: Message.deleteSuccess
  });
};

Message.deleteAll = function(ids) {
  const message = this;
  $.ajax({
    url:`/users/1/messages`,
    data:ids,
    type:'DELETE',
    success: Message.deleteSuccess
  });
};

Message.deleteSuccess = function(resp) {
  Inbox.deleteMessageRows(resp);
  const messagesDeletedCount = resp.message_ids.length;
  let unread = parseInt($("#unreadCount").text());
  $("#unreadCount").text(unread -= messagesDeletedCount);
  $("#messageDropdown").slideUp(200);
};
