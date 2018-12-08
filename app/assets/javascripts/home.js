$(function() {
  homeSetup();
  Recipe.getAll();
});

function homeSetup() {
  search.set();
  goBack.set();
  menu.set();
};
