
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
      $('#otp input').val('');
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
          closeKeyboardNum();
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
                    timer: 1500,
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
          validateOTP(mobilenumber,otp);

        }
      });
    }else {
        // Example: Disable submit button if OTP is not complete
        $('#submitBtn').prop('disabled', true);

    }
  }

  function validateOTP(mobilenumber,otp){
    $.ajax({
        url: '/api/generate/validate-otp-by-mobilenumber',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ mobilenumber: mobilenumber,otp: otp }),
        success: function(response) {
            console.log('Response:', response);
            if(response.status == 1){
              showStep(3);
              closeKeyboardOTP();
              //  Get BillingDetails
              billingDetails(response);
            
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


   // Function to generate table for a specific category
  

  function billingDetails(response){
    $('#rbTable_name').html('');
    $('#rbTable_bdate').html('');
    $('#rbTable_patientnum').html('');
    $('#rbTable_admission').html('');
    $('#BalAmountDue').html('');
    $('#BalAmountCharges').html('');
    showBillingTable();
    $('#infoNotes').html(` 
          <div class="card mb-3" >
            <div class="card-body card-design">       
              <p class="card-text" style="text-align:justify; ">  Applicable discount/s (if any) will be deducted upon computation of the final bill. 
                                  The details shown here are based on your PROVISIONAL BILL and are SUBJECT TO CHANGE.</p>
            </div>
          </div>
          <div class="card mb-3" >
            <div class="card-body card-design">       
                <p class="card-text" style="text-align:justify"> Please call 8728-0001 local 3017/3018 or visit the Billing department should you have clarifications regarding your bill.</p>
            </div>
        </div>
        `);    


    const patientvisituid = response.details[0]._id;
    // Get  header  
    patientsDetails(response);
    // Get Billing Results 
    resultsDetails(patientvisituid,function(results){
    
     $('#rbTable_room').html(results.result[0].ward);
    });


  
    //Get Charges
    chargesDetails(patientvisituid,function(results){
      $('#billingDetailsTable').html(``);
      if(results.result.profFee){
       
          $('#infoNotes').append(`
              <div class="card mb-3" >
                <div class="card-body card-design">       
                    <p class="card-text" style="text-align:justify">   Professional Fees indicated prior to generation of final bill are net of Philhealth. If you have any clarifications regarding Professional Fees, kindly coordinate directly with your Doctors</p>
                </div>
              </div>
            `);

          

          let html = "";
          html += `<div class="p-3 border bg-light">`;
          html += `<h3>Professional Fee</h3>`;
          html += `<table class="table_new">
          <thead>
              <tr>
                  <th>Physician</th>
                  <th>Description</th>
                  <th>Qty</th>
                  <th>Unit Price</th>
                  <th>Amount</th>
              </tr>
          </thead>
          <tbody>`;
          $.each(results.result.profFee, function(date, data) {
           
          
              // Ensure items is an array and has elements
              if (data.items && Array.isArray(data.items)) {
                  let formattedSubtotal = data.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          
                  html += `<tr class="collapse_new">
                              <td colspan="5">
                                  <span id="collapse"><i class="ri-arrow-down-s-line icon"></i>
                                  <b class="left-content_new">${date}</b> &nbsp;&nbsp;
                                  <b class="right-content_new"> Subtotal: ${formattedSubtotal}</b>
                                  </span>
                                  <div class="table__wrapper">
                                      <table class="table_new table-inner" style="text-align:center">
                                          <tbody>`;
          
                  $.each(data.items, function(index, item) {
                    //  console.log("Item ID:", item._id);
          
                      // Format unit price and net amount if needed
                      let formattedUnitPrice = item.unitprice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });;
                      let formattedNetAmount = item.netamount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });;
          
                      html += `<tr>
                                  <td style="text-align: center;">${item.careprovidername}</td>
                                  <td style="text-align: center;">${item.itemname}</td>
                                  <td style="text-align: center;">${item.quantity}</td>
                                  <td style="text-align: center;">${formattedUnitPrice}</td>
                                  <td style="text-align: center;">${formattedNetAmount}</td>
                              </tr>`;
                  });
          
                  html += `        </tbody>
                                      </table>
                                  </div>
                              </td>
                          </tr>`;
              }
          
             
          });
          html += `    </tbody>
          </table>`;
          html += `</div>`;
          $('#billingDetailsTable').append(html);

      }
      if(results.result.charges){
        // Charges
        $.each(results.result.charges, function(category, dates) {
          let html = '';
        // console.log("Category:", category);
          html += `<div class="p-3 border bg-light">`;
          html += `<h3>Hospital Charges - ${category}</h3>`;
          html += `<table class="table_new">
                    <thead>
                      <tr>
                        <th>Department</th>
                        <th>Description</th>
                        <th>Qty</th>
                        <th>Unit Price</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>`;
        
          // Loop through dates for each category
          $.each(dates, function(date, data) {
            //console.log("Date:", date);
            let formattedSubtotal = data.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            
            html += `<tr class="collapse_new">
                      <td colspan="5">
                        <span id="collapse"><i class="ri-arrow-down-s-line icon"></i>
                        <b class="left-content_new">${date}</b> &nbsp;&nbsp;
                        <b class="right-content_new"> Subtotal: ${formattedSubtotal}</b>
                        </span>
                        <div class="table__wrapper">
                          <table class="table_new table-inner" style="text-align:center">
                            <tbody>`;
        
            if (data.items) {
            
              $.each(data.items, function(itemKey, itemValue) {
                  // Format unit price as number with comma for thousands and two decimal places
              let formattedUnitPrice = itemValue.unitprice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
              // Format net amount as number with comma for thousands and two decimal places
              let formattedNetAmount = itemValue.netamount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

                html += `<tr '>
                <td  style="text-align: center;">${itemValue.billinggroupname}</td>
                <td  style="text-align: center;">${itemValue.itemname}</td>
                <td style="text-align: center;">${itemValue.quantity}</td>
                <td style="text-align: center;">${formattedUnitPrice}</td>
                <td style="text-align: center;">${formattedNetAmount}</td>
            </tr>`;
              //  console.log("Item:", itemKey, itemValue);
              });
            }
            
            html += `    </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>`;
          });
        
          html += `</tbody>
                  </table>`;
          html += `</div>`;
          
          $('#billingDetailsTable').append(html);
        });
      }
      if(results.result.returns){
        
        let html = "";
        html += `<div class="p-3 border bg-light">`;
        html += `<h3>Returns and Discontinuations</h3>`;
        html += `<table class="table_new">
        <thead>
            <tr>
                <th>Department</th>
                <th>Description</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Amount</th>
            </tr>
        </thead>
        <tbody>`;
        $.each(results.result.returns, function(date, data) {
         
        
            // Ensure items is an array and has elements
            if (data.items && Array.isArray(data.items)) {
                let formattedSubtotal = data.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        
                html += `<tr class="collapse_new">
                            <td colspan="5">
                                <span id="collapse"><i class="ri-arrow-down-s-line icon"></i>
                                <b class="left-content_new">${date}</b> &nbsp;&nbsp;
                                <b class="right-content_new"> Subtotal: <b style='text-align:right'>${formattedSubtotal}</b></b>
                                </span>
                                <div class="table__wrapper">
                                    <table class="table_new table-inner" style="text-align:center">
                                        <tbody>`;
        
                $.each(data.items, function(index, item) {
                  //  console.log("Item ID:", item._id);
        
                    // Format unit price and net amount if needed
                    let formattedUnitPrice = item.unitprice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });;
                    let formattedNetAmount = item.netamount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });;
        
                    html += `<tr>
                                <td style="text-align: center;">${item.billinggroupname}</td>
                                <td style="text-align: center;">${item.itemname}</td>
                                <td style="text-align: center;">${item.quantity}</td>
                                <td style="text-align: center;">${formattedUnitPrice}</td>
                                <td style="text-align: center;">${formattedNetAmount}</td>
                            </tr>`;
                });
        
                html += `        </tbody>
                                    </table>
                                </div>
                            </td>
                        </tr>`;
            }
        
           
        });
        html += `    </tbody>
        </table>`;
        html += `</div>`;
        $('#billingDetailsTable').append(html);
      }

      // Hospital Balance
      let totalDeposits = 0 ;
      let totalRefunds = 0 ;
      
      if(results.total_refunds_and_deposits.deposits.length > 0) {
        totalDeposits = results.total_refunds_and_deposits.deposits[0].total_deposit;
      }

      if(results.total_refunds_and_deposits.refunds.length > 0) {
        totalRefunds = results.total_refunds_and_deposits.refunds[0].total_refunds;
      }


      let totalCharges = parseFloat(results.result.total_charges);
      let totalReturn = parseFloat(results.result.total_returns);
      let totalHospitalBal = parseFloat(totalCharges + totalReturn);
      let totalProFee = parseFloat(results.result.total_profFee);

      let availAmnt = parseFloat((totalCharges+totalReturn+totalProFee)-(totalDeposits-totalRefunds) );

      let formattedNegativeDeposits = totalDeposits !== 0 
      ? (-totalDeposits).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) 
      : totalDeposits.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  
      let html ='';
      let dateCu = getCurrentDate();
      
      html = `    
            
        <table style=" width:100%;border-top: 1px solid #3C2A21;padding-top:3px;font-weight:900;font-size:15px;">
                <h3>Amount Due</h3>
                <tr>
                  <td style="text-align:left"><b>Hospital Charges</b></td>
                  <td style="text-align:right" id="totalHospitalBal">${totalCharges.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
                <tr>
                  <td style="text-align:left"><b>Returns & Discontinuations</b></td>
                  <td style="text-align:right" id="totalHospitalBal">${totalReturn.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
                <tr>
                  <td style="text-align:left"><b>Professional Fees</b></td>
                  <td style="text-align:right"  id="totalProfFee">${totalProFee.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
                   <tr>
                  <td style="text-align:left"><b>Avail. Deposit Amount</b></td>
                  <td style="text-align:right;font-size:17px;"  id="totalProfFee">${formattedNegativeDeposits}</td>
                </tr>
                <tr style="font-size:25px;">
                  <td style="text-align:left"><b>Running Balance</b></td>
                  <td style="text-align:right;"  id="Running Balance">${availAmnt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>  
                </tr>
              
              </table>
               <span id="dataAsOfRunningBill"  class="right-content_p" style="font-size:9px;font-weight:200">Data as of ${dateCu}</span>
              `;

      $('#BalAmountDue').html(html);

      // let html1 ='';
      // html1 = `  
      //   <table style=" width:100%;border-top: 1px solid #3C2A21;padding-top:3px;font-weight:900;font-size:15px;">
      //           <h3>Charges</h3>
      //           <tr>
      //             <td><b>Hospital Charges</b></td>
      //             <td style="padding-left: 25px;" id="totalHospitalBal">${totalCharges.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      //           </tr>
      //           <tr>
      //             <td><b>Professional Fees</b></td>
      //             <td style="padding-left: 25px;"  id="totalProfFee">${totalProFee.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      //           </tr>
      //              <tr>
      //             <td><b>Returns & Discontinuations:</b></td>
      //             <td style="padding-left: 25px;"  id="totalProfFee">${totalReturn.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      //           </tr>
               
              
      //         </table>`;

      // $('#BalAmountCharges').html(html1);

      $('#navbar').hide();
      $('span#collapse').click(collapseTbl);
    });
    

  
  }


  function collapseTbl(){
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
  }

  function resultsDetails(patientvisituid,callback){
    $.ajax({
      url : 'api/runningbill/results',  
      method: 'POST',
      contentType: 'application/json', 
      
      
      data: JSON.stringify({ patientvisituid:patientvisituid }), 
      
      success: function(results) {
        callback(results); 
      },
      error: function(xhr, status, error) {
          console.error('Error:', error);
          // Handle error here
      }
    });
  }
  function patientsDetails(response){

      $('#rbTable_name').html(response.details[0].fullname);
      $('#rbTable_bdate').html(response.details[0].dateofbirth);
      $('#rbTable_patientnum').html(response.details[0].visitid);
      $('#rbTable_admission').html(response.details[0].admissionDate);
      $('#rbTable_mrn').html(response.details[0].mrn);
    
  }
  function chargesDetails(patientvisituid,callback){
    
    $.ajax({
      url : 'api/runningbill/charges',  
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ patientvisituid:patientvisituid}),
      beforeSend: function(){
        $('#billingDetailsTable').html(`
          <div class="spinner-container">
            <div class="spinner-grow text-dark" role="status">
              <span class="sr-only"></span>
            </div>
            <div class="spinner-grow text-dark" role="status">
              <span class="sr-only"></span>
            </div>
            <div class="spinner-grow text-dark" role="status">
              <span class="sr-only"></span>
            </div>
          
        </div>`);
      },
      success: function(results) {
      
        
       callback(results);
      },
      error: function(xhr, status, error) {
          console.error('Error:', error);
          
      }
    });
  }
  function showBillingTable(){ 
    $('#navbar').hide();
    //hide login inpatient portal
    $('#runningbillLogin').css('display', 'none');
   
    //show billing table after validation
    $('#runningBillTable').css({
                    display: 'block',
                    opacity: 0
                }).animate({ opacity: 1 }, 300); // 300ms animation duration
  }


  function runninBillLogout(){
    $('#mobilenumber').val('');
    $('#billingDetailsTable').html('');
    $('#runningBillTable').css('display', 'none');
   
    showStep(1);
    $('#runningbillLogin').css({
                    display: 'block',
                    opacity: 0
                }).animate({ opacity: 1 }, 300); // 300ms animation duration

   goTo('#runningBill');

  }


  $('#verifyOTP').click(verifyOTP);