function Search() {
  this.form = $("#search");
  this.submit = $("#submitSearch");
}


Search.setup = function() {
  const search = new Search();

  search.set();
};


Search.current = function() { return $("#search").data("search"); };


Search.prototype.typeToURL = function(givenType) {
  const type = givenType || $("#type").val();

  if (type === ":r") { return "/recipes/search"; }
  else if (type === ":i") { return "/ingredients/search"; }
  else if (type === ":u") { return "/users/search"; }
};


Search.prototype.processQuery = function() {
  if ($("#type").val() === ":i") {
    return $("#query").val().split(",").map(word => word.trim());
  } else {
    return $("#query").val();
  }
};


Search.backToResultsLink = function() {
  if (!!$(".searchLink").length) {
    AlertMessage.toggle();
    switchElementData(".searchLink", "#toSearchResults");
    // this.setBackToResults();
    Listener.setBackToResults();
  }
};


Search.prototype.evaluateResp = function(resp) {
  const search = this;

  if (!!resp.recipes) { this.evaluateRecipes(resp); }
  else if (!!resp.users) { this.evaluateUsers(resp); }
  AlertMessage.createSearch(this.form.data("query"));
  return this;
};


Search.prototype.evaluateRecipes = function(resp) {
  const search = this;
  const breadcrumb = Breadcrumb.current();

  if (!!resp.recipes.length) {
    Recipe.displayAllRecipes(resp, "recipes", "#mainContent")
      .done(function(pageObj) {
        const url = $("#search").data("type") === ":r" ? "/recipes/search" : "/ingredients/search";
        pageObj.setLinks(url, {query:$("#search").data("query")});
        breadcrumb.addSearch();
      });
  } else {
    search.displayErrors();
  }
};


Search.prototype.evaluateUsers = function(resp) {
  const search = this;
  const breadcrumb = Breadcrumb.current();

  if (!!resp.users.length) {
    User.displayAllUsers(resp, "users", "#mainContent")
      .done(function(pageObj) {
        pageObj.setLinks("/users/search", {query:$("#search").data("query")});
        breadcrumb.addSearch();
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
  const breadcrumb = Breadcrumb.current();

  this.errors = `No ${selected.toLowerCase()} found.`;
  breadcrumb.setHome();
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
    AlertMessage.toggle();
  }
  return this;
};


// Listener //

Search.prototype.set = function() {
  const search = this;
  $("#query").on("keyup", (e) => $(this).removeClass("is-invalid"));

  search.submit.click(function(e) {
    const url = search.typeToURL();
    const query = search.processQuery();

    e.preventDefault();
    $.get(url, {query:query})
      .done(function(data) {
        if (!!$("#query").val()) {
          search.type = $("#type").val();
          search.query = $("#query").val();
          search.populateData(data.meta)
                .resetSearchAlert()
                .evaluateResp(data);
          $("#query").val("");
        } else {
          $("#query").addClass("is-invalid");
          AlertMessage.createError("A search term is required.");
        }
      });
  });
};

Search.prototype.setBackToResults = function() {
  const $goBack = $("#toSearchResults");
  const data = $("#search").data();
  const search = data.search;
  const url = search.typeToURL(data.type);

  $goBack.one("click", function(e) {
    e.preventDefault();
    $.get(url, {query:data.query, page: data.page})
      .done(resp => search.evaluateResp(resp));
  });
};
