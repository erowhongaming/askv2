
const { ObjectId } = require('mongodb');


const patientResults = (patientvisituid) => {
    return [
        {
            '$match': {
                'statusflag': 'A',
                'patientvisituid': new ObjectId(patientvisituid)
            }
        },
        {
            '$unwind': {
                'path': '$chargecodes',
                'preserveNullAndEmptyArrays': true
            }
        },
        {
            '$match': {
                'chargecodes.isbilled': { '$ne': false },
                'chargecodes.statusflag': 'A'
            }
        },
        {
            '$lookup': {
                'from': 'billinggroups',
                'localField': 'chargecodes.billinggroupuid',
                'foreignField': '_id',
                'as': 'billinggroupdetails'
            }
        },
        {
            '$unwind': {
                'path': '$billinggroupdetails',
                'preserveNullAndEmptyArrays': true
            }
        },
        {
            '$lookup': {
                'from': 'billinggroups',
                'localField': 'chargecodes.billingsubgroupuid',
                'foreignField': '_id',
                'as': 'billingsubgroupdetails'
            }
        },
        {
            '$unwind': {
                'path': '$billingsubgroupdetails',
                'preserveNullAndEmptyArrays': true
            }
        },
        {
            '$lookup': {
                'from': 'referencevalues',
                'localField': 'billingsubgroupdetails.billinggrouptypeuid',
                'foreignField': '_id',
                'as': 'billinggrouptypeuid'
            }
        },
        {
            '$unwind': {
                'path': '$billinggrouptypeuid',
                'preserveNullAndEmptyArrays': true
            }
        },
        {
            '$lookup': {
                'from': 'orderitems',
                'localField': 'chargecodes.orderitemuid',
                'foreignField': '_id',
                'as': 'orderitems'
            }
        },
        {
            '$unwind': {
                'path': '$orderitems',
                'preserveNullAndEmptyArrays': true
            }
        },
        {
            '$lookup': {
                'from': 'users',
                'localField': 'chargecodes.careprovideruid',
                'foreignField': '_id',
                'as': 'careprovider'
            }
        },
        {
            '$unwind': {
                'path': '$careprovider',
                'preserveNullAndEmptyArrays': true
            }
        },
        {
            '$lookup': {
                'from': 'referencevalues',
                'localField': 'careprovider.titleuid',
                'foreignField': '_id',
                'as': 'titleuid'
            }
        },
        {
            '$unwind': {
                'path': '$titleuid',
                'preserveNullAndEmptyArrays': true
            }
        },
        {
            '$lookup': {
                'from': 'ordersets',
                'localField': 'chargecodes.orderitemuid',
                'foreignField': '_id',
                'as': 'ordersets'
            }
        },
        {
            '$unwind': {
                'path': '$ordersets',
                'preserveNullAndEmptyArrays': true
            }
        },
        {
            '$lookup': {
                'from': 'patientorders',
                'localField': 'chargecodes.patientorderuid',
                'foreignField': '_id',
                'as': 'patientorderuid'
            }
        },
        {
            '$unwind': {
                'path': '$patientorderuid',
                'preserveNullAndEmptyArrays': true
            }
        },
        {
            '$lookup': {
                'from': 'patients',
                'localField': 'patientuid',
                'foreignField': '_id',
                'as': 'patient'
            }
        },
        {
            '$unwind': {
                'path': '$patient',
                'preserveNullAndEmptyArrays': true
            }
        },
        {
            '$lookup': {
                'from': 'referencevalues',
                'localField': 'patient.titleuid',
                'foreignField': '_id',
                'as': 'titleuid'
            }
        },
        {
            '$unwind': {
                'path': '$titleuid',
                'preserveNullAndEmptyArrays': true
            }
        },
        {
            '$lookup': {
                'from': 'patientvisits',
                'localField': 'patientvisituid',
                'foreignField': '_id',
                'as': 'pv'
            }
        },
        {
            '$unwind': {
                'path': '$pv',
                'preserveNullAndEmptyArrays': true
            }
        },
        {
            '$lookup': {
                'from': 'referencevalues',
                'localField': 'patientorderuid.entypeuid',
                'foreignField': '_id',
                'as': 'entype'
            }
        },
        {
            '$unwind': {
                'path': '$entype',
                'preserveNullAndEmptyArrays': true
            }
        },
        {
            '$lookup': {
                'from': 'referencevalues',
                'localField': 'pv.entypeuid',
                'foreignField': '_id',
                'as': 'visitentype'
            }
        },
        {
            '$unwind': {
                'path': '$visitentype',
                'preserveNullAndEmptyArrays': true
            }
        },
        {
            '$addFields': {
                'pv.admissionrequestuid': { '$ifNull': ['$pv.admissionrequestuid', ''] }
            }
        },
        {
            '$lookup': {
                'from': 'patientadditionaldetails',
                'localField': 'patientuid',
                'foreignField': 'patientuid',
                'as': 'adddetail'
            }
        },
        {
            '$unwind': {
                'path': '$adddetail',
                'preserveNullAndEmptyArrays': true
            }
        },
        {
            '$lookup': {
                'from': 'referencevalues',
                'localField': 'adddetail.addlnidentifiers.idtypeuid',
                'foreignField': '_id',
                'as': 'idtypeuid'
            }
        },
        {
            '$lookup': {
                'from': 'deposits',
                'localField': 'patientuid',
                'foreignField': 'patientuid',
                'as': 'totaldeposit'
            }
        },
        {
            '$lookup': {
                'from': 'depositrefundapprovals',
                'localField': 'patientuid',
                'foreignField': 'patientuid',
                'as': 'refunddeposit'
            }
        },
        {
            '$lookup': {
                'from': 'patientbills',
                'localField': 'pv._id',
                'foreignField': 'patientvisituid',
                'as': 'bill'
            }
        },
        {
            '$lookup': {
                'from': 'deathrecords',
                'localField': 'patientvisituid',
                'foreignField': 'patientvisituid',
                'as': 'dc'
            }
        },
        {
            '$lookup': {
                'from': 'newborndetails',
                'localField': 'pv.admissionrequestuid',
                'foreignField': 'admissionrequestuid',
                'as': 'nb'
            }
        },
        {
            '$lookup': {
                'from': 'users',
                'localField': 'modifiedby',
                'foreignField': '_id',
                'as': 'useruidnew'
            }
        },
        {
            '$unwind': {
                'path': '$useruidnew',
                'preserveNullAndEmptyArrays': true
            }
        },
        {
            '$lookup': {
                'from': 'diagnoses',
                'localField': 'patientvisituid',
                'foreignField': 'patientvisituid',
                'as': 'diagnoses'
            }
        },
        {
            '$lookup': {
                'from': 'problems',
                'localField': 'diagnoses.diagnosis.problemuid',
                'foreignField': '_id',
                'as': 'primarydiagnosis'
            }
        },
        {
            '$lookup': {
                'from': 'departments',
                'localField': 'useruidnew.defaultdepartment.uid',
                'foreignField': '_id',
                'as': 'userdepartmentuid'
            }
        },
        {
            '$unwind': {
                'path': '$userdepartmentuid',
                'preserveNullAndEmptyArrays': true
            }
        },
        {
            '$lookup': {
                'from': 'departments',
                'localField': 'chargecodes.ordertodepartmentuid',
                'foreignField': '_id',
                'as': 'ordertodepartmentuid'
            }
        },
        {
            '$unwind': {
                'path': '$ordertodepartmentuid',
                'preserveNullAndEmptyArrays': true
            }
        },
        {
            '$addFields': {
                'PWDUID': {
                    '$arrayElemAt': [{
                        '$filter': {
                            'input': '$idtypeuid',
                            'as': 'pv',
                            'cond': { '$eq': ['$$pv.valuecode', 'IDTYPE6'] }
                        }
                    }, 0]
                },
                'dc': {
                    '$arrayElemAt': [{
                        '$filter': {
                            'input': '$dc',
                            'as': 'pv',
                            'cond': { '$eq': ['$$pv.statusflag', 'A'] }
                        }
                    }, -1]
                },
                'nb': {
                    '$arrayElemAt': [{
                        '$filter': {
                            'input': '$nb',
                            'as': 'pv',
                            'cond': { '$eq': ['$$pv.statusflag', 'A'] }
                        }
                    }, -1]
                }
            }
        },
        {
            '$project': {
                'PWDUID.addlnidentifiers': 1,
                'dc': 1,
                'nb': 1,
                'totaldeposit.amount': 1,
                'totaldeposit.balance': 1,
                'refunddeposit.amount': 1,
                'refunddeposit.balance': 1,
                'patient': 1,
                'pv': 1,
                'titleuid': 1,
                'visitentype': 1,
                'entype': 1,
                'adddetail.addlnidentifiers': 1,
                'bill.balance': 1,
                'useruidnew': 1,
                'primarydiagnosis': 1,
                'userdepartmentuid': 1,
                'ordertodepartmentuid': 1,
                'patientorderuid': 1,
                'ordersets': 1,
                'careprovider': 1,
                'orderitems': 1,
                'billinggrouptypeuid': 1,
                'billingsubgroupdetails': 1,
                'billinggroupdetails': 1,
                'chargecodes': 1
            }
        }
    ];
}
console.log(patientResults);

module.exports = patientResults;