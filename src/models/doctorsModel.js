const FlexSearch = require('flexsearch');
const db = require('../config/mysql-db');

// Create a new FlexSearch index
const index = new FlexSearch.Index({
    // encode: "icase", // Case-insensitive encoding
    tokenize: "full", // Full tokenization
    async: false // Synchronous operation
});

const Doctor = {
    getDetails: () => {
        const query =
            `SELECT person_id,
            CONCAT(firstname, ' ', LEFT(middlename, 1), '. ', lastname) AS fullname,
            firstname,
            lastname,
            spec as specialization,
            sub_spec as subSpecialization,
            HMOS as affiliated_payors,
            secretary_name as secretary,
            secretary_contact,
            CONCAT(bldg,' ',room,'-',local_num) as room,
            is_in
            FROM proc_doctors_schedule_final_2 
            `;
        return new Promise((resolve, reject) => {
            db.query(query, (err, results) => {
                if (err) {
                    console.error("Error executing query:", err);
                    return reject(err);
                } else {
                    // Index doctor details in FlexSearch
                    console.log("Fetched data:", results); // Log fetched data
                    results.forEach(doctor => {
                        const searchableFields = [
                            doctor.firstname.toLowerCase(),
                            doctor.lastname.toLowerCase(),
                            doctor.subSpecialization.toLowerCase(),
                          
                        ];

                        console.log(searchableFields);
                        // Concatenate all searchable fields into a single string
                        const dataToIndex = searchableFields.join(' ');

                        index.add(doctor.person_id, dataToIndex); // Index the combined fields
                        console.log("Added to index:", doctor.person_id, dataToIndex); //
                    });
                    return resolve(results);
                }
            });
        });
    },

    search: async (searchTerm) => {
        // Append wildcard character (*) to search term
        const wildcardSearchTerm = `${searchTerm}*`;
        const matchingIds = index.search(wildcardSearchTerm);
       
        // Fetch details of the matching doctors from the database
        const matchingDoctors = await fetchDoctorsDetails(matchingIds);
        return matchingDoctors;
    },
    fetchDoctorsDetails: async (doctorIds) => {
        if (doctorIds.length === 0) {
            return []; // Return empty array if no IDs are provided
        }

        const query = `
            SELECT person_id,
            CONCAT(firstname, ' ', LEFT(middlename, 1), '. ', lastname) AS fullname,
            spec as specialization,
            sub_spec as subSpecialization,
            HMOS as affiliated_payors,
            secretary_name as secretary,
            secretary_contact,
            CONCAT(bldg,' ',room,'-',local_num) as room,
            is_in
            FROM proc_doctors_schedule_final_2 
            WHERE person_id IN (?)`;

        return new Promise((resolve, reject) => {
            db.query(query, [doctorIds], (err, results) => {
                if (err) {
                    console.error("Error fetching doctor details:", err);
                    return reject(err);
                }
                return resolve(results);
            });
        });
    }

};




module.exports = { Doctor, index };
