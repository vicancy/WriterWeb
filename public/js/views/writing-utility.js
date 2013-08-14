function WritingUtility() {}

WritingUtility.ReorgContentLayout = function (mode) {
  if (mode === 'go-normal') {
    //Normal Layout with preview panel
    $(".container[class*='-mode']").removeClass('active').addClass('hide');
    $('.container.normal-mode').removeClass('hide').addClass('active');
  } else if (mode === 'go-preview') {
  } else if (mode === 'go-writing') {
  } else if (mode === 'go-fullscreen') {
    //Fullscreen Layout with preview panel
    $(".container[class*='-mode']").removeClass('active').addClass('hide');
    $('.container.fullscreen-mode').removeClass('hide').addClass('active');
  }
};

function ServerUtility() {}

ServerUtility.LoadArticles = function (notebookId, action, callback) {
  var url = window.generateUrl("editable-article-list");
  var data = {
    notebookId: notebookId,
    action: action
  };

  $.get(url, data).success(function (res) {
    callback(res);
  });
};


ServerUtility.LoadArticleContent = function (articleId, action, callback) {
  var url = window.generateUrl("editable-article");
  var data = {
    articleId: articleId,
    action: action
  };
  $.get(url, data).success(function (params) {
    callback(params);
    //updatePreview(selectedArticleId); //this line makes each click a post request, comment out
  })
  .error(function (err) {
    //How to print errors?
  });
};


ServerUtility.SaveContent = function (article) {
  var url = "/writer";
  $.post(url, article).success(function(data) {

  })
  .error(function () {
    //How to print errors?
  });
};


function ControlSelector() {}

// convert markdown to html
var convertMarkdown2Html = function (content, callback) {
  var data = marked(content);
  // user marked.js
  callback(data);
};

ControlSelector.UpdatePreview = function (mode) {
  // real-time markdown2html generation or save html to database?
  // save html to database is better: considering read mode
  var preview;
  $(".article-content").each(function (index) {
    $(this).val($(".active .article-content").val());
  });
  convertMarkdown2Html($(".article-content").val(), function (data) {
    $(".article-preview").html(data);
    preview = data;
  });

  if (mode === 'title') {
    ServerUtility.SaveContent({
      article : ControlSelector.GetArticleSelected(),
      title : $(".article-title").val(),
      mode : mode
    });
  } else {
    ServerUtility.SaveContent({
      article : ControlSelector.GetArticleSelected(),
      title : $(".article-title").val(),
      markdown : $(".article-content").val(),
      html : $(".article-preview").html() ? $(".article-preview").html() : preview
    });
  }
};

ControlSelector.SetNotebookSelected = function (elementGroup, element) {
  Global.ActiveElement(elementGroup, element);

  $("#selectedNotebookId").val($(element).attr('id'));
};

ControlSelector.GetNotebookSelected = function () {
  return $("#selectedNotebookId").val();
};

ControlSelector.GetArticleSelected = function () {
  return $("#selectedArticleId").val();
};

ControlSelector.SetArticleSelected = function (elementGroup, element) {
  Global.ActiveElement(elementGroup, element);

  $("#selectedArticleId").val($(element).attr('id'));
};


ControlSelector.UpdateTitle = function (callback) {
  $('.article-title').bind('input', callback);
};

ControlSelector.UpdateContent = function (callback) {
  $('.article-content').bind('input', callback);
};
