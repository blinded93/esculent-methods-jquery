function Search() {
  this.form = $("#search");
  this.query = $("#query");
  this.submit = $("#submitSearch");
}

Search.setup = function() {
  const search = new Search
  search.setListener(search);
};

Search.prototype.setListener = function(search) {
  this.submit.click(function(e) {
    e.preventDefault();
    search.listener(search);
  });
};

Search.prototype.listener = function(search) {
  $.post("/search", search.form.serialize())
    .done(function(resp){
      search.evaluateResp(resp);
    })
    .done(function(){
      search.query.val("");
    });
};

Search.prototype.adjustBreadcrumb = function() {
  const $bc = $(".breadcrumb");
  const $li = $("<li>", {"class": "breadcrumb-item searchLink"})
                .html(`Search results for <span class="black">'${this.query.val()}'</span>...`);
  Display.homeListener();
  Display.removeLastBreadcrumb();
  $bc.append($li);
};

Search.prototype.displayErrors = function(resp) {
  Display.fromTemplate("error", resp);
};

Search.prototype.evaluateResp = function(resp) {
  const search = this;
  switch (true) {
    case !!resp.search:
      search.errors = resp.search.errors
      search.displayErrors(resp);
      search.adjustBreadcrumb();
      console.log(resp);

      break;
    case !!resp.recipes:
      Recipe.displayAllRecipes(resp);
      search.adjustBreadcrumb();
      console.log(resp);
      break;
    case !!resp.users:
      User.displayAllUsers(resp);
      search.adjustBreadcrumb();
      console.log(resp);
      break;
  }
};
