const { ObjectId } = require('mongodb');

/**
 * Retrieves patient information based on the provided mobile number.
 * 
 * @param {string} mobilenumber - The mobile number of the patient to search for.
 * @returns {Array} An array of MongoDB aggregation pipeline stages to query and project patient information.
 */
const getPatientByMobileNum = (mobilenumber) =>{
    return [
        {
            '$match': {
              statusflag: 'A',
              entypeuid: new ObjectId('5ecc110e3e2d6d75d98a39d4'),
              enddate: null
            }
          },
          {
            '$lookup': {
              from: 'patients',
              localField: 'patientuid',
              foreignField: '_id',
              as: 'patients'
            }
          },{
            $unwind: {
              path: "$patients",
             
            }
           },
           {
            '$match':{
                'patients.contact.mobilephone':mobilenumber
            }
          }
          ,
          {
            '$project': {
              _id: 1,
              patient_id: "$patient._id",
              primaryKey: '$patients._id',
              firstname: '$patients.firstname',  
              fullname: {
                  $concat: ['$patients.lastname', ', ', '$patients.firstname']
              },
              contactno: '$patients.contact.mobilephone'
            }
          }
    ];
};


// const pipeline = getPatientByMobileNum('09633245637');
console.log(getPatientByMobileNum);

module.exports = getPatientByMobileNum;
