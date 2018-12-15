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


Message.setForm = function(user) {
  this.setCloseForm()
      .setSubmit(user, "#newMessageForm", resp => {
        $("#composeDropdown").slideUp(200, () => {
          $("#newMessageForm").trigger("reset");
          Message.setForm(user);
        });
        AlertMessage.createAutoDismiss("Message sent!", "success");
      });
  return this;
};


Message.submit = function(user, successFunc) {
  return function(form, e) {
    const formData = new FormData(form);

    e.preventDefault();
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
  const html = display.hbsPartial("message");

  $("#messageDropdown").html(html(this));
  this.parse()
      .markAsRead()
      .setDelete(Message.deleteSuccess);
  return this;
};


Message.prototype.markAsRead = function() {
  if (!this.readAt) {
    $.post(`/users/${currentUser("id")}/messages/${this.id}/read`)
      .done(resp => {
        $(`#message-${resp.message_id}`).removeClass("unread");
        const countStr = $("#unreadCount").text();

        if (!isEmpty(countStr)) {
          let unreadCount = parseInt(countStr);

          $("#unreadCount").text(unreadCount -= 1);
        }
      });
  }
  return this;
};


Message.prototype.parse = function() {
  if (!!this.recipe) {
    this.setView();
    $("#messageBody").html(`<center class="h6 pt-1">${this.recipe.name}</center><img src="${this.recipe.imageUrl}" style="width:100%"/>`);
  } else if (!!this.user) {
    let message;

    if (this.subject.includes("request")) {
      this.setAccept();
      message = `${this.sender.username} has sent you a friend request.`;
    } else {
      message = `${this.sender.username} has accepted your friend request.`;
    }
    $("#messageBody").html(`<img src="${this.sender.thumbURL}" class="pt-2 pr-2"/>${message}`);
  } else {
    this.setReply();
  }
  return this;
};


Message.prototype.delete = function() {
  $.ajax({
    url:`/users/1/messages/${this.id}`,
    type:'DELETE',
    success: Message.deleteSuccess
  });
};


Message.deleteAll = function(ids) {
  $.ajax({
    url:`/users/1/messages`,
    data:ids,
    type:'DELETE',
    success: Message.deleteSuccess
  });
};


Message.deleteSuccess = function(resp) {
  const messagesDeletedCount = resp.message_ids.length;
  let unread = parseInt($("#unreadCount").text());

  inbox.deleteMessageRows(resp);
  $("#unreadCount").text(unread -= messagesDeletedCount);
  $("#messageDropdown").slideUp(200);
};


// Listeners //


Message.setCloseForm = function() {
  $("#composeDropdown .closeMessage").click(e => {
    e.preventDefault();
    $("#composeDropdown").slideUp(200);
  });
  return this;
};


Message.setSubmit = function(user, form, successFunc) {
  $(form).validate({
    onkeyup: (element, event) => {
      $(element).valid();
    },
    errorClass: "its-invalid is-invalid",
    validClass: "is-valid",
    errorPlacement: (error, element) => {
      $("#messageErrors").html(error);
    },
    submitHandler: Message.submit(user, successFunc)
  });
};


Message.prototype.setAccept = function() {
  const currentUserId = $("#loggedInAs").data("id");

  $("#accept").click(e => {
    this.close(this.sender.confirmFriend(currentUserId));
    AlertMessage.createAutoDismiss(`You are now friends with ${this.sender.username}!`, "success");
    this.delete();
  });
};


Message.setAll = function(messages) {
  inbox.deleteBtnOnCheck();
  messages.forEach((message, i) => {
    const linkFunc = linkSelectorFunction(`#message-${message.id}`);

    profile.setLink(message.sender, linkFunc);
    message.set(linkFunc);
  });
  return this;
};


Message.prototype.set = function(linkSelector) {
  const $messageRow = $(`#message-${this.id} span`);

  linkSelector(".messageLink").click(e => {
    e.preventDefault();
    e.stopPropagation();
    $messageRow.addClass("bg-light-blue");
    this.display()
           .setClose("html, #messageDropdown a.closeMessage");
    $("#messageDropdown").click(e => e.stopPropagation())
                         .slideDown(200);
  }).addClass("linkCursor");
  return this;
};


Message.prototype.setView = function() {
  $("#view").click(e => {
    this.close(() => {
      this.recipe.get();
    });
  });
};


Message.prototype.setReply = function() {
  const message = this;

  $("#reply").click(e => {
    this.close(function() {
      const html = display.template("message_reply", this);
      $(this).html(html).slideDown(200)
      message.setReplyCancel()
             .setReplySubmit()
             .setClose("#messageDropdown .closeMessage");
    });
  });
  return this;
};

Message.prototype.setClose = function(selectors) {
  $(selectors).one("click", e => {
    e.preventDefault();
    this.close();
    $(`#message-${this.id} span`).removeClass("bg-light-blue");
  });
  return this;
};


Message.prototype.setReplyCancel = function() {
  const message = this;

  $("#cancel").click(e => {
    e.preventDefault();
    this.close(function() {
      message.display();
      $(this).slideDown(200);
    });
  });
  return this;
};


Message.prototype.setReplySubmit = function(html) {
  Message.setSubmit(this.sender, "#replyMessageForm", resp => {
    this.close();
    AlertMessage.createAutoDismiss("Message sent!", "success");
  });
  return this;
};



Message.prototype.setDelete = function(successFunc) {
  $("#delete").click(e => { this.delete(); });
  return this;
};
