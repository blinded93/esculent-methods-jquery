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
  if (!resp.recipes.length) {
    const selected = $("#type option:selected").text();
    search.errors = `No ${selected} found.`
    search.displayErrors({search:search});
    Listener.setHome();
    Breadcrumb.reset();
  } else if (!!resp.recipes) {
    Recipe.displayAllRecipes(resp, "recipes", "#mainContent")
      .done(function(pageObj) {
        pageObj.setLinks("/recipe_search", {query:$("#search").data("query")});
        Breadcrumb.search();
      });
  } else if (!!resp.users) {
    User.displayAllUsers(resp, "users", "#mainContent")
      .done(function(pageObj) {
        pageObj.setLinks("/user_search", {query:$("#search").data("query")});
        Breadcrumb.search();
      });
  }
  Display.createSearchAlert(search.form.data("query"));
  return this;
};

Search.prototype.populateData = function(meta) {
  const data = {
    type: (this.type || $("#search").data("type")),
    query: (this.query || $("#search").data("query")),
    page: meta.page,
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
