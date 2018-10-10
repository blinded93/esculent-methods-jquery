function Message(json) {
  this.subject = json.subject;
  this.body = json.body;
  this.readAt = json.read_at;

}


// Recipe.createFrom = function(data) {
//   return data ? data.map(recipe => new Recipe(recipe)) : [];
// };
