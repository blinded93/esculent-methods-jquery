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
