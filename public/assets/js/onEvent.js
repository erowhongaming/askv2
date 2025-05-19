

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
    $('body').on("click", "#product-and-services-link", ()=> {
      $.ajax({
        url: '/api/app-posts', // Replace with your API endpoint
        type: 'GET',
        dataType: 'json', 
        data: {
            connected_app_name: "Assistance Service Kiosk",  // Replace with your parameter name and value
            content_type: "Product & Services"  // Replace with your parameter name and value
        },
        success: function(response) {
            // Clear the existing content inside the div
            $('#product-and-services-contents').empty();
            
            // Check if the response contains 'data'
            if (response.data && Array.isArray(response.data)) {
                // Loop through each item in the data array
                response.data.forEach(function(item) {
                  // Step 1: Process item.body (decode HTML, fix image URLs, embed YouTube videos)
                    let contentBody = item.body;

                    // Function to decode HTML entities
                    const decodeHTML = (html) => {
                        const txt = document.createElement('textarea');
                        txt.innerHTML = html;
                        return txt.value;
                    };

                    // Decode content
                    contentBody = decodeHTML(contentBody);

                    // Replace image src attributes
                    contentBody = contentBody.replace(/src="(\/uploads\/[^"]+)"/g, function(match, p1) {
                        return `src="http://srv-webapp01:3023${p1}" class="modal-image" style="max-width: 100%; height: auto;"`;
                    });

                    // Replace YouTube links with embedded iframes
                    contentBody = contentBody.replace(
                        /<oembed[^>]*url="(https:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]+))"[^>]*><\/oembed>/g,
                        function (match, fullUrl, videoId) {
                            return `<div style="width: 100%; margin: 20px 0;">
                                        <iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" 
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                                allowfullscreen 
                                                style="width: 100%; height: 400px;">
                                        </iframe>
                                    </div>`;
                        }
                    );

                    contentBody = contentBody.replace(
                        /https:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/g,
                        function (match, videoId) {
                            return `<div style="width: 100%; margin: 20px 0;">
                                        <iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" 
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                                allowfullscreen 
                                                style="width: 100%; height: 400px;">
                                        </iframe>
                                    </div>`;
                        }
                    );

                    // Step 2: Create the contentHTML with a gradient overlay
                    let contentHTML = `
                    <div class="col-lg-4 col-md-6 align-items-stretch content-title" data-id="${item.id}" 
                        style="cursor: pointer;">
                        <div class="icon-box iconbox-blue content-box" 
                            style="position: relative; padding: 20px; border: 1px solid #ddd; border-radius: 10px; 
                                height: 420px; display: flex; flex-direction: column; justify-content: space-between;
                                transition: transform 0.2s ease, box-shadow 0.2s ease;">
                            
                            <span class="badge text-bg-secondary" 
                                style="position: absolute; top: 10px; right: 10px; background-color: rgb(214, 214, 214); 
                                    color: white; padding: 5px 10px; border-radius: 5px; font-size: 12px;">
                                <i class='bi-eye-fill' style="color:white"></i> ${item.views}
                            </span>

                            <h1 style="margin: 0;">
                                <button class="content-title" data-id="${item.id}" 
                                    style="background: none; border: none; padding: 0; font: inherit; 
                                        text-decoration: none; color: inherit; cursor: pointer;">
                                    ${item.title}
                                </button>
                            </h1>
                            
                            <div class="content-preview" 
                                style="position: relative; height: 280px; overflow: hidden; flex-grow: 1;">
                                <div>${contentBody}</div> 
                                <div class="fade-overlay" 
                                    style="position: absolute; bottom: 0; left: 0; width: 100%; height: 50px; 
                                        background: linear-gradient(to bottom, rgba(255,255,255,0), white);">
                                </div>
                            </div>

                            <!-- "See More" Button Always at Bottom -->
                            <button class="content-title" data-id="${item.id}" 
                                style="background: none; border: none; padding: 10px; font: inherit; 
                                    text-decoration: none; color: inherit; cursor: pointer; 
                                    width: 100%; text-align: center; margin-top: auto;">
                                See More
                            </button>
                        </div>
                    </div>
                `;

                
                
                 
                    
                    // Append the new content to the div
                    $('#product-and-services-contents').append(contentHTML);
                });
    
                // Add click event listener for titles
                $(document).on('click', '.content-title', function(event) {
                    event.preventDefault(); // Prevent the default anchor behavior
                
                    const contentId = $(this).data('id'); // Get the content ID
                    const title = $(this).text(); // Get the title text
                    $.ajax({
                      url: '/api/app-preview', // Replace with your API endpoint
                      type: 'GET',
                      dataType: 'json', 
                      data: {
                           content_id: contentId,
                         
                      },
                      success: function(response) {
                        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                            const item = response.data[0]; // Get the first item
                            
                            // Step 1: Get the content body (with images)
                            let contentBody = item.body;
                    
                            // Function to decode HTML entities (e.g., &lt; to <)
                            const decodeHTML = (html) => {
                                const txt = document.createElement('textarea');
                                txt.innerHTML = html;
                                return txt.value;
                            };
                    
                            // Step 2: Decode the contentBody to handle escaped HTML entities
                            contentBody = decodeHTML(contentBody);
                    
                            // Step 3: Replace image src attributes to use the full URL (http://localhost:3020/uploads/)
                            contentBody = contentBody.replace(/src="(\/uploads\/[^"]+)"/g, function(match, p1) {
                                return `src="http://srv-webapp01:3023${p1}" class="modal-image" style="max-width: 100%; height: auto;"`;
                            });
                    
                         // Step 4: Replace YouTube video URLs with embedded iframe
                            contentBody = contentBody.replace(
                                /<oembed[^>]*url="(https:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]+))"[^>]*><\/oembed>/g,
                                function (match, fullUrl, videoId) {
                                    return `<div style="width: 100%; margin: 20px 0;">
                                                <iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" 
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                                        allowfullscreen 
                                                        style="width: 100%; height: 400px;">
                                                </iframe>
                                            </div>`;
                                }
                            );

                            // Also replace direct YouTube links (outside oEmbed)
                            contentBody = contentBody.replace(
                                /https:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/g,
                                function (match, videoId) {
                                    return `<div style="width: 100%; margin: 20px 0;">
                                                <iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" 
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                                        allowfullscreen 
                                                        style="width: 100%; height: 400px;">
                                                </iframe>
                                            </div>`;
                                }
                            );

                    
                            // Step 5: Construct content preview
                            let newContent =``;
                            newContent += `<h2>${item.title}</h2>${contentBody}`; 
                            // Step 6: Handle file_path (if available)
                            if (item.file_path) {
                                const uploadFolder = "http://srv-webapp01:3023/uploads/";
                                const files = item.file_path.split(',').map(f => f.trim());
                    
                                const videoExtensions = ["mp4", "webm", "ogg"];
                                const imageExtensions = ["jpg", "jpeg", "png", "gif"];
                                const pdfExtension = "pdf";
                                const zipExtension = "zip";
                    
                                // Separate video and other files
                                const videoFiles = files.filter(f => videoExtensions.includes(f.split('.').pop().toLowerCase()));
                                const otherFiles = files.filter(f => !videoExtensions.includes(f.split('.').pop().toLowerCase()));
                    
                                // Video previews (4-column grid)
                                if (videoFiles.length > 0) {
                                    newContent += `<div id="video-preview-container" style="margin-top:20px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px;">`;
                                    videoFiles.forEach(file => {
                                        const ext = file.split('.').pop().toLowerCase();
                                        newContent += `<div class="video-preview-item" style="border: 1px solid #ddd; padding: 5px;">
                                                           <video controls style="width: 100%; display: block; margin: 0 auto;">
                                                               <source src="${uploadFolder + file}" type="video/${ext}">
                                                               Your browser does not support the video tag.
                                                           </video>
                                                       </div>`;
                                    });
                                    newContent += `</div>`;
                                }
                    
                                // Other files previews
                                if (otherFiles.length > 0) {
                                    newContent += `<div id="other-files-container" style="margin-top:20px;">`;
                                    otherFiles.forEach(file => {
                                        const ext = file.split('.').pop().toLowerCase();
                                        if (imageExtensions.includes(ext)) {
                                            newContent += `<div style="margin-bottom:10px; border: 1px solid #ddd; padding: 5px;">
                                                              <img src="${uploadFolder + file}" alt="Image Preview" style="max-width: 100%; height: auto; display: block; margin: 0 auto;">
                                                           </div>`;
                                        } else if (ext === pdfExtension) {
                                            newContent += `<div style="margin-bottom:10px; border: 1px solid #ddd; padding: 5px;">
                                                              <iframe src="${uploadFolder + file}#toolbar=0&navpanes=0" style="width: 100%; height: 500px; border: none;"></iframe>
                                                           </div>`;
                                        } else if (ext === zipExtension) {
                                            newContent += `<div style="margin-bottom:10px; border: 1px solid #ddd; padding: 5px;">
                                                              <a href="${uploadFolder + file}" download style="display: block; text-align: center;">Download ZIP File</a>
                                                           </div>`;
                                        } else {
                                            newContent += `<div style="margin-bottom:10px; border: 1px solid #ddd; padding: 5px;">
                                                              <a href="${uploadFolder + file}" target="_blank" style="display: block; text-align: center;">${file}</a>
                                                           </div>`;
                                        }
                                    });
                                    newContent += `</div>`;
                                }
                            }
                            newContent += ` 
                            ${item.event_date ? `<p><strong>Event date: </strong>${item.event_date}</p>` : ''}
                            ${item.event_price ? `<p><strong>Price: </strong>${item.event_price}</p>` : ''}
                            ${item.tags ? `<p><strong>Tags: </strong>${item.tags.split(/[\s,]+/).map(tag => `<span class="hashtag" style="color: #1DA1F2; font-weight: bold;">#${tag.trim()}</span>`).join(' ')}</p>` : ''}`;
   
                            // Step 7: Insert content into modal
                            $('#preview-content-app').html(newContent);
                    
                            // Step 8: Ensure images fit properly
                            $('#preview-content-app img').each(function() {
                                $(this).css({
                                    'max-width': '100%',
                                    'height': 'auto'
                                });
                            });
                    
                        } else {
                            $('#preview-content-app').html('<p>No content available</p>');
                        }
                    }
                    ,
                    
                        error: function(error) {
                          console.log('Error fetching data:', error);
                      }
                    });
                    
                    // Show the modal
                    $('#exampleModalToggle').modal('show');
                });
    
            } else {
                console.log('No data found in response.');
            }
        },
        error: function(error) {
            console.log('Error fetching data:', error);
        }
    });
    
      goTo('#productAndServices');





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