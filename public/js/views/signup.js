$(document).ready(function () {
  var av = new AccountValidator();
  var sc = new SignupController();
  $('#account-form').ajaxForm({
    beforeSubmit : function (formData, jqForm, options) {
      return av.validateForm();
    },
    success : function (responseText, status, xhr, $form) {
      if (status == 'success') {
        var data = {
          user : $('#user-tf').val(),
          pass : $('#pass-tf').val()
        };

        //redirect to home page
        var url = "/";
        $.post(url, data);
        window.location.href = '/home';
      }
    },
    error: function (e) {
      if (e.responseText == 'username-taken') {
        av.showInvalidUserName();
      } else if (e.responseText == 'email-taken') {
        av.showInvalidEmail();
      }
    }
  });

  av.clearErrorTag();
  $('#name-tf').focus();

});