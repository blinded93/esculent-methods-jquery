function Recipe(json) {
  this.name = json.name;
  this.directions = json.directions;
  this.cookTime = json['cook-time'];
  this.prepTime = json['prep-time'];
  this.servings = json.servings;
  this.skillLevel = json['skill-level'];
  this.ingredients = [];
}
