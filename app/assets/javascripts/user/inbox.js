function Inbox(owner) {
  this.owner = owner;
  this.recipients = owner.friends;
  this.messages = owner.messages;
}

Inbox.prototype.display = function(destination) {
  const dfd = new $.Deferred();
  const pageObj = Paginate.createAndDestinate(this.owner.meta, destination);
  const breadcrumb = Breadcrumb.current();
  pageObj.user = this.owner;

  breadcrumb.addUserAssets(this.owner, "Messages");
  display.fromTemplate("inbox", {friends: this.recipients})
    .toElement(destination, "", true).done(function() {
      Listener.setInboxBtns(user);
      user.displayMessages("#messageInbox", pageObj)
        .done(function() {
          Message.deleteBtnOnCheck();
          if (pageObj) { pageObj.displayLinks(dfd, destination); }
        });
    });
  return dfd.promise();
};

Inbox.deleteMessageRows = function(resp) {
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
