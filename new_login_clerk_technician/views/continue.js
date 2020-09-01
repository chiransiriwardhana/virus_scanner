


$('#submitForm').submit(function (e) {
  e.preventDefault();
  $.ajax({
    url: '/data',
    type: 'post',
    data: $('#submitForm').serialize(),
    success: function (res) {
      if (res.page == 4) {


        window.location.href = 'test.html'


      }
      else if (res.page == 3) {


        window.location.href = 'billing.html'

      }
      else if (res.page == 0) {
        alert("There is no matching username or password under given role !!")
      }
      else { }




    }
  });
})
