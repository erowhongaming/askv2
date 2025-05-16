const { ObjectId } = require('mongodb');

const vitalsignspipeline = () => {    // "bedoccupancy.enddate": { '$exists': false },
    return [

        {
            '$match': {
                'bedoccupancy': {
                    '$elemMatch': {
                        'warduid': new ObjectId('5f94507b79b68ea9ffb3f74f'),
                        'enddate': null
                    }
                },
                'enddate': null,
                'visitid': { '$exists': true },
                'statusflag': 'A'
            }
        },
        { '$unwind': '$bedoccupancy' },
        {
            '$match': {
                'bedoccupancy.warduid': new ObjectId('5f94507b79b68ea9ffb3f74f'),
                'bedoccupancy.enddate': null
            }
        },
        {
            '$lookup': {
                'from': 'observations',
                'localField': '_id',
                'foreignField': 'patientvisituid',
                'as': 'obsinfo'
            }
        },
        {
            '$unwind': {
                'path': '$obsinfo',
                'preserveNullAndEmptyArrays': true
            }
        },
        { '$sort': { 'obsinfo.observationdate': -1 } },
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
            '$group': {
                '_id': {
                    'fn': '$patient.firstname',
                    'ln': '$patient.lastname'
                },
                'latestEntryDoc': { '$first': '$$ROOT' }
            }
        },
        { '$replaceRoot': { 'newRoot': '$latestEntryDoc' } },
        {
            '$lookup': {
                'from': 'beds',
                'localField': 'bedoccupancy.beduid',
                'foreignField': '_id',
                'as': 'bed'
            }
        },
        {
            '$unwind': {
                'path': '$bed',
                'preserveNullAndEmptyArrays': true
            }
        },
        {
            '$lookup': {
                'from': 'wards',
                'localField': 'bedoccupancy.warduid',
                'foreignField': '_id',
                'as': 'ward'
            }
        },
        {
            '$unwind': {
                'path': '$ward',
                'preserveNullAndEmptyArrays': true
            }
        },
        {
            '$match': {
                'ward.code': 'WRD011'
            }
        },
        {
            '$addFields': {
                'keyvaluepair': {
                    '$arrayToObject': {
                        '$zip': {
                            'inputs': [
                                '$obsinfo.observationvalues.name',
                                '$obsinfo.observationvalues.resultvalue'
                            ]
                        }
                    }
                }
            }
        },
        { '$sort': { 'obsinfo.observationdate': -1 } },
        {
            '$project': {
                'id': 1,
                'firstname': '$patient.firstname',
                'lastname': '$patient.lastname',
                'bedcode': '$bed.name',
                'wardcode': '$ward.code',
                'wardname': '$ward.name',
                'keyvaluepair': 1,
                'bedenddate': '$bedoccupancy.enddate',
                'visitenddate': '$enddate',
                'visitid': 1,
                'enddate': 1,
                'statusflag': 1,
                'mrn': '$patient.mrn',
                'latestDate': {
                    '$dateToString': {
                        'format': '%Y-%m-%d %H:%M:%S',
                        'date': '$obsinfo.observationdate',
                        'timezone': 'Asia/Manila'
                    }
                }
            }
        },
        { '$sort': { 'obsinfo.observationdate': -1 } },
    ];
};

module.exports = vitalsignspipeline;
