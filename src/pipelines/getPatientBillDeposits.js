
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
            },
            {
                '$group':
                 
                  {
                    '_id': null,
                    'total_deposit': {
                      '$sum': '$paidamount'
                    }
                  }
              }
        
        ];
};

// console.log(patientDeposits);

module.exports = patientDeposits;