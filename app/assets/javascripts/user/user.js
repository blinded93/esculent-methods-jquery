function User(json) {
  this.username = json.username;
  this.email = json.email;
  this.id = json.id;
  this.recipes = [];
  this.favorites = [];
  this.friends = [];
  this.messages = [];
  if (json.avatar) {
    this.avatarURL = json.avatar.url;
    this.thumbURL = json.avatar.thumb.url;
  }
}


User.displayAll = function(data, userType, destination) {
  const dfd = new $.Deferred();
  const usersJson = data[`${userType}`];
  const pageObj = Paginate.createAndDestinate(data.meta, destination);
  const users = User.createFrom(usersJson);

  if (destination === "#mainContent") {breadcrumb.addUserAssets(data, "Friends");}

  if (isEmpty(users)) {
    display.nothingHere(destination);
  } else {
    display.fromTemplate("users", {users:users})
           .toElement(destination)
             .done(function() {
               User.setResults(users);
               if (pageObj) { pageObj.displayLinks(dfd, destination) }
             });
  }
  return dfd.promise();
};


User.prototype.displayInbox = function(destination) {
  const user = this;
  const friends = $("#loggedInAs").data("friends");

  if (destination === "#mainContent") {breadcrumb.addUserAssets(user, "Messages");}
  display.fromTemplate("inbox", {recipients:friends})
         .toElement(destination, "", true).done(function() {
           inbox.setBtns();
           user.displayMessages("#messageInbox")
               .done(function(pageObj) {
                 Message.deleteBtnOnCheck();
                 pageObj.setLinks(`/users/${user.id}/messages`);
               });
         });
};


User.prototype.displayMessages = function(destination) {
  const user = this;
  const dfd = new $.Deferred();
  const pageObj = Paginate.createAndDestinate(user.meta, destination)
  const isInbox = destination === "#messageInbox" ? true : false
  user.messages = Message.createFrom(user.messages);

  if (destination === "#messageInbox") {pageObj.user = user;}

  if (isEmpty(user.messages)) {
    display.nothingHere(destination, "", isInbox);
  } else {
    display.fromTemplate("messages", {messages: user.messages})
           .toElement(destination, "", isInbox)
             .done(function() {
               Message.setAll(user.messages);
               if (pageObj) { pageObj.displayLinks(dfd, destination) }
               else { $(".deleteCheckSpans").remove(); }
             });
  }
  return dfd.promise();
};


User.createFrom = function(data) {
  return data ? data.map(user => new User(user)) : [];
};


User.prototype.displayProfile = function() {
  const user = this;

  $.get(`/users/${user.id}`)
    .done(function(data) {
      display.fromTemplate("user", user)
             .toElement("#mainContent")
               .done(function() {
                 breadcrumb.addProfile(user);
                 user.setProfile();
               });
    });
};


User.prototype.displayPreview = function(tab, type) {
  const assets = this[tab.toLowerCase()];
  const destination = "#profileContent";
  const user = this;

  user.setSeeAll(tab, type);
  if (type === "recipes") {
    Recipe.displayAll(user, tab.toLowerCase(), destination);
  } else if (type === "users") {
    User.displayAll(user, tab.toLowerCase(), destination);
  } else if (type === "messages") {
    $("#unreadCount").text(`${user.messages.length}`);
    user.displayMessages(destination);
  }
};


User.prototype.displayUnreadCount = function() {
  if (isLoggedIn()) {
    this.getMessages("count")
      .done(function(data) { $("#unreadCount").text(`${data.unread_count}`);
    });
  }
  return this;
};


User.prototype.assignAssetsAndMeta = function(data) {
  const user = this;

  Object.keys(data).forEach(function(key) {
    user[key] = data[key];
  });
  goBack.updateCurrentResults(user.resultsData(data));
};


User.prototype.resultsData = function(data) {
  const user = this;
  const type = Object.keys(data)[0];

  return  {
    url: `/users/${user.id}/${type}`,
    params:{ page: user.meta.page },
    callback: data => user.displayAssets(data, "#mainContent")
  };
};


User.prototype.displayAssets = function(data, destination, preview = false) {
  const type = Object.keys(data)[0];
  const user = this;
  const displayFunc = type === "friends" ? User.displayAll : Recipe.displayAll;

  this.assignAssetsAndMeta(data);
  displayFunc(user, type, destination)
    .done(function(pageObj) {
      pageObj.setLinks(`/users/${user.id}/${type}`, preview)
    })
};


User.prototype.addFriend = function(currentUserId) {
  const user = this;

  return function() {
    const params = { "friend_id": user.id, "request": true };
    const $addFriendLink = $(`#user-${user.id} .addFriend`);
    const pendingHtml = "<small class='text-success'>Pending</small>";

    $.post(`/users/${currentUserId}/friend`, params)
      .done(function(data) {
        user.addFriendData("pending");
        AlertMessage.createAutoDismiss(`Friend invitation has been sent to ${data.friendship.friend.username}!`, "success");
        $addFriendLink.after(pendingHtml)
                      .remove();
      });
  };
};


User.prototype.confirmFriend = function(currentUserId) {
  const user = this;

  return function() {
    const params = {"friend_id": user.id};
    $.post(`/users/${currentUserId}/friend`, params)
      .done(function(data) {
        user.addFriendData();
        AlertMessage.createAutoDismiss(`You are now friends with ${data.friendship.friend.username}!`, "success");
      });
  };
};


User.prototype.setLoggedInAs = function() {
  const html = `<small class='blue'>Logged in as:</small> <a href="" id="loggedInUser" class="black userLink">${this.username}</a>`;

  $("#loggedInAs").html(html);
  this.setData();
};


User.prototype.setData = function() {
  const user = this;
  const linkFunc = linkSelectorFunction("#loggedInAs");

  user.getRecipients()
    .done(function(data) {
      const friends = data.friendships.map(f => f.friend);
      const pendingIds = data.friendships.filter(f => !!f.request)

      $("#loggedInAs").data({
                      id: user.id,
                username: user.username,
                 friends: friends,
        pendingFriendIds: pendingIds,
               friendIds: friends.map(f => f.id)
      });
      user.setProfileLink(linkFunc);
    });
  return this;
};


User.prototype.addData = function(...attrs) {
  const user = this;

  attrs.forEach(function(attr) {
    $("#loggedInAs").data(attr).push(user.id);
  });

User.prototype.addFriendData = function(friendType) {
  const data = {id: this.id, username: this.username};
  const  $userData = $("#loggedInAs").data();

  if (friendType === "pending") {
    $userData.pendingFriendIds.push(this.id);
    $userData.friendIds.push(this.id);
  } else {
    $userData.friends.push(data);
    removeFrom(this.id, $userData.pendingFriendIds);
  }
};


User.prototype.getRecipes = function(preview) {
  const previewObj = preview ? {"preview":preview} : {};

  return $.get(`/users/${this.id}/recipes`, previewObj);
};


User.prototype.getFavorites = function(preview) {
  const previewObj = preview ? {"preview":preview} : {};

  return $.get(`/users/${this.id}/favorites`, previewObj);
};


User.prototype.getFriends = function(preview) {
  const previewObj = preview ? {"preview":preview} : {};

  return $.get(`/users/${this.id}/friends`, previewObj);
};


User.prototype.getMessages = function(scope) {
  return $.get(`/users/${this.id}/messages`, {"scope":scope});
};


User.prototype.getRecipients = function() {
  return $.get(`/users/${this.id}/friendships`);
};


//  Listeners //

User.prototype.setPreview = function(tab, type) {
  const user = this;
  const $tab = $(`#user${tab}`);
  const tabName = $tab.data("tab");

  $tab.click(function(e) {
    e.preventDefault();
    user[`get${tabName}`](true)
      .done(function(assets) {
        $("ul.nav-tabs a.active").removeClass("active");
        $tab.addClass("active");
        user[tabName.toLowerCase()] = assets[tabName.toLowerCase()];
        user.displayPreview(tabName, type);
      });
  });
  return this;
};


User.prototype.setProfileLink = function(linkSelector) {
  const user = this;
  linkSelector(".userLink").click(function(e) {
    e.preventDefault();
    goBack.show(this);
    goBack.hideIf(isMenuItem(this));
    user.displayProfile();
  }).addClass("linkCursor");
  return this;
};


User.prototype.setProfile = function() {
  const user = this;
  const linkFunc = linkSelectorFunction(".profileImage");

  $("#seeAll").show();
  user.getRecipes(true)
    .done(function(data) {
      user.recipes = data.recipes;
      user.displayPreview("Recipes", "recipes");
    });
  user.displayUnreadCount()
      .setEditProfileImageBtn()
      .setAddFriendBtn("24", linkFunc)
      .setProfileTabs();
};

User.prototype.setProfileTabs = function() {
  const user = this;
  const navTabs = $(`#user-${this.id} .nav-link`);

  navTabs.each(function(i, link) {
    const [tab, type] = [$(link).data("tab"), $(link).data("type")]
    user.setPreview(tab, type);
  });
};


User.prototype.setEditProfileImageBtn = function() {
  iconHover("#upload", "upload");
  this.setProfileImageTypeCheck();
  return this;
};


User.prototype.setProfileImageTypeCheck = function() {
  const user = this;

  $("#profileImageInput").change(function(e) {
    const imgName = this.value.replace(/^.*[\\\/]/, '');

    if (["jpeg", "jpg", "png"].includes(getExt(this))) {
      AlertMessage.createEditImage(imgName, user);
    } else {
      window.setTimeout(changeIconSrc, 50, "#upload", "upload-wrong");
      window.setTimeout(changeIconSrc, 2250, "#upload", "upload-bw");
      $("#profileImageInput").val("");
      AlertMessage.createError("Profile image must be jpeg or png.");
    }
  });
};


User.prototype.setProfileImageSubmit = function() {
  const user = this;

  return function() {
    const form = document.getElementById("editProfileImage");
    const formData = new FormData(form);

    $.ajax({
      type: 'PATCH',
      url: `/users/${user.id}`,
      processData: false,
      contentType: false,
      data: formData,
      success: function(resp) {
        const url = resp.user.avatar.url;
        $("#userAvatar").fadeOut(200, function() {
          $("#userAvatar").attr("src", url);
        }).fadeIn(200);
        const menu = $("#menu").data("menu");
        menu.getType();
      }
    });
  };
};


User.prototype.setSeeAll = function(tab, type) {
  const $sa = $("#seeAllLink");
  const tabName = tab === "Messages" ? "Inbox" : tab;

  $sa.attr("href", "")
    .removeClass().addClass(`${tab.toLowerCase()}Link`)
    .off("click");
  const linkFunc = linkSelectorFunction("#seeAll");
  this[`set${tabName}Link`](linkFunc, "#mainContent");
};


User.prototype.setRecipesLink = function(linkSelector, destination) {
  const user = this;
  const preview = destination === "#mainContent" ? null : true;

  linkSelector(".recipesLink").click(function(e) {
    e.preventDefault();
    goBack.show(this);
    goBack.hideIf(isMenuItem(this));
    user.getRecipes(preview)
      .done(data => user.displayAssets(data, destination, preview));
  });
  return this;
};


User.prototype.setFavoritesLink = function(linkSelector, destination) {
  const user = this;
  const preview = destination === "#mainContent" ? null : true;

  linkSelector(".favoritesLink").click(function(e) {
    e.preventDefault();
    goBack.show(this);
    goBack.hideIf(isMenuItem(this));
    user.getFavorites(preview)
      .done(data => user.displayAssets(data, destination, preview));
  });
  return this;
};


User.prototype.setFriendsLink = function(linkSelector, destination) {
  const user = this;
  const preview = destination === "#mainContent" ? null :true;

  linkSelector(".friendsLink").click(function(e){
    e.preventDefault();
    goBack.hideIf(isMenuItem(this));
    user.getFriends()
      .done(data => user.displayAssets(data, destination, preview));
  });
  return this;
};


User.prototype.setInboxLink = function(linkSelector, destination) {
  const user = this;

  linkSelector(".messagesLink").click(function(e) {
    e.preventDefault();
    goBack.hideIf(isMenuItem(this));
    user.getMessages("all")
      .done(function(data) {
        user.assignAssetsAndMeta(data);
        user.displayInbox(destination)
      });
  });
  return this;
};


User.setResults = function(users) {
  users.forEach(function(user) {
    const linkFunc = linkSelectorFunction(`#user-${user.id}`);
    const args = [linkFunc, "#mainContent"];

    user.setProfileLink(linkFunc)
        .setRecipesLink(...args)
        .setFavoritesLink(...args)
        .setAddFriendBtn("16", linkFunc);
  });
};


User.prototype.setAddFriendBtn = function(size, linkFunc) {
  iconHover(".addFriendImg", `add-friend-${size}`);
  this.setAddFriend(linkFunc);
  return this;
};


User.prototype.setAddFriend = function(linkSelector) {
  const user = this;

  linkSelector(".addFriend").click(function(e) {
    e.preventDefault();
    AlertMessage.createAddFriend(user);
  });
};
