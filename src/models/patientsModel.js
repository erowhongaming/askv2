const mongoose = require('../config/mongodb-con');

// Define the schema
const patientSchema = new mongoose.Schema({
    // Define your patient schema fields here
    firstname: String,
    lastname: String,
    contact: {
    mobilenumber: String
    }
});
const patient = {
    aggregateVisits: async function(mobilephone) {
      try {
        const result = await this.aggregate([
        {
            $match: {
                "contact.mobilephone": mobilephone,
                "visits.statusflag": 'A'
            }
         },
          {
            $lookup: {
              from: "patientvisits",
              localField: "_id",
              foreignField: "patientuid",
              as: "visits"
            }
          },
         
          {
            $project: {
              mobilephone: "$contact.mobilephone",
              _id: 1,
              firstname: 1,
              middlename: 1,
              lastname: 1
            }
          }
        ]);
        return result;
      } catch (error) {
        throw new Error('Error executing aggregation:', error);
      }
    },
    
  };
  
  // Assuming you have a mongoose schema defined elsewhere (patientSchema)
  const Patient = mongoose.model('Patient', patientSchema);
  
  // Merging the functionality from the object into the Patient model
  Patient.aggregateVisits = patient.aggregateVisits;
  
module.exports = Patient;




// Testing the aggregateVisits method
(async () => {
    try {
      const mobilephone = '09082616668';
      const result = await Patient.aggregateVisits(mobilephone);
      console.log('Aggregation result:', result);
    } catch (error) {
      console.error('Error testing aggregateVisits:', error);
    }
  })();