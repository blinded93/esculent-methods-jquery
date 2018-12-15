let inbox = {};
(function() {
  let owner = "";


  this.assignOwner = function(user) {
    owner = user;
  };


  this.display = function(destination) {
    const recipients = $("#loggedInAs").data("friends");

    breadcrumb.addUserAssets(owner, "Messages");
    display.fromTemplate("inbox", {recipients: recipients})
      .toElement(destination, "", true)
        .done(() => {
          inbox.setBtns();
          owner.displayMessages("#messageInbox")
              .done((pageObj) => {
                pageObj.setLinks(`/users/${owner.id}/messages`);
              });
        });

  this.setBtns = function() {
    this.deleteBtnOnCheck()
        .setComposeBtn()
        .setDeleteBtn()
        .setFilterSelect();
  };


  this.deleteBtnOnCheck = function() {
    const $checks = $(".deleteChecks").change(function() {
      const checked = $checks.is(':checked');

      $("#deleteBtn").stop().fadeTo(200, checked ? 1 : 0);
    });
    return this;
  };


    this.deleteBtnOnCheck()
  this.setComposeBtn = function() {
    Message.setForm(owner);
    $("#composeBtn").click(e => {
      e.preventDefault();
      $("#composeDropdown").slideToggle(200);
    });
    return this;
  };


  this.setDeleteBtn = function() {
    $("#deleteBtn").click(e => {
      const checked = $(".deleteChecks:checked");

      e.preventDefault();
      Message.deleteAll(checked);
    });
    return this;
  };


  this.setFilterSelect = function() {
    $("#messageFilterInput").change(function(e) {
      const selectedScope = $(this).children("option:selected").val();

      owner.getMessages(selectedScope)
           .done(data => {
             owner.messages = data.messages;

             owner.displayMessages("#messageInbox")
                  .done(() => {
                    inbox.deleteBtnOnCheck();
                  });
           });
    });
    return this;
  };


  this.deleteMessageRows = function(resp) {
    resp.message_ids.forEach(function(id, i, arr){
      $(`#message-${id}`).slideUp(200, function() {
        $(this).remove();
        if (!$(".deleteChecks").length) {
          display.nothingHere("#messageInbox", "", true);
        }
        $("#deleteBtn").fadeOut(200);
      });
    });
  };
}).apply(inbox);
