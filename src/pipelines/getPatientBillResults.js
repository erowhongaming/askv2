
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
            '$addFields': {
                'pv.admissionrequestuid': {
                    '$ifNull': ['$pv.admissionrequestuid', '']
                }
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
                'dc': {
                    '$arrayElemAt': [
                        {
                            '$filter': {
                                'input': '$dc',
                                'as': 'pv',
                                'cond': { '$eq': ['$$pv.statusflag', 'A'] }
                            }
                        },
                        -1
                    ]
                },
                'nb': {
                    '$arrayElemAt': [
                        {
                            '$filter': {
                                'input': '$nb',
                                'as': 'pv',
                                'cond': { '$eq': ['$$pv.statusflag', 'A'] }
                            }
                        },
                        -1
                    ]
                },
                'bedoccupancy': {
                    '$arrayElemAt': ['$pv.bedoccupancy', -1]
                }
            }
        },
        {
            '$lookup': {
                'from': 'wards',
                'localField': 'bedoccupancy.warduid',
                'foreignField': '_id',
                'as': 'warduid'
            }
        },
        {
            '$unwind': {
                'path': '$warduid',
                'preserveNullAndEmptyArrays': true
            }
        },
        {
            '$lookup': {
                'from': 'beds',
                'localField': 'bedoccupancy.beduid',
                'foreignField': '_id',
                'as': 'beduid'
            }
        },
        {
            '$unwind': {
                'path': '$beduid',
                'preserveNullAndEmptyArrays': true
            }
        },
        {
            '$project': {
                'billinggroupname': {
                    '$cond': {
                        'if': { '$eq': ['$chargecodes.chargecodetype', 'PATIENTPACKAGE'] },
                        'then': 'PACKAGE',
                        'else': '$ordertodepartmentuid.name'
                    }
                },
                'billinggroupcode_': {
                    '$cond': {
                        'if': { '$eq': ['$chargecodes.chargecodetype', 'PATIENTPACKAGE'] },
                        'then': '$ordersets.code',
                        'else': '$ordertodepartmentuid.code'
                    }
                },
                'billinggroupname_': '$billinggroupdetails.name',
                'billingsubgroupname': '$billingsubgroupdetails.name',
                'itemname': {
                    '$cond': {
                        'if': { '$eq': ['$chargecodes.chargecodetype', 'PATIENTPACKAGE'] },
                        'then': '$ordersets.name',
                        'else': '$orderitems.name'
                    }
                },
                'itemcode': {
                    '$cond': {
                        'if': { '$eq': ['$chargecodes.chargecodetype', 'PATIENTPACKAGE'] },
                        'then': '$ordersets.code',
                        'else': '$orderitems.code'
                    }
                },
                'netamount_BK': {
                    '$add': ['$chargecodes.netamount', '$chargecodes.payordiscount', '$chargecodes.specialdiscount']
                },
                'netamount': {
                    '$multiply': [{ '$abs': '$chargecodes.unitprice' }, '$chargecodes.quantity']
                },
                'netamount_hosp_charges': {
                    '$cond': {
                        'if': { '$eq': ['$billinggrouptypeuid.locallanguagedesc', 'HOSPITAL CHARGES'] },
                        'then': { '$multiply': [{ '$abs': '$chargecodes.unitprice' }, '$chargecodes.quantity'] },
                        'else': 0
                    }
                },
                'netamount_prof_fee': {
                    '$cond': {
                        'if': { '$eq': ['$billinggrouptypeuid.locallanguagedesc', 'PROFESSIONAL FEE'] },
                        'then': { '$multiply': [{ '$abs': '$chargecodes.unitprice' }, '$chargecodes.quantity'] },
                        'else': 0
                    }
                },
                'Philhealth_PROF': {
                    '$ifNull': ['$philhealth.professionalcharges', 0.00]
                },
                'Philhealth_HOS': {
                    '$ifNull': ['$philhealth.hospitalcharges', 0.00]
                },
                'payordiscount': '$chargecodes.payordiscount',
                'specialdiscount': '$chargecodes.specialdiscount',
                'patientdiscount': '$chargecodes.patientdiscount',
                'patientcopayment': '$chargecodes.patientcopayment',
                'isbilled': '$chargecodes.isbilled',
                'billinggroupuid': '$chargecodes.billinggroupuid',
                'billingsubgroupuid': '$chargecodes.billingsubgroupuid',
                'billtype': '$chargecodes.billtype',
                'careprovideruid': '$chargecodes.careprovideruid',
                'careprovidername': {
                    '$concat': ['$careprovider.firstname', ' ', '$careprovider.lastname']
                },
                'orderdate': '$chargecodes.orderdate',
                'deptname': '$ordertodepartmentuid.name',
                'deptcode': '$ordertodepartmentuid.code',
                'bed': '$beduid.bedcode',
                'ward': '$warduid.name',
                'visitentype': '$visitentype.valuedescription',
                'patientfirstname': '$patient.firstname',
                'patientlastname': '$patient.lastname',
                'patientuid': '$patient._id',
                'patientvisituid': '$pv._id',
                'patientid': '$patient.patientid',
                'visitid': '$pv.visitid',
                'dischargedate': {
                    '$ifNull': ['$dc.dischargedate', '$pv.dischargedate']
                },
                'dateofbirth': '$patient.dateofbirth',
                'entype': '$entype.valuedescription',
                'isbaby': {
                    '$cond': { 
                        'if': { '$ne': ['$nb', null] },
                        'then': true,
                        'else': false
                    }
                }
            }
        }
    ]
    ;
        
}
//console.log(patientResults);

module.exports = patientResults;