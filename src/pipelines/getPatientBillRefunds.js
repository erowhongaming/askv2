
const { ObjectId } = require('mongodb');


const patientBillrefunds = (patientvisituid) => {
    return [
       
        {
            '$match': {
                statusflag: "A",
                iscancelled: { $ne: true },
                statusuid: ObjectId("5edcda8726070b2ec9e165aa"),
                patientvisituid:ObjectId(patientvisituid)
            }
        },
        {
            '$project': {
                depositdate: "$depositdate",
                paidamount: "$paidamount",
            
            }
        }
          
    ];
}
// const pipeline = getPatientByMobileNum('09633245637');
console.log(patientBillrefunds);

module.exports = patientBillrefunds;