
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
