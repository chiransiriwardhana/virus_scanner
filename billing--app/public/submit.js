
$(document).ready(function(){
    
    $('#target').submit(function(event){
         var c_Input=$('#c_').val();
         var cashier_Input=$('#cashier_').val();
         var consultent_Input=$('#consultent_').val();
         var room_no_Input=$('#room_no').val();
         var appointment_no_Input=$('#appointment_no').val();
         var appointment_on_Input=$('#appointment_on').val();
         //var reference_no_Input=$('#reference_no').val();
         //var city_Input=$('#city_').val();
         //var address_Input=$('#address_').val();
         //var e_mail_Input=$('#e_mail_').val();
         //var telephone_Input=$('#telephone_').val();
         //var date_of_birth_Input=$('#date_of_birth').val();
         
          //var g_Input = $('input[name=gender]:checked').val();
          //var surname_Input=$('#surname_').val();
          //var first_name_Input=$('#first_name').val();
        var consultent_fee_Input=$('#consultent_fee').val();
        var hospital_fee_Input=$('#hospital_fee').val();


          var final=(cashier_Input=="")||(consultent_Input=="")||(room_no_Input=="")||(appointment_no_Input=="")
          ||(appointment_on_Input=="")||(consultent_fee_Input=="")||(hospital_fee_Input=="")||(c_Input=="");


          if( final  ){
                swal("Form is incomplete !!");
               
          }
         else{

      

          }

         });

        });


        document.querySelector('#target').addEventListener('submit', function(e) {

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
    }).then(function(isConfirm) {
      if (isConfirm) {
      
      form.submit();
     // e.preventDefault();
      } else {
        
      }
    });

});
