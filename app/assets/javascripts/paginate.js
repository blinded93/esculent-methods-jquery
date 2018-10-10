function Paginate(meta) {
  this.prev = meta.prev;
  this.first = 1;
  this.current = meta.page;
  this.last = meta.pages;
  this.next = meta.next;
  this.query = meta.vars.query;
  this.destination;
}

Paginate.createAndDestinate = function(meta, destination) {
  if (meta) {
    const pageObj = new Paginate(meta);
    pageObj.destination = destination;
    return pageObj;
  }
};

Paginate.prototype.setLinks = function(url, params) {
  this.links = $("a.page-link");
  const pageObj = this;
  pageObj.links.each(function(i, link) {
    pageObj.setLink(link, url, params);
  });
};

Paginate.prototype.setLink = function(link, url, params) {
  const _this = this;
  const page = $(link).data("page");
  $(link).click(function(e) {
    e.preventDefault();
      if (!$(link).parent().is(".disabled, .active")) {
        $.get(url + `?page=${page}`, params)
          .done(function(data) {
            Recipe.displayAllRecipes(data, "recipes", _this.destination)
              .done(function(pageObj) {
                pageObj.setLinks(url, params);
              });
          });
      }
  });
};
