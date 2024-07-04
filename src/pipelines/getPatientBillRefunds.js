
const { ObjectId } = require('mongodb');


const patientBillrefunds = (patientvisituid) => {
    return [
       
        {
            '$match': {
                statusflag: "A",
                iscancelled: { $ne: true },
                statusuid: new ObjectId("5edcda8726070b2ec9e165aa"),
                patientvisituid:new ObjectId(patientvisituid)
            }
        },
        {
            '$project': {
                depositdate: "$depositdate",
                paidamount: "$paidamount",
            
            }
        },

            {
                '$group':
                            
                            {
                                '_id': null,
                                'total_refunds': {
                                '$sum': '$paidamount'
                                }
                            }
            }
          
    ];
}
// const pipeline = getPatientByMobileNum('09633245637');
//console.log(patientBillrefunds);

module.exports = patientBillrefunds;