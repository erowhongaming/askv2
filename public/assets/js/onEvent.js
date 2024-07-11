

    // ON EVENT JQUERY


var request;

    $('#searchDoctor').keyup(function(){
      const query = $('#searchDoctor').val();
      if (request) {
        request.abort();
      }
      search(query);
    });

    var subspecialtyButton  = '';
    $('#subForm').on('click', 'input[type="radio"][name="sub-radioSpecialty"]', function() {
        
      
      const specialtyValue = $('input[name="radioSpecialty"]:checked').val();
      const selectedValue = $('input[name="sub-radioSpecialty"]:checked').val();
        console.log(subspecialtyButton);
      
      if(subspecialtyButton != selectedValue){
        if (selectedValue) {
            if (request) {
                    request.abort();
                }
                getDoctorsBySpecializationAndSubspecialization(specialtyValue, selectedValue);
            } else {
                
                $('#selectedValue').text('None');
            }
         
        subspecialtyButton = selectedValue;
      }else{

      
        $('input[name="sub-radioSpecialty"]:checked').prop('checked', false);
        $('#selectedValue').text('None'); 
        getDoctorsBySpecializationAndSubspecialization(specialtyValue, '');

        subspecialtyButton = '';
      }
    });

     
    var specialtyButton  = '';

    $('#myForm').on('click', 'input[type="radio"][name="radioSpecialty"]',function(event){
        event.stopPropagation(); // Prevent bubbling to document level
        const specialtyValue = $('input[name="radioSpecialty"]:checked').val();
        
      
        if (specialtyValue != specialtyButton) {
            // Handle specific behavior for radio buttons if needed
            selectedSpecialty();
            specialtyButton = specialtyValue;
        } else {
        
            $('input[name="radioSpecialty"]:checked').prop('checked', false);
            $(".sidebar-wrapper").hide(400);
            $('#selectedValue').text('None');
            getPreData();
            specialtyButton = '';
        }    
       
    });
    
    $('body').on("click", "#runnginBill-link", ()=> {
        goTo('#runningBill');
    });

    function resetWhenHome(){
        // event.preventDefault();
        //toggleSearch();
         const searchIcon = document.querySelector('#search-icon i'); 
        searchIcon.classList.remove('ri-close-line');
        searchIcon.classList.add('ri-search-2-line');
        
        $('.search-input').val('');



        $('#mobilenumber').val('');
        $('input[name="radioSpecialty"]:checked').prop('checked', false);
        $('input[name="sub-radioSpecialty"]:checked').prop('checked', false);
      
        $('input[name="sideHMO"]:checked').prop('checked', false);

        
      
        // Running Bill 
         $('#billingDetailsTable').html('');
      
        $('#runningBillTable').css('display', 'none');
        showStep(1);
   
        $('#runningbillLogin').css({
            display: 'block',
            opacity: 0
        }).animate({ opacity: 1 }, 300);
        getPreData();

        closeKeyboard();
        closeKeyboardNum();
        closeKeyboardOTP();
        goTo('#landingPage');



    }
    $('#sidebar-home').click(resetWhenHome);
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



// Set idle timeout duration (5 minutes = 300,000 milliseconds)
const IDLE_TIMEOUT = 120000; // 5 minutes

let idleTimer; // Variable to hold the timeout ID
let lastActivityTime; // Variable to track the last activity time

// Function to reset the idle timer
function resetTimer() {
  clearTimeout(idleTimer); // Clear the previous timeout
  lastActivityTime = Date.now(); // Record the current time as the last activity time
  idleTimer = setTimeout(idleTimeout, IDLE_TIMEOUT); // Reset the timer for another 5 minutes
}

// Function to handle idle timeout (executed after 5 minutes of inactivity)
function idleTimeout() {
  console.log('User is idle. Executing myFunction...');
  // Replace with your function logic
  myFunction();
}

// Start the initial timer
resetTimer();

// Event listeners to reset timer on user activity
document.addEventListener('mousemove', resetTimer);
document.addEventListener('keypress', resetTimer);
document.addEventListener('mousedown', resetTimer);
document.addEventListener('touchstart', resetTimer); // Add touchstart event to reset timer

// Example function to be executed after idle timeout
function myFunction() {
  resetWhenHome();
  // Replace with your function logic (e.g., logout user, perform cleanup tasks, etc.)
}

// Function to display the remaining time
function displayRemainingTime() {
  const currentTime = Date.now();
  const timeElapsed = currentTime - lastActivityTime;
  const timeRemaining = IDLE_TIMEOUT - timeElapsed;
  
  // Display remaining time in seconds
  //console.log(`Time remaining before idle timeout: ${Math.ceil(timeRemaining / 1000)} seconds`);
  
 
  $('#idLeCountdown').html(`Logging out in <b>${Math.ceil(timeRemaining / 1000)} seconds </b> <br> <span style="font-size:9px">Timer resets when activity resumes</span>`);
}

// Update remaining time every second
setInterval(displayRemainingTime, 1000);