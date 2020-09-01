
function calculateFinalPayment(){

  var hospital_fee = parseInt(document.getElementById("hospital_fee").value);
  var consultent_fee= parseInt(document.getElementById("consultent_fee").value);
  hospital_fee=hospital_fee||0;
  consultent_fee=consultent_fee||0;
  var subtotal=0;
  
  if(consultent_fee==0|| hospital_fee ==0 ){

  //alert("Please enter non zero values");
   swal("Form is incomplete !!");
  }
  else{

    subtotal=hospital_fee+consultent_fee;
    document.getElementById('display').innerHTML= subtotal;
    

  }
}

