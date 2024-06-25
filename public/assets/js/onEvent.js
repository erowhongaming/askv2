

    // ON EVENT JQUERY




    $('#searchDoctor').keyup(function(){
      const query = $('#searchDoctor').val();
  
      search(query);
    });

    $('#subForm').on('change', 'input[type="radio"][name="sub-radioSpecialty"]', function() {
      const specialtyValue = $('input[name="radioSpecialty"]:checked').val();
      const selectedValue = $('input[name="sub-radioSpecialty"]:checked').val();
      if (selectedValue) {
          
          getDoctorsBySpecializationAndSubspecialization(specialtyValue, selectedValue);
      } else {
         
          $('#selectedValue').text('None');
      }
    });



    $('#myForm').on('click', 'input[type="radio"][name="radioSpecialty"]',function(event){
    // Handle specific behavior for radio buttons if needed
    event.stopPropagation(); // Prevent bubbling to document level
    selectedSpecialty();
    });
    
    $('#runnginBill-link').click(function() {    
        // event.preventDefault();
        goTo('#runningBill');
    });
    $('#sidebar-home').click(function() {
        // event.preventDefault();
        goTo('#landingPage');
    });
    $('#sidebar-runningbill').click(function() {
        // event.preventDefault();
        goTo('#runningBill');
    });
    
    $('#doctorDir-link').click(function() {
        // event.preventDefault();
        goTo('#portfolio');
    });
    
    $('#sidebar-doctorsDir').click(function() {
        // event.preventDefault();
        goTo('#portfolio');
    });
    
    

    document.addEventListener("DOMContentLoaded", function(event) {
      function OTPInput() {
          const inputs = document.querySelectorAll('#otp > *[id]');
          for (let i = 0; i < inputs.length; i++) {
              inputs[i].addEventListener('keydown', function(event) {
                  if (event.key === "Backspace") {
                      inputs[i].value = '';
                      if (i !== 0) inputs[i - 1].focus();
                  } else {
                      if (i === inputs.length - 1 && inputs[i].value !== '') {
                          return true;
                      } else if (event.keyCode > 47 && event.keyCode < 58) {
                          inputs[i].value = event.key;
                          if (i !== inputs.length - 1) inputs[i + 1].focus();
                          event.preventDefault();
                      } else if (event.keyCode > 64 && event.keyCode < 91) {
                          inputs[i].value = String.fromCharCode(event.keyCode);
                          if (i !== inputs.length - 1) inputs[i + 1].focus();
                          event.preventDefault();
                      }
                  }
              });
          }
      }
      
      OTPInput();
    });
  