$(function() {
  homeSetup();
  Recipe.getAllRecipes();
});

function homeSetup() {
  Search.setup();
  Menu.setup();
  Breadcrumb.createAndSave();
};
