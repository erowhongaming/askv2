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

/*
TSEST data
  {
    _id: new ObjectId('665ec6f0a4643aec93842f03'),
    firstname: 'EVELYN',
    fullname: 'FONTANOS, EVELYN',
    contactno: '09633245637'
  },
  {
    _id: new ObjectId('665eceeba787cc472a26a16a'),
    firstname: 'EMILY',
    fullname: 'TAN, EMILY',
    contactno: '09778552288'
  },
  {
    _id: new ObjectId('665ed77c888780ec747470d6'),
    firstname: 'LUNINGNING',
    fullname: 'CHUA SIOK ENG, LUNINGNING',
    contactno: '09175113831'
  },
  {
    _id: new ObjectId('665eda4d380bbaec7a21d069'),
    firstname: 'ZENAIDA',
    fullname: 'LACAP, ZENAIDA',
    contactno: '09178210349'
  },
  {
    _id: new ObjectId('665ee60ecf19bffdc699b770'),
    firstname: 'LILY',
    fullname: 'TAN, LILY',
    contactno: '09051670208'
  },*/