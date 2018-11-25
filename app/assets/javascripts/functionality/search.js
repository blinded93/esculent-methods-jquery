function Search() {
  this.form = $("#search");
  this.submit = $("#submitSearch");
}

Search.setup = function() {
  const search = new Search();
  Listener.setSearch(search);
};

Search.prototype.typeToURL = function(givenType) {
  const type = givenType || $("#type").val();
  if (type === ":r") { return "/recipe_search"; }
  else if (type === ":i") { return "/ingredient_search"; }
  else if (type === ":u") { return "/user_search"; }
};

Search.prototype.processQuery = function() {
  if ($("#type").val() === ":i") {
    return $("#query").val().split(",").map(w => w.trim());
  } else {
    return $("#query").val();
  }
};

Search.backToResultsLink = function() {
  if (!!$(".searchLink").length) {
    Display.toggleAlert();
    switchElementData(".searchLink", "#toSearchResults");
    Listener.setBackToResults();
  }
};

Search.prototype.evaluateResp = function(resp) {
  const search = this;
  if (!!resp.recipes) { this.evaluateRecipes(resp); }
  else if (!!resp.users) { this.evaluateUsers(resp); }

  Display.createSearchAlert(this.form.data("query"));
  return this;
};

Search.prototype.evaluateRecipes = function(resp) {
  const search = this;
  if (!!resp.recipes.length) {
    Recipe.displayAllRecipes(resp, "recipes", "#mainContent")
      .done(function(pageObj) {
        const url = $("#search").data("type") === ":r" ? "/recipe_search" : "/ingredient_search";
        pageObj.setLinks(url, {query:$("#search").data("query")});
        Breadcrumb.search();
      });
  } else {
    search.displayErrors();
  }
};

Search.prototype.evaluateUsers = function(resp) {
  const search = this;
  if (!!resp.users.length) {
    User.displayAllUsers(resp, "users", "#mainContent")
      .done(function(pageObj) {
        pageObj.setLinks("/user_search", {query:$("#search").data("query")});
        Breadcrumb.search();
      });
  } else {
    search.displayErrors();
  }
};

Search.prototype.displayErrors = function() {
  this.getError();
  display.fromTemplate("error", this)
  .toElement("#mainContent");
};

Search.prototype.getError = function() {
  const selected = $("#type option:selected").text();
  this.errors = `No ${selected} found.`;
  Listener.setHome();
  Breadcrumb.reset();
};

Search.prototype.populateData = function(meta) {
  const data = {
    type: (this.type || $("#search").data("type")),
    query: (this.query || $("#search").data("query")),
    page: meta.page,
    search: this
  };
  $("#search").data(data);
  return this;
};

Search.prototype.resetSearchAlert = function() {
  if ($("#toSearchResults").is(":visible")) {
    Display.toggleAlert();
  }
  return this;
};
