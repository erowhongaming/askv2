
const { ObjectId } = require('mongodb');


const patientResults = (patientvisituid) => {
    return [
                {
                    '$match': {
                        'statusflag': 'A',
                        'patientvisituid': new ObjectId(patientvisituid)
                    }
                },
                {'$lookup': {'from': 'patients', 'localField': 'patientuid', 'foreignField': '_id', 'as': 'patient'}},
                {'$unwind': {'path': '$patient', 'preserveNullAndEmptyArrays': true}},
                {'$lookup': {'from': 'patientvisits', 'localField': 'patientvisituid', 'foreignField': '_id', 'as': 'pv'}},
                {'$unwind': {'path': '$pv', 'preserveNullAndEmptyArrays': true}},
                {'$lookup': {'from': 'referencevalues', 'localField': 'pv.entypeuid', 'foreignField': '_id', 'as': 'visitentype'}},
                {'$unwind': {'path': '$visitentype', 'preserveNullAndEmptyArrays': true}},
                {
                    '$unwind': {
                        'path': '$chargecodes',
                        'preserveNullAndEmptyArrays': true
                    }
                },
            
                {'$match': {
                    'chargecodes.isbilled': {'$ne': false},
                    'chargecodes.statusflag': 'A'
                }},
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
                {'$lookup': {'from': 'patientorders', 'localField': 'chargecodes.patientorderuid', 'foreignField': '_id', 'as': 'patientorderuid'}},
                {'$unwind': {'path': '$patientorderuid', 'preserveNullAndEmptyArrays': true}},
            
                {'$lookup': {'from': 'referencevalues', 'localField': 'patientorderuid.entypeuid', 'foreignField': '_id', 'as': 'entype'}},
                {'$unwind': {'path': '$entype', 'preserveNullAndEmptyArrays': true}},
            
            {
                    '$addFields': {
                        'pv.admissionrequestuid': {
                            '$ifNull': ['$pv.admissionrequestuid', '']
                        }
                    }
                },
            
                {'$lookup': {'from': 'deathrecords', 'localField': 'patientvisituid', 'foreignField': 'patientvisituid', 'as': 'dc'}},
                {'$lookup': {'from': 'newborndetails', 'localField': 'pv.admissionrequestuid', 'foreignField': 'admissionrequestuid', 'as': 'nb'}},
        
                {'$lookup': {'from': 'departments', 'localField': 'chargecodes.ordertodepartmentuid', 'foreignField': '_id', 'as': 'ordertodepartmentuid'}},
                {'$unwind': {'path': '$ordertodepartmentuid', 'preserveNullAndEmptyArrays': true}},
            
            {
                '$addFields': {
                    'dc': {
                        '$arrayElemAt': [
                            {
                                '$filter': {
                                    'input': '$dc',
                                    'as': 'pv',
                                    'cond': {'$eq': ['$$pv.statusflag', 'A']}
                                }
                            }, -1
                        ]
                    },
                    'nb': {
                        '$arrayElemAt': [
                            {
                                '$filter': {
                                    'input': '$nb',
                                    'as': 'pv',
                                    'cond': {'$eq': ['$$pv.statusflag', 'A']}
                                }
                            }, -1
                        ]
                    },
                    'bedoccupancy': {
                        '$arrayElemAt': ['$pv.bedoccupancy', -1]
                    }
                }
            },
                {'$lookup': {'from': 'wards', 'localField': 'bedoccupancy.warduid', 'foreignField': '_id', 'as': 'warduid'}},
                {'$unwind': {'path': '$warduid', 'preserveNullAndEmptyArrays': true}},
                {'$lookup': {'from': 'beds', 'localField': 'bedoccupancy.beduid', 'foreignField': '_id', 'as': 'beduid'}},
                {'$unwind': {'path': '$beduid', 'preserveNullAndEmptyArrays': true}},
            {
            '$project': {
                "billinggroupname": {
                    '$cond': {
                        'if': {'$eq': ['$chargecodes.chargecodetype', 'PATIENTPACKAGE']},
                        'then': 'PACKAGE',
                        'else': '$ordertodepartmentuid.name'
                    }
                },
                "billinggroupcode_": {
                    '$cond': {
                        'if': {'$eq': ['$chargecodes.chargecodetype', 'PATIENTPACKAGE']},
                        'then': '$ordersets.code',
                        'else': '$ordertodepartmentuid.code'
                    }
                },
                'billinggroupname_': '$billinggroupdetails.name',
                'billingsubgroupname': '$billingsubgroupdetails.name',
                'itemname': {
                    '$cond': {
                        'if': {'$eq': ['$chargecodes.chargecodetype', 'PATIENTPACKAGE']},
                        'then': '$ordersets.name',
                        'else': '$orderitems.name'
                    }
                },
                'itemcode': {
                    '$cond': {
                        'if': {'$eq': ['$chargecodes.chargecodetype', 'PATIENTPACKAGE']},
                        'then': '$ordersets.code',
                        'else': '$orderitems.code'
                    }
                },
                'netamount_BK': {
                    '$add': ['$chargecodes.netamount', '$chargecodes.payordiscount', '$chargecodes.specialdiscount']
                },
                'netamount': {
                    '$multiply': [{'$abs': '$chargecodes.unitprice'}, '$chargecodes.quantity']
                },
                'netamount_hosp_charges': {
                    '$cond': {
                        'if': {'$eq': ['$billinggrouptypeuid.locallanguagedesc', 'HOSPITAL CHARGES']},
                        'then': {'$multiply': [{'$abs': '$chargecodes.unitprice'}, '$chargecodes.quantity']},
                        'else': 0
                    }
                },
                'netamount_prof_fee': {
                    '$cond': {
                        'if': {'$eq': ['$billinggrouptypeuid.locallanguagedesc', 'PROFESSIONAL FEE']},
                        'then': {'$multiply': [{'$abs': '$chargecodes.unitprice'}, '$chargecodes.quantity']},
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
                'payordisc': '$chargecodes.payordiscount',
                'unitprice': '$chargecodes.unitprice',
                'specialdiscount': '$chargecodes.specialdiscount',
                'taxamount': '$chargecodes.taxamount',
                'Type': '$billinggrouptypeuid.locallanguagedesc',
                'billtypecode': '$billinggrouptypeuid.valuecode',
                'quantity': '$chargecodes.quantity',
                'chargedate': {
                    '$dateToString': {
                        'format': "%m/%d/%Y",
                        'timezone': "+08:00",
                        'date': '$chargecodes.chargedate'
                    }
                },
                'modifiedat': '$modifiedat',
                'userdepartment': '$userdepartmentuid.name',
                'billedby': '$useruidnew.printname',
                'visitpyors': '$visitpyors.name',
                'visitpyorscode': '$visitpyors.code',
                'billinggroupcode': '$billinggroupdetails.code',
                'billingsubgroupcode': '$billingsubgroupdetails.code',
                'careprovidername': '$careprovider.printname',
                'careprovidercode': '$careprovider.code',
                'ordernumber': '$patientorderuid.ordernumber',
                'mrn': '$patient.mrn',
                'isanonymous': {
                    '$ifNull': ['$patient.isanonymous', false]
                },
                'private': {
                    '$cond': {
                        'if': {'$eq': ['$visitpyors.code', 'IND']},
                        'then': '$chargecodes.netamount',
                        'else': 0.00
                    }
                },
                'patientname': {
                    '$concat': [
                        {'$ifNull': [{'$concat': ['$patient.lastname', ', ']}, '']},
                        {'$ifNull': [{'$concat': ['$patient.firstname', ', ']}, '']},
                        {'$ifNull': [{'$concat': ['$patient.thirdname', ', ']}, '']},
                        {'$ifNull': ['$patient.middlename', '']}
                    ]
                },
                'visitid': '$pv.visitid',
                'iswelfarepatient': {
                    '$cond': {
                        'if': {'$eq': ['$pv.iswelfarepatient', true]},
                        'then': 'Y',
                        'else': 'N'
                    }
                },
                'startdate': {
                    '$ifNull': [
                        {'$dateToString': {'format': "%m/%d/%Y %H:%M:%S", 'timezone': "+08:00", 'date': '$nb.birthdatetime'}},
                        {'$dateToString': {'format': "%m/%d/%Y %H:%M:%S", 'timezone': "+08:00", 'date': '$pv.createdat'}}
                    ]
                },
                'enddate': {
                    '$dateToString': {
                        'format': "%m/%d/%Y %H:%M:%S",
                        'timezone': "+08:00",
                        'date': '$pv.enddate'
                    }
                },
                'medicaldischargedate': {
                    '$ifNull': ['$dc.deathdatetime', '$pv.medicaldischargedate']
                },
                'dateofbirth': {
                    '$dateToString': {
                        'format': "%m/%d/%Y",
                        'timezone': "+08:00",
                        'date': '$patient.dateofbirth'
                    }
                },
                'ward': {
                    '$ifNull': ['$warduid.name', '']
                },
                'bed': {
                    '$ifNull': ['$beduid.name', '']
                },
                'depositamount': {'$sum': '$totaldeposit.paidamount'},
                'refunddeposit': {'$sum': '$refunddeposit.paidamount'},
                'patientaddress': {
                    'address': '$patient.address.address',
                    'area': '$patient.address.area',
                    'country': '$patient.address.country',
                    'city': '$patient.address.city',
                    'state': '$patient.address.state',
                    'mobilephone': '$patient.contact.mobilephone',
                    'workphone': '$patient.contact.workphone',
                    'zipcode': '$patient.address.zipcode'
                },
                'pwdid': {
                    '$arrayElemAt': [
                        {
                            '$filter': {
                                'input': '$adddetail.addlnidentifiers',
                                'as': 'ov',
                                'cond': {'$eq': ['$$ov.idtypeuid', '$PWDUID._id']}
                            }
                        }, 0
                    ]
                },
                'seniorcitizenid': {
                    '$arrayElemAt': [
                        {
                            '$filter': {
                                'input': '$adddetail.addlnidentifiers',
                                'as': 'ov',
                                'cond': {'$eq': ['$$ov.idtypeuid', '$SENIORCITIZENUID._id']}
                            }
                        }, 0
                    ]
                },
                'tin': {
                    '$arrayElemAt': [
                        {
                            '$filter': {
                                'input': '$adddetail.addlnidentifiers',
                                'as': 'ov',
                                'cond': {'$eq': ['$$ov.idtypeuid', '$TIN._id']}
                            }
                        }, 0
                    ]
                },
                'soloparentid': {
                    '$arrayElemAt': [
                        {
                            '$filter': {
                                'input': '$adddetail.addlnidentifiers',
                                'as': 'ov',
                                'cond': {'$eq': ['$$ov.idtypeuid', '$SOLOPARDUID._id']}
                            }
                        }, 0
                    ]
                },
                'payorname': {
                    '$reduce': {
                        'input': '$payoruid.name',
                        'initialValue': '',
                        'in': {
                            '$cond': {
                                'if': {'$or': [{'$eq': ['$$value', '']}, {'$eq': ['$$this', '']}]},
                                'then': {'$concat': ['$$value', '$$this']},
                                'else': {'$concat': ['$$value', ',', '$$this']}
                            }
                        }
                    }
                },
                'doctor': '$careprovideruid.printname',
                'deathtime': {
                    '$ifNull': [
                        {'$dateToString': {'format': "%m/%d/%Y", 'timezone': "+08:00", 'date': '$dc.deathdatetime'}},
                        {'$dateToString': {'format': "%m/%d/%Y", 'timezone': "+08:00", 'date': '$pv.medicaldischargedate'}}
                    ]
                },
                'HmoCoordinate': {
                    '$arrayElemAt': [
                        {
                            '$filter': {
                                'input': '$pv.visitpayors',
                                'as': 'vi',
                                'cond': {'$ne': [{'$ifNull': ['$$vi.coordinatoruid', 'NOCOR']}, 'NOCOR']}
                            }
                        }, 0
                    ]
                },
                'diagnosistext': {
                    '$reduce': {
                        'input': '$diagnoses.diagnosistext',
                        'initialValue': '',
                        'in': {
                            '$cond': {
                                'if': {'$or': [{'$eq': ['$$value', '']}, {'$eq': ['$$this', '']}]},
                                'then': {'$concat': ['$$value', '$$this']},
                                'else': {'$concat': ['$$value', ',', '$$this']}
                            }
                        }
                    }
                },
                'primarydiagnosis': {
                    '$reduce': {
                        'input': '$primarydiagnosis.name',
                        'initialValue': '',
                        'in': {
                            '$cond': {
                                'if': {'$or': [{'$eq': ['$$value', '']}, {'$eq': ['$$this', '']}]},
                                'then': {'$concat': ['$$value', '$$this']},
                                'else': {'$concat': ['$$value', ',', '$$this']}
                            }
                        }
                    }
                },
                'entype': '$entype.valuedescription',
                'visitentype': '$visitentype.valuedescription',
            }
        }
        ,
                                        
                {'$addFields': {
                
                    'pwdidtype': '$pwdid.iddetail',
                    'senioridtype': '$seniorcitizenid.iddetail',
                    'tinidtype': '$tin.iddetail',
                    'soloparentidtype': '$soloparentid.iddetail',
                    'HmoCoordinate': '$HmoCoordinate.name',
                }},
                {'$sort': {'chargedate': 1, 'billinggroupname': 1}}
            
        ]
    ;
        
}

module.exports = patientResults;