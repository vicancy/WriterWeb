// convert markdown to html
function convertMarkdown2Html(content) {
  var preview = $("#article-preview");
  // hide html
  var data = marked(content);
  //preview.hide().empty();

  var convertCallback = function (data, callback) {
    preview.html(data);
    callback();
  };

  // user marked.js
  convertCallback(data, function () { });
  return data;
}

var delay = (function () {
  var timer = 0;
  return function(callback, ms) {
    clearTimeout(timer);
    timer = setTimeout(callback, ms);
  };
})();



var saveContent = function (articleContent) {
  var url = "/writer";
  $.post(url, articleContent).success(function(data) {

  })
  .error(function () {
    //How to print errors?
  });
};

var updatePreview = function () {
  // real-time markdown2html generation or save html to database?
  // save html to database is better: considering read mode
  var data = convertMarkdown2Html($("#article-content").val());
  saveContent({
    article : getArticleSelected(),
    markdown : $("#article-content").val(),
    html : $("#article-preview").html() ? $("#article-preview").html() : data
  });
};

var getArticleSelected = function () {
  return $("#selectedArticleId").val();
};

var setArticleSelected = function (articleId) {
  $("#selectedArticleId").val(articleId);
};

var reorgContentLayout = function (mode) {

};

function writing () {
  var isInitialized = false;
  this.loadArticleContent = function (action) {
    var articleId = getArticleSelected();
    if (!isInitialized) {
      initPreviewPanel();
    }

    var preview = $("#article-preview");
    // hide html
    //preview.fadeOut("fast").empty();

    var url = window.generateUrl("editable-article");
    var data = {
      articleId: articleId,
      action: action
    };
    $.get(url, data).success(function (params) {
      $("#article-title").text(params.title);
      $("#article-content").val(params.markdown);
      $("#article-preview").html(params.html);
      //updatePreview(selectedArticleId); //this line makes each click a post request, comment out
    })
    .error(function (err) {
      //How to print errors?
    });
  };

  this.initPreviewPanel = initPreviewPanel;
  this.getArticleSelected = getArticleSelected;
  this.setArticleSelected = setArticleSelected;
  this.reorgContentLayout = reorgContentLayout;

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

    isInitialized = true;
  };
}

$(document).ready(function () {
  window.writing = writing;
});