function Paginate(meta) {
  this.prev = meta.prev;
  this.first = 1;
  this.current = meta.page;
  this.last = meta.pages;
  this.next = meta.next;
  this.query = meta.vars.query;
}
