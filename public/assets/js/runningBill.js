
  // Running Bill


  /*
  """
  - Listens for keyup events on the input field with id 'mobilenumber'
  - Validates the input based on specific conditions:
      - If the input does not start with '09', shows an error message and disables the button
      - If the input length exceeds 11 digits, shows an error message and disables the button
      - If the input is exactly 11 digits but does not match the format /^09\d{9}$/, shows an error message and disables the button
  - Hides the error message if the input is valid
  """
  */

  $('#mobilenumber').keyup(checkEntry);
  /*
  Function to check if a mobile number is valid.
  Parameters:
  - mobileInput: jQuery object representing the mobile number input field
  - errorMessage: jQuery object representing the error message element
  - validateNumber: jQuery object representing the validate number button
  Returns:
  - 1 if the mobile number is invalid, 0 if the mobile number is valid
  */
  function checkEntry(){
    const mobileInput = $('#mobilenumber');
    const errorMessage = $('#error-message');
    const validateNumber = $('#validate-number');

    const mobileValue = mobileInput.val();
    if (mobileValue.length >= 2 && mobileValue.substring(0, 2) !== '09') {
        errorMessage.html('Must start with 09').show();
        validateNumber.prop('disabled', true);
        return 1;
    } else if (mobileValue.length != 11) {
        errorMessage.html('Must be 11 digits').show();  
        validateNumber.prop('disabled', true);
        return 1;
    } else if (mobileValue.length === 11 && !/^09\d{9}$/.test(mobileValue)) {
        errorMessage.html('Invalid mobile number format').show();
        validateNumber.prop('disabled', true);
        return 1;
    } else {
        validateNumber.prop('disabled', false);
        errorMessage.hide();
        return 0;
    }
    
  }

/* Validate mobile number and trigger validation function when button is clicked */

  $('#validate-number').click(function(){
    const mobilenumber =  $('#mobilenumber').val();
    if(checkEntry() == 0){
      validateMobileNumber(mobilenumber);
    }
  });


  /**
 * Function to validate a mobile number by sending an OTP and handling the response using SweetAlert2.
 * 
 * @param {string} mobilenumber - The mobile number to validate
 * @returns {void}
 */
  function validateMobileNumber (mobilenumber){
      Swal.fire(
      {
        title: 'Validating mobile number...',
       
        allowEscapeKey: false,
        allowOutsideClick: false,
        timer: 1500,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
        },
        willClose: () => {
          $.ajax(
          {
            url: `/api/validate/patients-is-active?mobilenumber=${encodeURIComponent(mobilenumber)}`,
            method: 'GET',
            success: function(data) {
              if(data.status == 1){
                      var testOTP ='';                           
                  // AJAX POST request
                  $.ajax({
                      url: '/api/generate/otp',
                      method: 'POST',
                      contentType: 'application/json',
                      data: JSON.stringify({ mobilenumber: mobilenumber }),
                      success: function(response) {
                          console.log('Response:', response);
                          testOTP=response.otp;
                          // Handle success response here
                      },
                      error: function(xhr, status, error) {
                          console.error('Error:', error);
                          // Handle error here
                      }
                  });



                Swal.fire({
                    icon: 'success',
                    title: 'Validation Successful',
                    html: 'Sending <b> 6 digit OTP </b> to your mobile number.',
                    timerProgressBar: true,
                    timer: 5000,
                    showConfirmButton: false
                }).then(() => {
   
                  // Mask the number
                  const maskedNumber = "*******" + mobilenumber.slice(-4)+"<br> Your Test OTP is: <b>"+testOTP+'</b>'; // Append "*******" to the masked part
                  
                  $('#maskedNumber').html(maskedNumber).show();
                  // This will be called after the timer ends
                  showStep(2);
              });

              }else{
                Swal.fire({
                    icon: 'error',
                    title: 'Mobile number not found',
                    text: 'This portal is only for Currently Admitted Patients. Please ensure the record you are accessing is currently admitted in CSMC.',
                    showConfirmButton: true
                });

              }
              
            },  
            error: function() {
              console.error('Failed to validate mobilenumber');
            }
          });
        }
      });
    
  }

  /* Verifies the OTP entered by the user

  This function constructs the OTP from individual input fields, checks if the OTP is exactly 6 digits long, and then verifies the OTP by making an AJAX call to the server. If the OTP is valid, it proceeds to the next step; otherwise, it displays an error message to the user.

  Returns:
  None */
  function verifyOTP(){
    // Construct the OTP from individual input fields
    let otp = '';
    $('.otp-input').each(function() {
        otp += $(this).val();
    });

    // Check if OTP is exactly 6 digits long
    if (otp.length === 6) {
      Swal.fire(
      {
        title: 'Verifying OTP...',
       
        allowEscapeKey: false,
        allowOutsideClick: false,
        timer: 1500,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
        },
        willClose: () => {
          const mobilenumber = $('#mobilenumber').val();
          $.ajax({
              url: '/api/generate/validate-otp-by-mobilenumber',
              method: 'POST',
              contentType: 'application/json',
              data: JSON.stringify({ mobilenumber: mobilenumber,otp: otp }),
              success: function(response) {
                  console.log('Response:', response);
                  if(response.status == 1){
                    showStep(3);

                    setTimeout(function() {
                      
                        // Call showBillingTable()
                        showBillingTable();
                    }, 2000); // 2000 milliseconds = 2 seconds
                  }else{
                    Swal.fire({
                    icon: 'error',
                    title: 'Invalid OTP',
                    text: 'Your OTP will expire in '+response.expires_at+'. Please complete the verification process promptly',
                    showConfirmButton: true
                });
                  }
                 
              },
              error: function(xhr, status, error) {
                  console.error('Error:', error);
                  // Handle error here
              }
          });

        }
      });
    }else {
        // Example: Disable submit button if OTP is not complete
        $('#submitBtn').prop('disabled', true);

    }
  }
  $('#verifyOTP').click(function(){
    verifyOTP();
  });

  function showBillingTable(){
    //hide login inpatient portal
    $('#runningbillLogin').css('display', 'none');
    $('#navbar').hide();
    //show billing table after validation
    $('#runningBillTable').css({
                    display: 'block',
                    opacity: 0
                }).animate({ opacity: 1 }, 300); // 300ms animation duration
  }


  function runninBillLogout(){
    
    $('#runningBillTable').css('display', 'none');
    showStep(1);
    $('#runningbillLogin').css({
                    display: 'block',
                    opacity: 0
                }).animate({ opacity: 1 }, 300); // 300ms animation duration
  }



