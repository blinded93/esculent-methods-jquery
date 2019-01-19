let inbox = {};
(function() {
  let owner = "";


  this.assignOwner = function(user) {
    owner = user;

    return this;
  };


  this.display = function(data, destination) {
    const recipients = $("#loggedInAs").data("friends");

    owner.assignAssetsAndMeta(data);
    breadcrumb.addUserAssets(owner, "Messages");
    goBack.updateCurrentResult(Message.resultsData(data, owner));
    this.displayUnreadCount();
    display.fromTemplate("inbox", {recipients: recipients})
      .toElement(destination, "", true)
        .done(() => {
          inbox.setBtns();
          owner.displayMessages("#messageInbox")
              .done((pageObj) => {
                pageObj.setLinks(`/users/${owner.id}/messages`);
              });
        });
  };


  this.deleteBtnOnCheck = function() {
    const $checks = $(".deleteChecks").change(function() {
      const checked = $checks.is(':checked');

      $("#deleteBtn").stop().fadeTo(200, checked ? 1 : 0);
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


  this.displayUnreadCount = function(count) {
    let num;
    const f = (count) => $(".unreadCount").text(count);

    if (count) { f(count) }
    else { owner.getUnreadCount().done(data => f(data.unread_count)) ;}
  }

  // Listeners //

  this.setLink = function(linkSelector, destination) {
    linkSelector(".messagesLink").click(function(e) {
      e.preventDefault();
      owner.getMessages("all")
        .done(function(data) {
          inbox.display(data, destination);
        });
    });
    return this;
  };

  this.setBtns = function() {
    this.deleteBtnOnCheck()
        .setComposeBtn()
        .setDeleteBtn()
        .setFilterSelect();
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
           owner.assignAssetsAndMeta(data);
           goBack.updateCurrentResult(Message.resultsData(data, owner));
           owner.displayMessages("#messageInbox")
              .done((pageObj) => {
                inbox.deleteBtnOnCheck();
                pageObj.setLinks(`/users/${owner.id}/messages`, {scope: selectedScope});
              });
         });
    });
    return this;
  };
}).apply(inbox);
