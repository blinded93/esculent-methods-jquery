function Ingredient(json) {
  this.unit = json.unit;
  this.quantity = json.quantity;
  this.state = json.state;
  this.name = json.ingredient.name;
}
