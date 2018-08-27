function Search() {
  this.form = $("#search");
  this.type = $("#type option:selected");
  this.query = $("#query");
  this.submit = $("#submitSearch");
}

Search.setup = function() {
  const search = new Search();
  Listener.setSearch(search);
};

Search.backToResultsLink = function() {
  if (!!$(".searchLink").length) {
    Display.toggleAlert();
    switchElementData(".searchLink", "#toSearchResults");
    Listener.setBackToResults();
  }
};

Search.prototype.displayErrors = function(resp) {
  Display.fromTemplate("error", resp)
    .toElement("#mainContent");
};

Search.prototype.evaluateResp = function(resp) {
  const search = this;
  switch (true) {
    case !!resp.search:
      search.errors = resp.search.errors;
      search.displayErrors(resp);
      Listener.setHome();
      Breadcrumb.reset();
      break;
    case !!resp.recipes:
      Recipe.displayAllRecipes(resp, "recipes", "#mainContent");
      Breadcrumb.search();
      break;
    case !!resp.users:
      User.displayAllUsers(resp, "users", "#mainContent");
      Breadcrumb.search();
      break;
  }
  $(".searchLink").data({
    type: search.type.val(),
    query: search.query.val(),
    page: 1,
    search: search
  });
  Display.createSearchAlert(search.form.data("query"));
  return this;
};
