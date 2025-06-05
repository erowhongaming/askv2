

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
       // console.log(subspecialtyButton);
      
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



    //START PRDUCTS AND SERVICES
        // Track navigation for breadcrumbs and back
        let navigationStack = [];

        // First Level: Main Types
        $('body').on("click", "#product-and-services-link", () => {
          navigationStack = []; // Reset stack
          $.ajax({
            url: '/api/cms/v1/app-content-type',
            type: 'GET',
            dataType: 'json',
            success: function(response) {
              $('#product-and-services-contents').empty();
              $('#breadcrumbs').html('');

              response.data.forEach(function(item) {
                let contentHTML = `
                    <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                      <button 
                        class="artsy-button w-100 text-start content-title content-button" 
                        data-id="${item.id}" data-name="${item.name}">
                        <div class="d-flex align-items-center">
                          <div class="folder-icon me-3"></div>
                          <div>
                            <div class="fs-5 fw-semibold">${item.name}</div>
                            <div class="tiny-hint text-muted">
                              <span>${item.subcategory_type_count} item${item.subcategory_type_count == 1 ? '' : 's'}</span> · 
                              <span class="text-decoration-underline">View details</span>
                            </div>
                          </div>
                        </div>
                      </button>
                    </div>

                `;
                $('#product-and-services-contents').append(contentHTML);
              });
            }
          });

          goTo('#productAndServices');
        });

        // Subtype Level
        $('body').on('click', '.content-button', function () {
          const id = $(this).data('id');
          const name = $(this).data('name');
          navigationStack.push({ id, name });
          fetchSubType(id);
        });

        function fetchSubType(parent_id) {
          $.ajax({
            url: `/api/cms/v1/app-sub-content-type`,
            type: 'GET',
            dataType: 'json',
            data: { parent_id },
            success: function(response) {
          
              const container = $('#product-and-services-contents');

              // Fade out the container before emptying
              container.fadeOut(150, function () {
                container.empty();
                updateBreadcrumbs();

                if (response.data.length === 0) {
                  fetchPosts(navigationStack[navigationStack.length - 2]?.id || null, parent_id);
                  container.fadeIn(150); // fade back in even if it's empty
                  return;
                }

                response.data.forEach(function(item, index) {
                  const contentHTML = `
                    <div class="col-lg-3 col-md-4 col-sm-6 mb-4 fade-in" style="animation-delay: ${index * 50}ms">
                      <button 
                        class="artsy-button w-100 text-start content-title content-button" 
                        data-id="${item.id}" data-name="${item.name}">
                        <div class="d-flex align-items-center">
                          <div class="folder-icon me-3"></div>
                          <div>
                            <div class="fs-5 fw-semibold">${item.name}</div>
                            <div class="tiny-hint text-muted">
                              <span>${item.content_count} item${item.content_count == 1 ? '' : 's'}</span> · 
                              <span class="text-decoration-underline">View details</span>
                            </div>
                          </div>
                        </div>
                      </button>
                    </div>
                  `;

                  container.append(contentHTML);
                });

                container.fadeIn(150); // Fade in the new content
              });
            

            }
          });
        }

        function fetchPosts(parentId, subtypeId) {

          $.ajax({
            url: '/api/cms/v1/app-posts',
            type: 'GET',
            dataType: 'json',
          data: {
              parent_id: parentId,
              subtypeId: subtypeId
            },
            success: function(response) {
              $('#product-and-services-contents').empty();
              updateBreadcrumbs();

              if (response.data && Array.isArray(response.data)) {
                response.data.forEach(function(item) {
                  let contentBody = decodeHTML(item.body);

                  contentBody = contentBody.replace(/src="(\/uploads\/[^"]+)"/g, (match, p1) =>
                    `src="http://srv-webapp01:3023${p1}" class="modal-image" style="max-width: 100%; height: auto;"`);

                  contentBody = contentBody.replace(/<oembed[^>]*url="(https:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]+))"[^>]*><\/oembed>/g,
                    (match, fullUrl, videoId) =>
                      `<div class="ratio ratio-16x9 mb-2"><iframe src="https://www.youtube.com/embed/${videoId}" allowfullscreen></iframe></div>`);

                  let postHTML = `
                  <div class="col-md-4 mb-4">
                    <button class="w-100 text-start border-0 bg-transparent p-0 preview-trigger" data-id="${item.id}" style="all: unset; display: block;">
                      <div class="card border-0 rounded-4 shadow-sm p-3 clickable-card">
                        <div class="card-body">
                          <h5 class="mb-2 fw-medium" style="font-size: 1.1rem; color: #111;">
                            ${item.title}
                          </h5>
                          <div class="text-muted" style="font-size: 0.95rem; line-height: 1.5;">
                            ${contentBody}
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>

                  <style>
                    .clickable-card {
                      background-color: #f9f9f9;
                      transition: transform 0.15s ease, background-color 0.2s ease, box-shadow 0.2s ease;
                      cursor: pointer;
                    }

                    .clickable-card:hover {
                      background-color: #f0f0f0;
                      box-shadow: 0 6px 14px rgba(0, 0, 0, 0.06);
                      transform: translateY(-2px);
                    }

                    .clickable-card:active {
                      background-color: #eaeaea;
                      transform: scale(0.98);
                      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
                    }
                  </style>


                  `;
                  $('#product-and-services-contents').append(postHTML);
                });
              }
            }
          });
        }

        // Preview modal (post detail)
        $('body').on('click', '.preview-trigger', function () {
          const postId = $(this).data('id');

          $.ajax({
            url: `/api/cms/v1/app-preview`,
            type: 'GET',
            dataType: 'json',
            data: { content_id: postId },
            success: function(response) {
              const item = response.data[0];
              let content = decodeHTML(item.body || '');

              content = content.replace(/src="(\/uploads\/[^"]+)"/g, (match, p1) =>
                `src="http://srv-webapp01:3023${p1}" class="modal-image" style="max-width: 100%; height: auto;"`);

              content = content.replace(/<oembed[^>]*url="(https:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]+))"[^>]*><\/oembed>/g,
                (match, fullUrl, videoId) =>
                  `<div class="ratio ratio-16x9 mb-2"><iframe src="https://www.youtube.com/embed/${videoId}" allowfullscreen></iframe></div>`);

              $('#previewModalLabel').html(item.title);
              $('#previewModalBody').html(content);
              $('#previewModal').modal('show');
            }
          });
        });

        function decodeHTML(html) {
          const txt = document.createElement('textarea');
          txt.innerHTML = html;
          return txt.value;
        }

        // Breadcrumb rendering
        function updateBreadcrumbs() {
          let breadcrumbHTML = '';
          if (navigationStack.length > 0) {
            breadcrumbHTML += `<button class="btn btn-sm btn-outline-secondary me-2" onclick="goBack()">⬅ Back</button>`;
          }

          navigationStack.forEach((item, index) => {
            breadcrumbHTML += `<span class="small text-muted">${item.name}</span>`;
            if (index < navigationStack.length - 1) breadcrumbHTML += ' &raquo; ';
          });

          $('#breadcrumbs').html(breadcrumbHTML);
        }

        // Go back button
        function goBack() {
          navigationStack.pop();
          const previous = navigationStack[navigationStack.length - 1];
          if (previous) {
            fetchSubType(previous.id);
          } else {
            $('#product-and-services-link').click(); // Reset to top level
          }
        }

            

    // END PRODUCTS AND SERVICES

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
       
        $('#runningbillLogin').css({
            display: 'block',
            opacity: 0
        }).animate({ opacity: 1 }, 300);
        showStep(1);
   
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
  getUpdatedDataUpdatingTheDoctorObject();
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


document.addEventListener('contextmenu', function(e) {
  e.preventDefault();
});
history.pushState(null, null, document.URL);
window.addEventListener('popstate', function () {
    history.pushState(null, null, document.URL);
});




function getUpdatedDataUpdatingTheDoctorObject(){
  $.ajax({
    url: `/api/doctors`,
    method: 'GET',
    success: function(data) {              
      
      let dateCu = getCurrentDate();
      $('#dataAsOf').text(`Data as of ${dateCu}`);
      console.log(`Doctor's Data updated from the background....Data as of ${dateCu}`);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.error('Error:', textStatus, errorThrown);         
    }
  })
}


   // Prevent two-finger scroll
   document.addEventListener('touchmove', function(event) {
      if (event.touches.length > 1) {
          event.preventDefault();
      }
  }, { passive: false });
 // Prevent zooming using gesture events
 document.addEventListener('gesturestart', function(event) {
  event.preventDefault();
});

document.addEventListener('gesturechange', function(event) {
  event.preventDefault();
});

document.addEventListener('gestureend', function(event) {
  event.preventDefault();
});

window.addEventListener('popstate', function(event) {
  history.pushState(null, null, document.URL);
});

history.pushState(null, null, document.URL);

     // Listen for the touchstart event
     document.addEventListener('touchstart', function(event) {
      // Check if there is only one touch point
      if (event.touches.length === 1) {
          const touch = event.touches[0];
          // Check if the touch point is near the left or right edge of the screen
          if (touch.clientX < 25 || touch.clientX > window.innerWidth - 25) {
              event.preventDefault(); // Prevent the default action (swipe-to-go-back)
          }
      }
  }, { passive: false });

  // Listen for the touchmove event
  document.addEventListener('touchmove', function(event) {
      // Check if there is only one touch point
      if (event.touches.length === 1) {
          const touch = event.touches[0];
          // Check if the touch point is near the left or right edge of the screen
          if (touch.clientX < 25 || touch.clientX > window.innerWidth - 25) {
              event.preventDefault(); // Prevent the default action (swipe-to-go-back)
          }
      }
  }, { passive: false });

  // Listen for the touchend event
  document.addEventListener('touchend', function(event) {
      // Check if there is only one touch point
      if (event.touches.length === 1) {
          const touch = event.changedTouches[0];
          // Check if the touch point is near the left or right edge of the screen
          if (touch.clientX < 25 || touch.clientX > window.innerWidth - 25) {
              event.preventDefault(); // Prevent the default action (swipe-to-go-back)
          }
      }
  }, { passive: false });

  document.querySelectorAll('.artsy-button').forEach(button => {
    button.addEventListener('touchstart', () => {
      button.classList.add('tapped');
    });
    button.addEventListener('touchend', () => {
      setTimeout(() => button.classList.remove('tapped'), 300); // Give ripple time to finish
    });
  });