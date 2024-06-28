


const { ObjectId } = require('mongodb');

const inpatients = () => {
    return [
        
        {
        '$match' : {
            'entypeuid' : new ObjectId("5ecc110e3e2d6d75d98a39d4")
        }},
        {
            '$unwind' : {'path' : '$bedoccupancy', 'preserveNullAndEmptyArrays' : true},
        },
        {
            '$lookup' : {
                'from' : 'payors',
                'localField' : 'visitpayors.payoruid',
                'foreignField' : '_id',
                'as' : 'payor'
            },
        },
        {
            '$lookup' : {
                'from' : 'patients',
                'localField' : 'patientuid',
                'foreignField' : '_id',
                'as' : 'patient'
            },
        },
        {
            '$unwind' : {'path' : '$patient', 'preserveNullAndEmptyArrays' : true},
        },
        {
            '$lookup' : {
                'from' : 'wards',
                'localField' : 'bedoccupancy.warduid',
                'foreignField' : '_id',
                'as' : 'ward'
            },
        },
        {
            '$unwind' : {'path' : '$ward', 'preserveNullAndEmptyArrays' : true},
        },
        {
            '$lookup' : {
                'from' : 'beds',
                'localField' : 'bedoccupancy.beduid',
                'foreignField' : '_id',
                'as' : 'bed'
            },
        },
        {
            '$unwind' : {'path' : '$bed', 'preserveNullAndEmptyArrays' : true},
        },
        {
            '$lookup' : {
                'from' : 'referencevalues',
                'localField' : 'entypeuid',
                'foreignField' : '_id',
                'as' : 'entype'
            },
        },
        {
            '$unwind' : {'path' : '$entype', 'preserveNullAndEmptyArrays' : true},
        },
        {
            '$lookup' : {
                'from' : 'referencevalues',
                'localField' : 'patient.genderuid',
                'foreignField' : '_id',
                'as' : 'gender'
            },
        },
        {
            '$unwind' : {'path' : '$gender', 'preserveNullAndEmptyArrays' : true},
        },
        {
            '$lookup' : {
                'from' : 'referencevalues',
                'localField' : 'visitstatusuid',
                'foreignField' : '_id',
                'as' : 'visitstatus'
            },
        },
        {
            '$unwind' : {'path' : '$visitstatus', 'preserveNullAndEmptyArrays' : true},
        },
        {
            '$project' : {
                '_id' : 1,
                'patient_id' : '$patient._id', 
                'mrn' : '$patient.mrn',
                'visitid' : 1,
                'firstname' : '$patient.firstname',
            
                'lastname' : '$patient.lastname',
                'ward' : '$ward.name',
                'bed' : '$bed.name',
                'gender' : '$gender.valuedescription',
                'status' : '$visitstatus.valuedescription',
            },
        },
        {'$sort' : {'ward' : 1, 'lastname' : 1}}
                     
    ];
}



module.exports = inpatients;