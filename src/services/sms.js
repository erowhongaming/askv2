const { generateOTP } = require('./helper');

const axios = require('axios');

async function sendSMS(message, phoneNumber, authToken) {
    
    const client_id = "15252307826838028532856564660668";
    const client_secret = "v1Lx2ICLv2MoDgO-aW=Dh4TgfbtrLO4nKspegYtxko3miy7mhvVB9WA4243c6qRb";

    try {
        const response = await axios.post('https://apps.csmc.ph/snapp/api/v1/', {
            message: message,
            to: phoneNumber,
        }, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'multipart/form-data',
            }
            ,form_params:{
                'client_id' : client_id,
                'client_secret' : client_secret,
            }
        });

        console.log('SMS sent successfully:', response.data);
        console.log('OTP:',generateOTP());
        return response.data;
    } catch (error) {
        console.error('Error sending SMS:', error.response.data);
        throw new Error('Failed to send SMS');
    }
} 
 

const sms_snapp = {
    getAuthoken: () => {

    },
    
};
// Usage
const message = "From Nodejs";
const phoneNumber = "09672773458";
const authToken = "QVNJNOGZJW8cai7tBG7P8XQJs8A7Sx64";

sendSMS(message, phoneNumber, authToken)
    .then(() => console.log("SMS sent successfully"))
    .catch(error => console.error("Failed to send SMS:", error.message));
