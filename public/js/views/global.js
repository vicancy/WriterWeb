
//IE 10 would cache the url and return 304 result, add random url paramter to avoid such behavior
var generateUrl = function (basic) {
  //IE 10 don't have origin property for window.location
  if (!window.location.origin)
     window.location.origin = window.location.protocol + "//" + window.location.host;
  return  window.location.origin + "/" + basic + "?breakcache=" + Math.random();
};

$(document).ready(function () {
  window.generateUrl = generateUrl;
});