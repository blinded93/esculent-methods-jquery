$(function() {
  homeSetup();
  Recipe.getAll();
});

function homeSetup() {
  search.set();
  goBack.set();
  Menu.setup();
};
