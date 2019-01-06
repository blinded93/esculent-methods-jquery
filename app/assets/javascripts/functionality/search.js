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
    return this;
  };


  this.displayErrors = function() {
    this.getError();
    display.fromTemplate("error", this)
           .toElement("#mainContent");
  };


  this.getError = function() {
    this.errors = `No ${this.type()} found.`;
    breadcrumb.setHome();
  };


  // Listeners //

  this.set = function() {
    const search = this;

    $("#query").on("keyup", function() { $(this).removeClass("is-invalid"); })

    $("#submitSearch").click(e => {
      type = $("#type").val();
      query = this.processQuery();

      e.preventDefault();
      if (!!query) {
        $.get(this.searchTypeURL(), {query: query})
          .done(data => {
            this.evaluateResp(data);
            goBack.updateCurrentResult(search.resultsData(data.meta));
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
