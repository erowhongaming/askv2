const { Doctor } = require('./src/models/doctorsModel');
const { Patient } = require('./src/models/patientsModel');

// **Improved Doctor Details Test with Async/Await**
(async () => {
  try {
    const results = await Doctor.getDetails();
    console.log('Doctor details:', results);
  } catch (error) {
    console.error('Error fetching doctor details:', error);
  }
})();

// **Improved Doctor Search Test with Async/Await**
(async () => {
  try {
    const results = await Doctor.search('Dental');
    console.log('Dental doctors search results:', results);
  } catch (error) {
    console.error('Error searching doctors:', error);
  }
})();

// **Improved Patient Aggregation Test with Async/Await**
(async () => {
  try {
    const mobilephone = '09082616668';
    const result = await Patient.aggregateVisits(mobilephone);
    console.log('Patient visit aggregation result:', result);
  } catch (error) {
    console.error('Error fetching patient visit data:', error);
  }
})();
