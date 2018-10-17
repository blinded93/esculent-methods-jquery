function Message(json) {
  this.id = json.id;
  this.subject = json.subject;
  this.body = json.body;
  this.readAt = json.read_at;
  this.createdAt = json.created_at;
  this.sender = json.sender;
}


// Recipe.createFrom = function(data) {
//   return data ? data.map(recipe => new Recipe(recipe)) : [];
// };
Message.setNewForm = function(user) {
  $("#newMessageForm").validate({
    onkeyup: function(element, event) {
      $(element).valid();
    },
    errorClass: "its-invalid is-invalid",
    validClass: "is-valid",
    errorPlacement: function(error, element) {
      $("#newMessageErrors").html(error);
    },
    submitHandler: function(form, e) {
      e.preventDefault();
      const formData = new FormData(form);
      $.ajax({
        type: "post",
        url: `/users/${user.id}/messages`,
        data: formData,
        success: function(resp) {
        }
      });
    }
  });
};
