function Paginate(meta) {
  this.prev = meta.prev;
  this.first = 1;
  this.current = meta.page;
  this.last = meta.pages;
  this.next = meta.next;
  this.query = meta.vars.query;
  this.assets = meta.vars.assets;
  this.user = {};
  this.destination = "";
}

Paginate.createAndDestinate = function(meta, destination) {
  if (!isEmpty(meta)) {
    const pageObj = new Paginate(meta);

    pageObj.destination = destination;
    return pageObj;
  }
};


Paginate.prototype.displayLinks = function(dfd, destination) {
  const pageObj = this;
  const isInbox = destination === "#messageInbox" ? true : false;

  display.fromTemplate("pagination", pageObj)
    .toElement("#paginationNav", 1, isInbox)
      .done(function() {
        dfd.resolve(pageObj);
      });
};


Paginate.prototype.setLinks = function(url, params) {
  const pageObj = this;
  this.links = $("a.page-link");

  pageObj.links.each(function(i, link) {
    pageObj.setLink(link, url, params);
  });
};


Paginate.prototype.setLink = function(link, url, params) {
  const pageObj = this;
  const page = $(link).data("page");
  const pageURL = url + `?page=${page}`;

  $(link).click(function(e) {
    e.preventDefault();
    if (!$(link).parent().is(".disabled, .active")) {
      $.get(pageURL, params)
        .done(function(data) {
          goBack.updateCurrentResult({params:{page: data.meta.page}});
          pageObj.displayLinkAssets(data, url, params);
        });
    }
  });
};


Paginate.prototype.parseAndDisplayData = function(data, url, params) {
  const models = {"recipes": Recipe, "users": User};
  const destination = this.destination;

  for (let key in data) {
    if (models[key]) {
      const model = models[key];

      model[`displayAll`](data, key, destination)
        .done(function(pageObj) {
          pageObj.setLinks(url, params);
        });
        break;
    }
  }
};


Paginate.prototype.displayLinkAssets = function(data, url, params) {
  if (data.messages) {
    const selectedScope = $("#messageFilterInput option:selected").val();

    this.user.assignAssetsAndMeta(data);
    this.user.displayMessages("#messageInbox", this)
      .done(function(pageObj) {
          pageObj.setLinks(url, {scope:selectedScope});
        });
  } else {
    this.parseAndDisplayData(data, url, params);
  }
};
