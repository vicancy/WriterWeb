$(document).ready(function () {
  var url = "article-list";
  var data = {userId: $('#userId').value};
  $.get(url, data).success(function (res) {
    $("#article-list").html(res);
  })
});