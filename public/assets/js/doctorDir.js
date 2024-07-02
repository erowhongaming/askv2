
$('span#collapse').click(function() {
        var $span = $(this);
        var $icon = $span.find('.icon'); // Find the icon within the span
        var currentText = $span.html(); // Get the current HTML content of the span

      
    // Toggle text and icon based on the current state
    if ($icon.hasClass('ri-arrow-up-s-line')) {
        $icon.removeClass('ri-arrow-up-s-line').addClass('ri-arrow-down-s-line');
    } else {
        $icon.removeClass('ri-arrow-down-s-line').addClass('ri-arrow-up-s-line');
    }
        // Toggle 'active' class on the parent tr element
        $span.parents("tr.collapse_new").toggleClass("active");
    });
$(".btnAll").click(searchToggleALL);

function searchToggleALL(){
  const query = $('#searchDoctor').val();
  if ($(".btnAll").hasClass("active") ) {
      // If .btnAll has the active class, remove it
      $(".btnAll").removeClass("active");
      
      search(query);
     
  } else {
      // If .btnAll does not have the active class, add it
      $(".btnAll").addClass("active");
       // Perform actions when active class is removed
       $('input[name="radioSpecialty"]:checked').prop('checked', false);
      $('input[name="sub-radioSpecialty"]:checked').prop('checked', false);
      search(query);
     
  }
}

function toggleSearch(){
  const searchBar = document.querySelector('.search-input__wrapper');
  const searchInput = document.querySelector('#searchDoctor'); // Assuming this is the search input field
  searchBar.classList.toggle('search-input__wrapper_active');
  const searchIcon = document.querySelector('#search-icon i'); 
  // Clear the input value if the search bar is being closed
  if (searchBar.classList.contains('search-input__wrapper_active')) {
    searchIcon.classList.remove('ri-search-2-line');
    searchIcon.classList.add('ri-close-line');
    searchIcon.classList.add('ri-close-line');
    searchInput.focus(); // Optionally, focus the input field when active
  } else {
    searchIcon.classList.remove('ri-close-line');
    searchIcon.classList.add('ri-search-2-line');
    searchInput.value = ''; // Clear the input value if the search bar is being closed
    search(searchInput.value);
  }
}
$('#search-icon').click(toggleSearch);


    function goTo(target) {
     

      if(target == '#portfolio'){
          doctorsDir(target);
      }else if(target == '#runningBill'){
          runnginBill(target);
      }else if(target == '#landingPage'){
          home(target);
      }

    } 
  
    function home(target){
      $('html, body').animate({
          scrollTop: $(target).offset().top
      }, 200, 'easeInOutCubic');
    }
    function doctorsDir(target){
      $('html, body').animate({
          scrollTop: $(target).offset().top
      }, 200, 'easeInOutCubic');
    }

    function runnginBill(target){
      $('html, body').animate({
          scrollTop: $(target).offset().top
      }, 200, 'easeInOutCubic');
    }



    function groupDataBySpecializationAndSubSpecialization(data) {
      const groupedData = {};

      // Iterate over each object in the data array
      data.forEach(doctor => {
          const specialization = doctor.specialization;
          const subSpecialization = doctor.subSpecialization;

          // Check if the specialization key exists in the groupedData object
          if (!groupedData[specialization]) {
              // If the specialization key does not exist, create a new object for it
              groupedData[specialization] = {};
          }

          // Check if the subspecialization key exists in the specialization object
          if (!groupedData[specialization][subSpecialization]) {
              // If the subspecialization key does not exist, create a new array for it
              groupedData[specialization][subSpecialization] = [];
          }

          // Add the current doctor object to the array corresponding to its subspecialization
          groupedData[specialization][subSpecialization].push(doctor);
      });

      return groupedData;
    }

  // Function to group data by specialization
    function groupDataBySpecialization(data) {
        const groupedData = {};

        // Iterate over each object in the data array
        data.forEach(doctor => {
            const specialization = doctor.specialization;

            // Check if the specialization key exists in the groupedData object
            if (!groupedData[specialization]) {
                // If the specialization key does not exist, create a new array for it
                groupedData[specialization] = [];
            }

            // Add the current doctor object to the array corresponding to its specialization
            groupedData[specialization].push(doctor);
        });

        return groupedData;
    }
    
    // Function to group data by specialization
    function groupDataBySubSpecialization(data) {
        const groupedData = {};

        // Iterate over each object in the data array
        data.forEach(doctor => {
            const subSpecialization = doctor.subSpecialization;

            // Check if the specialization key exists in the groupedData object
            if (!groupedData[subSpecialization]) {
                // If the specialization key does not exist, create a new array for it
                groupedData[subSpecialization] = [];
            }

            // Add the current doctor object to the array corresponding to its specialization
            groupedData[subSpecialization].push(doctor);
        });

        return groupedData;
    }
    
    
    function search(query){


      const selectedSpecialty =  $('input[name="radioSpecialty"]:checked').val() ? $('input[name="radioSpecialty"]:checked').val() : 'ALL';
      
      const selectedSubSpecialty = $('input[name="sub-radioSpecialty"]:checked').val();
      if(query != '' && (selectedSpecialty == 'ALL' )){
          $.ajax({
            url: `/api/doctors/search?q=${encodeURIComponent(query)}`,
            method: 'GET',
            
            success: function(data) {
              $('#physicians-container').html('');
            
              renderPhysicians(data);
               
            },  
            error: function() {
                console.error('Failed to load doctor data');
            }
        });
      }else if(selectedSpecialty != 'ALL'){
        getDoctorsBySpecializationAndSubspecialization(selectedSpecialty,selectedSubSpecialty);
      }else{
        $('#physicians-container').html(``);
        getInitialLoading();
      }
    }
  

    function getInitialLoading(){
       
        // Initial load 
        $.ajax({
          url: `/api/doctors`,
          method: 'GET',
          success: function(data) {              
              
            // Limit data to the first 100 doctors
          
            
            // Group data by specialization and subspecialization
            const groupedBySpecialization = groupDataBySpecialization(data);                
            const groupBySubSpecialization = groupDataBySubSpecialization(data);            

           
          
            $('#filterSpecialty').html('');
          
            // Append filter items for each specialization
            for (const specialization in groupedBySpecialization) {
                $('#filterSpecialty').append(
                  `<label  >
                      <input type="radio" name="radioSpecialty" value="${specialization}"  />
                      <div class="specialty-filter box" data-toggle="tooltip" data-placement="top" title="CLICK ${specialization}">
                        <span class="specialtyh1">${specialization}</span>
                      </div>
                    </label>`                    
                );
            }

            $('#physicians-container').html('');

            const limitedData = data.slice(0, 100);

            $(".btnAll").addClass("active");
            renderPhysicians(limitedData);
             
          },
          error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error:', textStatus, errorThrown);         
          }
        })
    }


 
    function close_sidebar(){  

      $(".sidebar-wrapper").hide(400);
      $('input[name="sub-radioSpecialty"]:checked').prop('checked', false);
      $('#navbar').show();
      const specialtyValue = $('input[name="radioSpecialty"]:checked').val();
      const subspecialtyValue = $('input[name="sub-radioSpecialty"]:checked').val();
     
  
      if (specialtyValue != 'ALL') {
        getDoctorsBySpecializationAndSubspecialization(specialtyValue,subspecialtyValue);
      }
    }
 
    function getSubSpecializationGroups(specialization){
      $.ajax({
        url: `api/doctors/grouped-specializations?specialization=${encodeURIComponent(specialization)}`,
        method: 'GET',
        success: function(data) {
          $('#subSpecialtyFilter').html('');      
          // Iterate over each specialization
          $.each(data, function(index, specializationGroup) {
              // Iterate over each sub-specialization and add to the array
              $.each(specializationGroup.subSpecializations, function(subIndex, subSpecialization) {
                  
                  $('#subSpecialtyFilter').append(
                    ` <label>
                        <input type="radio" name="sub-radioSpecialty" value="${subSpecialization}"  />
                        <div class="sub-specialty-filter sub-box">
                          <span class="sub-specialtyh1">${subSpecialization}</span>
                        </div>
                      </label>
                    `);
              });
          });
        },  
        error: function() {
            console.error('Failed to load subspecialization data');
        }
      });
      return 1;
    
    }
      


    function getDoctorsBySpecializationAndSubspecialization(specialization,subSpecialization) {
      const subspecialization = (subSpecialization == undefined || subSpecialization == '') ? '':subSpecialization;

      const searchVal = getCheckedHmoValue();
      //const searchVal = $('#searchDoctor').val();

      if(specialization != null && specialization != ''){
        $.ajax({
            url: `/api/doctors/search-by-specialization-with-subspecialization?specialization=${encodeURIComponent(specialization)}&subSpecialization=${encodeURIComponent(subspecialization)}&searchVal=${encodeURIComponent(searchVal)}`,
            method: 'GET',
            success: function(data) {
              renderPhysicians(data);
            },  
            error: function() {
                console.error('Failed to load doctor data');
            }
        });
      }
    } 

    
    function renderPhysicians(data){
      $('#physicians-container').html('');
      
      for (const doctor in data) {
        
        
          const doctorInfo = data[doctor];
          var img = '';
          var affil = '';
      
          // Check if doctorInfo.hmo_ids is defined and not an empty string
          if (typeof doctorInfo.hmo_id !== 'undefined' && doctorInfo.hmo_id !== '' && doctorInfo.hmo_id !== null) {
            const hmo_id_string = doctorInfo.hmo_id;
            // Split the string into an array using ';' as a delimiter
            var hmo_id_array = hmo_id_string.split(';');
          
            affil = ` <div class="affiliated-payors">`;
              for (let i = 0; i < hmo_id_array.length; i += 2) {
                  // Create a new grid item div for each pair of images
                  affil += '';

                  // Loop through the next 2 elements or less if at the end of the array
                  for (let j = i; j < i + 2 && j < hmo_id_array.length; j++) {
                      let imageUrl = 'https://hris.csmc.ph/photos/hmo/' + md5(hmo_id_array[j].trim()) + '.jpg'; // Assuming md5 function is defined

                      // Append the image tag to the current grid item div
                      affil += '<img src="' + imageUrl + '" class="payor-img" alt="" loading="lazy">';
                  }

                  affil += ''; // Close the grid item div
              }

            affil +=`</div>`;

          }else{
            affil ='<i>None</i>'
          }

          const rooms = doctorInfo.rooms;
    
          let clinicalSchedules =  '';
          // Loop through each room and clinical schedules
          for (const room of rooms) {
              // Access individual properties of each room
             
              clinicalSchedules += `
                <div class="col-sm-12 border p-3"  style="margin-top:10px;border-radius: 5px; padding: 0;">
                       <strong style="font-size:12px;color:#969393">Clinic Schedule</strong>   <br> 
                     
                         <strong style="font-size:10px;color:black;">`+room.schedule+`</strong><br>
                    
                    <strong style="font-size:12px;color:#969393">Room</strong>      
                    <br>
                     <strong style="font-size:10px;color:black;">`+room.room+`</strong>
                  </div> 
              `;
              // Perform other operations with room data
          }

            // // Generate schedule rows
        

          img =` <img src="https://hris.csmc.ph/photos/${doctorInfo.person_id}.jpg" class="image--cover" alt="" loading="lazy">`;
          $('#physicians-container').append(
            `
            <div class="docs col-lg-3 col-md-6 align-items-stretch ${doctorInfo.specialization.toLowerCase().replace(/\s+/g, '_')}" >
                <div class="doc-member"> 
                  <div class="member-img"  >
                 
                    `+img+`
                  </div>
                  <div class="member-info">
                    <strong style="font-size:18px;color:#002e5c;text-align:center;font-weight:900;">${doctorInfo.fullname}</strong><br>
                    <strong style="font-size:12px;text-align:center;color:#969393"><i>${doctorInfo.specialization} - ${doctorInfo.subSpecialization}</i></strong>
                   
                    <div class="row">
                     `+clinicalSchedules+`
                      
                      
                      <div class="col-sm-12  border p-3" style="margin-top:10px;border-radius: 5px;">
                        <strong style="font-size:12px;color:#969393">Secretary</strong> <br>
                  
                        <strong style="font-size:11px;color:black;">${doctorInfo.secretary} - </strong> 
                        <strong style="font-size:11Px;color:black;">${doctorInfo.local_num}</strong> 

                      </div> 
                      <div class="col-sm-12  border p-3" style="margin-top:10px;border-radius: 5px;">
                        <strong style="font-size:12px;color:#969393">Affiliated Payors: </strong>
                        <div class="affiliated-payors-wrapper">
                         
                                `+affil+`
                               
                           
                        </div>
                      </div>

                    </div>

                
                  </div>
                
                </div>
              </div>
          `);
       
      }
    }
    



    function selectedSpecialty(){
      const  selectedValue = $('input[name="radioSpecialty"]:checked').val();  
      const selectedSubSpecialy = $('input[name="sub-radioSpecialty"]:checked').val();

     



      if (selectedValue != 'ALL') {

          $('.sidebar-title').html('Subspecialization(s) &nbsp;&nbsp <button type="button" onclick="close_sidebar()" id="close-sidebar"><i class="ri-close-circle-line"></i></button>');
         
          $(".btnAll").removeClass("active");
          getDoctorsBySpecializationAndSubspecialization(selectedValue,selectedSubSpecialy);         
          getSubSpecializationGroups(selectedValue);
          
      
          $(".side-menu > i").toggleClass("ri-close-fill", 300);
          $(".sidebar-wrapper").toggleClass("show-sidebar", 500);
          $('#navbar').hide();
          $(".sidebar-wrapper").show(500); 
      } else {
        $('#navbar').show();
          $(".sidebar-wrapper").hide(400);
          getInitialLoading();
          $('#selectedValue').text('None');
          $('#selectedValue').text('None');
      }
    }

    
 function getHMOs(){
  $.ajax({
    url: `/api/hmos`,
      method: 'GET',
      success: function(data) {
        
        $('.side-payors').html('');
        var hmos = '';
        $.each(data, function(index, item) {
          //  hmos += `<button type="" class='btn btn-light btn-lg btn-block'>`+item.name+`</button>`;
            hmos += `<label class="checkbox-btn">
                  <input type="checkbox" name="sideHMO" value="${item.name}"  />
                    <span></span>
                  ${item.name}
                 
                </label><br>`;
          });

        $('.side-payors').append(hmos);
          
    
          
      },  
      complete:function(){
        $('.checkbox-btn input[type="checkbox"]').on('change',eventCheckHMO);
      },
      error: function() {
          console.error('Failed to load doctor data');
      }

  });
  
}
function eventUnCheckHMO(){
  $('input[name="sideHMO"]:checked').prop('checked', false);
     
  const hmos = getCheckedHmoValue();
  // Log the imploded values
  search(hmos);
}

function eventCheckHMO(){
   
  const hmos = getCheckedHmoValue();
  // Log the imploded values
  search(hmos);

}

function getCheckedHmoValue(){
    // Get the value from the #searchDoctor input field
    const query = $('#searchDoctor').val();

    // Get all checked checkboxes with the name 'sideHMO' and collect their values
    let checkedValues = $('input[name="sideHMO"]:checked').map(function() {
      return this.value;
    }).get();


    // Add the value from the #searchDoctor input field to the array
    checkedValues.push(query);

    // Join all the collected values into a single string with " - " as the delimiter
    let implodedValues = checkedValues.join('  -');
    implodedValues = implodedValues.replace(/[,.]/g, '');
    return implodedValues;
}
    