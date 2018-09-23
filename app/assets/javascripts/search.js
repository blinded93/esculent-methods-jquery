function Search() {
  this.form = $("#search");
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
    debugger;
      User.displayAllUsers(resp, "users", "#mainContent");
      Breadcrumb.search();
      break;
  }
  // search.populateData();
  Display.createSearchAlert(search.form.data("query"));
  return this;
};

Search.prototype.populateData = function() {
  const data = {
    type: (this.type || $("#search").data("type")),
    query: (this.query || $("#search").data("query")),
    page: 1,
    search: this
  }
  $("#search").data(data);
  return this;
};

Search.prototype.resetSearchAlert = function() {
  if ($("#toSearchResults").is(":visible")) {
    Display.toggleAlert();
  }
  return this;
}
