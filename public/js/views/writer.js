var writing = new window.writing();

var loadArticles = function (notebookId, action) {
  var url = "editable-article-list";
  var data = {
    notebookId: notebookId,
    action: action
  };
  $.get(url, data).success(function (res) {
    $("#article-list").html(res);

    //Get the data passed in from route.js
    loadArticle(getInitArticleSelected());
  });
};

var setNotebookSelected = function (notebookId) {
  $("#selectedNotebookId").val(notebookId);
};

var getNotebookSelected = function () {
  return $("#selectedNotebookId").val();
};

var getInitArticleSelected = function () {
  return $("#initSelectedArticleId").val();
};

var newArticle = function (notebookId) {
  //Post a default article to server -- seems not necessory, can be done when auto-saving

  //Set the newly added article to the selectedArticleId -- if not communicate with server, can not get the article id
  //TODO: talk to server or not?
  //If not: do this when auto-saving
  loadArticles(notebookId, 'create');
};

var loadArticle = function (articleId) {
  writing.setArticleSelected(articleId);
  writing.loadArticleContent('get');
}

$(document).ready(function () {
  loadArticles(getNotebookSelected());
});