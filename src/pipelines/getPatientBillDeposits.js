
const { ObjectId } = require('mongodb');


const patientDeposits = (patientvisituid) => {
    return [
        
            {
                '$match' : {
                    'statusflag' : 'A', 
                    'iscancelled' : {'$ne' : true}, 
                    'isadjusted' : {'$ne' : true},
                     'isrefund' : {'$ne' : true},
                    'patientvisituid'  : new ObjectId(patientvisituid)
                }
            },

            {
                '$project' : {
                    'depositdate' : '$depositdate',
                    'paidamount' : '$paidamount'
                }
            }
        
        ];
};


// const pipeline = getPatientByMobileNum('09633245637');
console.log(patientDeposits);

module.exports = patientDeposits;