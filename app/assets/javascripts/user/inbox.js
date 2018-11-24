function Inbox(owner) {
  this.owner = owner;
  this.recipients = owner.friends;
  this.messages = owner.messages;
}

Inbox.prototype.display = function(destination) {
  const dfd = new $.Deferred();
  const pageObj = Paginate.createAndDestinate(this.owner.meta, destination)
  pageObj.user = this.owner;
  Breadcrumb.userAssets(this.owner, "Messages");

  Display.fromTemplate("inbox", {friends: this.recipients})
    .toElement(destination, "", true).done(function() {
      Listener.setInboxBtns(user);
      user.displayMessages("#messageInbox", pageObj)
        .done(function() {
          Message.deleteBtnOnCheck();
          if (pageObj) { pageObj.displayLinks(dfd, destination); }
          // Display.fromTemplate("pagination", pageObj)
          //   .toElement("#paginationNav", 1, true).done(function() {
          //     dfd.resolve(pageObj);
          //   });
        });
    });
  return dfd.promise();
};

Inbox.deleteMessageRows = function(resp) {
  resp.message_ids.forEach(function(id, i, arr){
    $(`#message-${id}`).slideUp(200, function() {
      $(this).remove();
      if (!$(".deleteChecks").length) {
        Display.nothingHere("#messageInbox", "", true);
      }
      $("#deleteBtn").fadeOut(200);
    });
  });
};
