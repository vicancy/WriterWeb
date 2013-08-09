$(document).ready(function () {
  var url = window.generateUrl("article-list");
  var data = {userId: $('#userId').value};
  $.get(url, data).success(function (res) {
    $("#article-list").html(res);
  });
});