var writing = new window.writing();

var loadArticles = function (notebookId, action) {
  var url = window.generateUrl("editable-article-list");
  var data = {
    notebookId: notebookId,
    action: action
  };
  $.get(url, data).success(function (res) {
    $("#article-list").html(res);
    var selectedArticle = $('.list-group.articles a').first();
    //Get the data passed in from route.js
    loadArticle(selectedArticle, getInitArticleSelected());
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

var updateArticleList = function () {
  writing.updateTitle(function (index, item) {
    var title = $(this).val();
    $('.list-group.articles a.active h4').text(title);
  });
};

var updateArticleAbstract = function () {
  writing.updateContent(function (index, item) {
    var abstract = $(this).val().substring(0, 200);
    $('.list-group.articles a.active p').text(abstract);
  });
};

var loadArticle = function (element, articleId) {
  Global.ActiveElement($('.list-group.articles a'), element);
  writing.setArticleSelected(articleId);
  writing.loadArticleContent('get');
  updateArticleList();
  updateArticleAbstract();
};

$(document).ready(function () {
  loadArticles(getNotebookSelected());
  var selectedNotebook = $('.list-group.notebooks a').first();
  Global.ActiveElement($('.list-group.notebooks a'), selectedNotebook);
});