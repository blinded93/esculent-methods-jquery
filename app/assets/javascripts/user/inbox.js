let inbox = {};
(function() {
  let owner = "";


  this.assignOwner = function(user) {
    owner = user;
  };


  this.display = function(destination) {
    const dfd = new $.Deferred();
    const pageObj = Paginate.createAndDestinate(this.owner.meta, destination);
    pageObj.user = this.owner;

    breadcrumb.addUserAssets(this.owner, "Messages");
    display.fromTemplate("inbox", {friends: this.recipients})
      .toElement(destination, "", true)
        .done(() => {
          inbox.setBtns();
          user.displayMessages("#messageInbox", pageObj)
              .done(() => {
                Message.deleteBtnOnCheck();
                if (pageObj) { pageObj.displayLinks(dfd, destination); }
              });
        });
    return dfd.promise();
  };


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
