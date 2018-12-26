let profile = {};
(function() {
  let owner = "";


  this.assignOwner = function(user) {
    owner = user;
  };


  this.display = function(user, data) {
    this.assignOwner(user);
    goBack.updateCurrentResult(user.resultData(data));
    display.fromTemplate("user", user)
           .toElement("#mainContent")
             .done(() => {
               breadcrumb.addProfile(owner);
               this.set();
             });
  };


  this.displayPreview = function(tab, type) {
    const assets = owner[tab.toLowerCase()];
    const destination = "#profileContent";

    this.setSeeAll(tab, type);
    if (type === "recipes") {
      Recipe.displayAll(owner, tab.toLowerCase(), destination);
    } else if (type === "users") {
      User.displayAll(owner, tab.toLowerCase(), destination);
    } else if (type === "messages") {
      profile.displayUnreadCount(owner.meta.count);
      owner.displayMessages(destination);
    }
  };


  this.displayUnreadCount = function(count) {
    let num;
    const f = (count) => $("#unreadCount").text(count);

    if (count) { f(count) }
    else { owner.getUnreadCount().done(data => f(data.unread_count)); }
    return this;
  };


  this.imageValidate = function() {
    $("#profileImageInput").change(function(e) {
      const imgName = this.value.replace(/^.*[\\\/]/, '');

      if (["jpeg", "jpg", "png"].includes(getExt(this))) {
        AlertMessage.createEditImage(imgName, owner);
      } else {
        window.setTimeout(changeIconSrc, 50, "#upload", "upload-wrong");
        window.setTimeout(changeIconSrc, 2250, "#upload", "upload-bw");
        $("#profileImageInput").val("");
        AlertMessage.createError("Profile image must be jpeg or png.");
      }
    });
  };


  this.imageSuccess = function(resp) {
    owner = new User(resp.user);

    $("#userAvatar").fadeOut(100, function() {
      $("#userAvatar").attr("src", owner.avatarURL);
    }).fadeIn(100);
    const linkFunc = linkSelectorFunction("#navRow")
    this.setLink(owner, linkFunc);
  };


  // Listener //

  this.setLink = function(user, linkSelector) {
    linkSelector(".userLink").off("click")
                             .click(function(e) {
                               e.preventDefault();
                               user.getSelf()
                                .done(data => profile.display(user, data));
                             }).addClass("linkCursor");
    return this;
  };


  this.set = function() {
    const linkFunc = linkSelectorFunction(".profileImage");

    owner.getRecipes(true)
      .done(data => {
        owner.recipes = data.recipes;
        this.displayPreview("Recipes", "recipes");
      });
    this.displayUnreadCount()
        .setEditImageBtn()
        .setTabs(owner);
    owner.setFriendBtn("add", linkFunc)
  };


  this.setEditImageBtn = function() {
    iconHover("#upload", "upload");
    this.imageValidate();
    return this;
  };


  this.setImageSubmit = function() {
    return function() {
      const form = $("#editProfileImage")[0];
      const formData = new FormData(form);

      $.ajax({
        type: 'PATCH',
        url: `/users/${owner.id}`,
        processData: false,
        contentType: false,
        data: formData,
        success: resp => {
          profile.imageSuccess(resp)
        }
      });
    };
  };


  this.setTabs = function() {
    const navTabs = $(`#user-${owner.id} .nav-link`);

    navTabs.each((i, link) => {
      const [tab, type] = [$(link).data("tab"), $(link).data("type")];

      this.setPreview(tab, type);
    });
  };


  this.setSeeAll = function(tab, type) {
    const $sa = $("#seeAllLink");
    const linkFunc = linkSelectorFunction("#seeAll");

    $sa.attr("href", "")
       .removeClass().addClass(`${tab.toLowerCase()}Link`)
       .off("click");
    if (tab === "Messages") { inbox.setLink(linkFunc, "#mainContent"); }
    else { owner[`set${tab}Link`](linkFunc, "#mainContent"); }
  };


  this.setPreview = function(tab, type) {
    const $tab = $(`#user${tab}`);
    const tabName = $tab.data("tab");

    $tab.click(e => {
      e.preventDefault();
      owner[`get${tabName}`](true)
        .done(data => {
          $("ul.nav-tabs a.active").removeClass("active");
          $tab.addClass("active");
          owner.assignAssetsAndMeta(data);
          profile.displayPreview(tabName, type);
        });
    });
    return this;
  };
}).apply(profile);
