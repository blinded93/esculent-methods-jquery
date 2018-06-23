$(function() {
  attachListeners();
});

function attachListeners() {
  setSearchForm();
}

function setSearchForm(path) {
  $("#searchForm").off("submit");
  $("#searchForm").submit(function(e) {
    e.preventDefault();
    console.log($("#searchBar").val());
  });
}

// Menu

function loadMenu() {
  
}
