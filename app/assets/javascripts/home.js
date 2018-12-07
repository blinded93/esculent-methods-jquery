$(function() {
  homeSetup();
  Recipe.getAllRecipes();
});

function homeSetup() {
  Search.setup();
  goBack.set();
  Menu.setup();
};
