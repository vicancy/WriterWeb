
// convert markdown to html
function convertMarkdown2Html(content) {
  var preview = $("#article-preview");
  // hide html
  preview.fadeOut("fast").empty();

  var convertCallback = function (data, callback) {
    preview
      .addClass("display-none")
      .append(data)
      .fadeIn("fast");
    callback();
  };

  // user marked.js
  var data = marked(content);
  convertCallback(data, function () { });
}

var delay = (function () {
  var timer = 0;
  return function(callback, ms) {
    clearTimeout(timer);
    timer = setTimeout(callback, ms);
  };
})();

var initPreviewPanel = function () {
  var content_ctl = $("#article-content");
  var content = content_ctl.val();
  content_ctl.keyup(function () {
    delay(function () {
      var curval = content_ctl.val();
      if (curval !== content){
        updatePreview();
        content = content_ctl.val();
      }
    }, 500);
  });
};

var saveContent = function (articleContent) {
  var url = "writer";
  $.post(url, articleContent).success(function(data) {

  })
  .error(function () {
    //How to print errors?
  });
};

var updatePreview = function () {
  // real-time markdown2html generation or save html to database?
  // save html to database is better: considering read mode
  convertMarkdown2Html($("#article-content").val());
  saveContent({
    article : $("#selectedArticleId").val(),
    markdown : $("#article-content").val(),
    html : $("#article-preview").val()
  });
};

var loadArticles = function (notebookId, action) {
  var url = "editable-article-list";
  var data = {
    notebookId: notebookId,
    action: action
  };
  $.get(url, data).success(function (res) {
    $("#article-list").html(res);
    loadArticleContent($('#selectedArticleId').val());
  });
};

var loadArticleContent = function (articleId, action) {
  var url = "editable-article";
  var data = {
    articleId: articleId,
    action: action
  };
  $.get(url, data).success(function (text) {
    $("#article-content").val(text);
    updatePreview(); //update marked preview since the actual content is changed
  })
  .error(function () {
    //How to print errors?
  });
};

var newArticle = function (notebookId) {
  //Post a default article to server -- seems not necessory, can be done when auto-saving

  //Set the newly added article to the selectedArticleId -- if not communicate with server, can not get the article id
  //TODO: talk to server or not?
  //If not: do this when auto-saving
  loadArticles(notebookId, 'create');
};

$(document).ready(function () {
  loadArticles($('#selectedNotebookId').val());
  initPreviewPanel();
  updatePreview();
});