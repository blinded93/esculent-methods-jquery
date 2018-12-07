$(function() {
  homeSetup();
  Recipe.getAllRecipes();
});

function homeSetup() {
  search.set();
  goBack.set();
  Menu.setup();
};
