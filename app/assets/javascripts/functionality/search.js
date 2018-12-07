let search = {};
(function() {

  let type, query, queryString;

  this.type = () => type;
  this.queryString = () => queryString;
  this.searchTypeURL = () => `/${type}/search`;


  this.processQuery = function() {
    queryString = $("#query").val();

    if (type === "ingredients") {
      return queryString.split(",").map(word => word.trim());
    } else {
      return queryString.trim();
    }
  };


  this.evaluateResp = function(resp) {
    const modelType = Object.keys(resp)[0];
    const displayFunc = modelType === "recipes" ? Recipe.displayAll : User.displayAll;

    if (!!resp[modelType].length) {
      displayFunc(resp, modelType, "#mainContent")
        .done(pageObj => {
          pageObj.setLinks(this.searchTypeURL(), {query: query});
          breadcrumb.addSearch();
        });
    } else {
      this.displayErrors();
    }

    goBack.hideIf(true);
    return this;
  };


  this.displayErrors = function() {
    this.getError();
    display.fromTemplate("error", this)
           .toElement("#mainContent");
  };


  this.getError = function() {
    const selected = $("#type option:selected").text();

    this.errors = `No ${selected.toLowerCase()} found.`;
    breadcrumb.setHome();
  };


  this.populateData = function(meta) {
    const data = {
      type: (this.type || $("#search").data("type")),
     query: (this.query || $("#search").data("query")),
      page: meta.page,
    search: this
    };

    $("#search").data(data);
    return this;
  };


  // Listeners //

  this.set = function() {
    const search = this;

    $("#query").on("keyup", (e) => $(this).removeClass("is-invalid"));

    $("#submitSearch").click(e => {
      type = $("#type").val();
      query = this.processQuery();

      e.preventDefault();
      if (!!query) {
        $.get(this.searchTypeURL(), {query: query})
          .done(data => {
            this.evaluateResp(data);
            goBack.updateCurrentResults(search.resultsData(data.meta));
            $("#query").val("");
          });
      } else {
        $("#query").addClass("is-invalid");
        AlertMessage.createError("As search term is required.");
      }
    });
  };


  this.resultsData = function(meta) {
    return {
          url: this.searchTypeURL(),
       params: {
          query: query,
           page: meta.page
      },
     callback: resp => this.evaluateResp(resp)
   };
  };


}).apply(search);
