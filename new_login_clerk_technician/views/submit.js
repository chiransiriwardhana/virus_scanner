
$(document).ready(function () {

  $('#target').submit(function (event) {
    var c_Input = $('#c_').val();
    var cashier_Input = $('#cashier_').val();
    var consultent_Input = $('#consultent_').val();
    var room_no_Input = $('#room_no').val();
    var appointment_no_Input = $('#appointment_no').val();
    var appointment_on_Input = $('#appointment_on').val();

    var consultent_fee_Input = $('#consultent_fee').val();
    var hospital_fee_Input = $('#hospital_fee').val();


    var final = (cashier_Input == "") || (consultent_Input == "") || (room_no_Input == "") || (appointment_no_Input == "")
      || (appointment_on_Input == "") || (consultent_fee_Input == "") || (hospital_fee_Input == "") || (c_Input == "");


    if (final) {
      swal("Form is incomplete !!");

    }
    else {



    }

  });

});


document.querySelector('#target').addEventListener('submit', function (e) {

  var form = this;

  e.preventDefault(); // <--- prevent form from submitting

  swal({
    title: "",
    text: "Do you want to submit form",
    icon: "",
    buttons: [
      'No!',
      'Yes!'
    ],
    dangerMode: true,
  }).then(function (isConfirm) {
    if (isConfirm) {

      form.submit();

    } else {

    }
  });

});
