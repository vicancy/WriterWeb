
// convert markdown to html
function convertMarkdown2Html(content) {
  var preview = $("#article-preview");
  // hide html
  preview.fadeOut("fast").empty();

  var convertCallback = function(data,callback){
    preview
    .addClass("display-none")
    .append(data)
    .fadeIn("fast");
    callback();
  }

  // user marked.js
  var data = marked(content);
  convertCallback(data, function () { });
};

var delay = (function () {
  var timer = 0;
  return function(callback, ms) {
    clearTimeout(timer);
    timer = setTimeout(callback, ms);
  };
})();

var updatePreview = function () {
  var content_ctl = $("#article-content");
  var content = content_ctl.val();
  convertMarkdown2Html(content);
  content_ctl.keyup(function () {
    delay(function () {
      var curval = content_ctl.val();
      if (curval != content){
        convertMarkdown2Html(curval);
      }
    }, 500);
  });
};

var loadArticles = function (notebookId) {
  var url = "editable-article-list";
  var data = {notebookId: notebookId};
  $.get(url, data).success(function (res) {
    $("#article-list").html(res);
  });
};

var loadArticleContent = function (articleId) {
  var url = "editable-article";
  var data = {articleId: articleId};
  $.get(url, data).success(function (text) {
    $("#article-content").val(text);
    updatePreview(); //update marked preview since the actual content is changed
  })
  .error(function () {
    //How to print errors?
  });
};

$(document).ready(function () {
  loadArticles(1);
  loadArticleContent(1);
});