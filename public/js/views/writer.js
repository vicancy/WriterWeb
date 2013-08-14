var updateArticleList = function () {
  ControlSelector.UpdateTitle(function (index, item) {
    var title = $(this).val();
    $('.list-group.articles a.active h4').text(title);
  });
};

var updateArticleAbstract = function () {
  ControlSelector.UpdateContent(function (index, item) {
    var abstract = $(this).val().substring(0, 200);
    $('.list-group.articles a.active p').text(abstract);
  });
};

var delay = (function () {
  var timer = 0;
  return function(callback, ms) {
    clearTimeout(timer);
    timer = setTimeout(callback, ms);
  };
})();

var initPreviewPanel = function () {
  $(".article-content").each(function () {
    var content_ctl = $(this);
    var content = content_ctl.val();
    content_ctl.keyup(function () {
      delay(function () {
        var curval = content_ctl.val();
        if (curval !== content){
          ControlSelector.UpdatePreview();
          content = content_ctl.val();
        }
      }, 500);
    });
  });

  $(".article-title").each(function () {
    var title_ctl = $(this);
    var title = title_ctl.val();
    title_ctl.keyup(function () {
      delay(function () {
        var curval = title_ctl.val();
        if (curval !== title) {
          ControlSelector.UpdatePreview('title');
          title = title_ctl.val();
        }
      }, 100);
    });
  })
};


var initClickEvent = function () {
  //Add click event to every notebook list item
  $('.list-group.notebooks a').each(function (index) {
    $(this).click(function () {
      loadArticles($(this), 'get', function () {});
    });
  });
  //Add click event to add article button
  $('.add a').click(function () {
    newArticle();
  });
  //Add click event to add notebook button

  //Add click event to every go-<mode> button
  $("a[class^='go-']").each(function (index) {
    $(this).click(function () {
      WritingUtility.ReorgContentLayout($(this).attr('class'));
    });
  });
};

var loadArticle = function (element, mode, callback) {
  ControlSelector.SetArticleSelected($('.list-group.articles a'), element);

  ServerUtility.LoadArticleContent(ControlSelector.GetArticleSelected(), mode, function (params) {
    $(".article-title").each(function (index) {
      $(this).val(params.title);
    });
    $(".article-content").each(function (index) {
      $(this).val(params.markdown);
    });
    $(".article-preview").each(function (index) {
      $(this).html(params.html);
    });
    initPreviewPanel();
    callback();
  });
};

var loadArticles = function (element, mode, callback) {

  ControlSelector.SetNotebookSelected($('.list-group.notebooks a'), element);

  ServerUtility.LoadArticles(ControlSelector.GetNotebookSelected(), mode, function (res) {
    $(".article-list").html(res);

    //Add click event to every article list item
    $('.list-group.articles a').each(function (index) {
      $(this).click(function () {
        loadArticle($(this), 'get', function () {});
      });
    });

    loadArticle($('.list-group.articles a').first(), mode, callback);
  });
};

var newArticle = function () {
  //Post a default article to server -- seems not necessory, can be done when auto-saving

  //Set the newly added article to the selectedArticleId -- if not communicate with server, can not get the article id
  //TODO: talk to server or not?
  //If not: do this when auto-saving
  loadArticles($('.list-group.notebooks a.active'), 'create', function () {});
};

$(document).ready(function () {
  loadArticles($('.list-group.notebooks a').first(), 'get', function () {
    updateArticleList();
    updateArticleAbstract();
  });

  initClickEvent();

});