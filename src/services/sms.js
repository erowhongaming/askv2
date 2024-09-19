require('../config/env-load');
const axios = require('axios');
const qs = require('qs'); // Import qs library for query string formatting

 

const sms_snapp = {
    getAuthoken: async () => {
        try {
            const response = await axios.post('https://apps.csmc.ph/snapp/api/v1/authorize', {
                client_id: process.env.CLIENT_ID,
                client_secret:  process.env.CLIENT_SECRET
            
            });
           return response.data;
        } catch (error) {
           // console.error('Response error:', error.message);
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error('Response error:', error.response.data);
                // console.error('Response status:', error.response.status);
                // console.error('Response headers:', error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                console.error('No response received:', error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error', error.message);
            }
            console.error('Config:', error.config);
        }
    },
    getAdminMonitoringAuthoken: async () => {
        try {
            const response = await axios.post('https://apps.csmc.ph/snapp/api/v1/authorize', {
                client_id: process.env.ADMIN_MONITORING_CLIENT_ID,
                client_secret:  process.env.ADMIN_MONITORING_CLIENT_SECRET
            
            });
           return response.data;
        } catch (error) {
           // console.error('Response error:', error.message);
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error('Response error:', error.response.data);
                // console.error('Response status:', error.response.status);
                // console.error('Response headers:', error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                console.error('No response received:', error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error', error.message);
            }
            console.error('Config:', error.config);
        }
    },
    sendSms: async (authToken,message,recipient) => {

        
        const formData = {
            sms_messages: JSON.stringify({
              sms_messages: [
                {
                  recipient: recipient,
                  message: message,
                  schedule_at: ""
                }
              ]
            })
          };
          
   
      
        try {
               // Serialize formData using qs.stringify
            const serializedFormData = qs.stringify(formData);

            // Make POST request using Axios
            const response = await axios.post('https://apps.csmc.ph/snapp/api/v1/sms_messages', serializedFormData,{
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded', 
                    'Authorization': `Bearer ${authToken}`, // Ensure to use backticks ` to correctly interpolate authToken
      
                  }
            });
            
           
            return response.data;
        } catch (error) {
            console.error('Error', error.message); console.error('Response error:', error.response.data);            // if (error.response) {
           
        }
    }
};


module.exports = sms_snapp;

// // Test
// sms_snapp.getAuthoken().then(result=>{
//     console.log(result.token);
//     let token = result.token;
//     sms_snapp.sendSms(token,'Hi','09672773458').then(result=>{
//         console.log(result);
//     })
// });

