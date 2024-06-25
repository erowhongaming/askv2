/**
 * Represents a module for managing doctor data and searching functionalities.
 * Includes methods for fetching doctor details, searching by various criteria, grouping doctors by specialization,
 * and searching within grouped specializations.
 */
const FlexSearch = require('flexsearch');
const db = require('../config/mysql-db');

// Create a new FlexSearch index
const index = new FlexSearch.Index({
    // encode: "icase", // Case-insensitive encoding
    tokenize: "full", // Full tokenization
    async: false // Synchronous operation
});

// Store the actual doctor data separately
const doctorData = {};
let groupedSpecializations =[];

/**
 * Doctor object containing methods to retrieve, search, and group doctor details.
 * Methods include fetching doctor details from the database, searching for doctors based on various criteria,
 * grouping doctors by specialization, and searching for sub-specializations within a specialization.
 */
const Doctor = {
    
     /**
     * Retrieves details of doctors from the database including their personal information, schedule, and affiliations.
     * 
     * @returns {Promise<Array>} A promise that resolves with an array of doctor details objects.
     * @throws {Error} If there is an error executing the database query.
     */
    getDetails: () => {
        const query = `
            SELECT phySched.person_id,
            CONCAT(phySched.firstname, ' ', LEFT(phySched.middlename, 1), '. ', phySched.lastname) AS fullname,
            phySched.firstname,
            phySched.lastname,
            CASE 
                WHEN phySched.spec = 'OBSTETRICS & GYNECOLOGY'
                THEN 'OBGYNE'
                WHEN phySched.spec = 'REHABILITATION MEDICINE'
                THEN 'REHAB'
                ELSE phySched.spec
            END AS specialization,
            phySched.sub_spec as subSpecialization,
            phySched.HMOS as affiliated_payors,
            phySched.secretary_name as secretary,
            phySched.secretary_contact,
            CONCAT( phySched.room,' - ',phySched.bldg ) as room,
            phySched.is_in,
            people.gender,
            HMOS as hmo,
            HMOS_ids as hmo_id,
            TRIM(TRAILING ', ' FROM 
                CONCAT(
                    CASE 
                        WHEN phySched.MON_start IS NOT NULL AND phySched.MON_end IS NOT NULL THEN 'Monday, '
                        ELSE ''
                    END,
                    CASE 
                        WHEN phySched.TUE_start IS NOT NULL AND phySched.TUE_end IS NOT NULL THEN 'Tuesday, '
                        ELSE ''
                    END,
                    CASE 
                        WHEN phySched.WED_start IS NOT NULL AND phySched.WED_end IS NOT NULL THEN 'Wednesday, '
                        ELSE ''
                    END,
                    CASE 
                        WHEN phySched.THUR_start IS NOT NULL AND phySched.THUR_end IS NOT NULL THEN 'Thursday, '
                        ELSE ''
                    END,
                    CASE  
                        WHEN phySched.FRI_start IS NOT NULL AND phySched.FRI_end IS NOT NULL THEN 'Friday, '
                        ELSE ''
                    END,
                    CASE  
                        WHEN phySched.SAT_start IS NOT NULL AND phySched.SAT_end IS NOT NULL THEN 'Saturday, '
                        ELSE ''
                    END,
                    CASE  
                        WHEN phySched.SUN_start IS NOT NULL AND phySched.SUN_end IS NOT NULL THEN 'Sunday, '
                        ELSE ''
                    END
                )
            ) AS schedule
            FROM proc_doctors_schedule_final_2 as phySched
            LEFT JOIN people ON people.person_id = phySched.person_id;
        `;
        return new Promise((resolve, reject) => {
            db.query(query, (err, results) => {
                if (err) {
                    console.error("Error executing query:", err);
                    return reject(err);
                } else {
                    // Index doctor details in FlexSearch
                    //console.log("Fetched data:", results); // Log fetched data
                    console.log('Initial Data Fetched successfully');
                    results.forEach(doctor => {
                        const searchableFields = [
                            doctor.firstname?.toLowerCase() || '',
                            doctor.lastname?.toLowerCase() || '',
                            doctor.specialization?.toLowerCase() || '',
                            doctor.secretary?.toLowerCase() || '',
                            doctor.subSpecialization?.toLowerCase() || '',
                            doctor.room?.toLowerCase() || '',
                            doctor.hmo?.toLowerCase() || '',
                            doctor.hmo_id?.toLowerCase() || ''
                        ];

                        //console.log(searchableFields);
                        // Concatenate all searchable fields into a single string
                        const dataToIndex = searchableFields.join(' ');

                        index.add(doctor.person_id, dataToIndex); // Index the combined fields
                        doctorData[doctor.person_id] = doctor; // Store the actual doctor data
                        //console.log("Added to index:", doctor.person_id, dataToIndex); //
                    });

                   
                    return resolve(results);
                }
            });
        });
    },

    /**
     * Search for doctors based on the given search term.
     * 
     * @param {string} searchTerm - The search term to look for in doctor data.
     * @returns {Array} An array of doctors that match the search term.
     */
    search: async (searchTerm) => {
        // Split the search term by commas and trim whitespace
        const searchTerms = searchTerm.split(',').map(term => term.trim());
        const matchingIdsSet = new Set();

        searchTerms.forEach(term => {
            const wildcardSearchTerm = `${term}*`;
            const matchingIds = index.search(wildcardSearchTerm);
            matchingIds.forEach(id => matchingIdsSet.add(id));
        });

        // Convert the set back to an array
        const matchingIds = Array.from(matchingIdsSet);

        // Fetch the details of the matching doctors from the stored data
        const matchingDoctors = matchingIds.map(id => doctorData[id]);
        return matchingDoctors;
    },

    /**
     * Search for doctors by specialization.
     * 
     * @param {string} specialization - The specialization to search for.
     * @returns {Array} - An array of doctors matching the provided specialization.
     */ 
    searchBySpecialization: async (specialization) => {
        const matchingDoctors = Object.values(doctorData).filter(doctor => 
            doctor.specialization.toLowerCase() === specialization.toLowerCase()
        );
        return matchingDoctors;
    },

    /**
     * Search for doctors based on specialization and sub-specialization, with an optional search value.
     * 
     * @param {string} specialization - The main specialization to search for.
     * @param {string} subSpecialization - The sub-specialization to search for.
     * @param {string} searchVal - The optional search value to filter the results.
     * @returns {Array} An array of matching doctors based on the provided criteria.
     */
    searchBySpecializationWithSubspecialization: async (specialization, subSpecialization , searchVal) => {
        if(searchVal != ''){
            const resultDataFromSearch = await Doctor.search(searchVal);
            const matchingDoctors = resultDataFromSearch.filter(doctor => 
                doctor.specialization.toLowerCase() === specialization.toLowerCase() &&
                (subSpecialization === '' || doctor.subSpecialization.toLowerCase() === subSpecialization.toLowerCase())
            );
            return matchingDoctors;
        }else{
            const matchingDoctors = Object.values(doctorData).filter(doctor => 
                doctor.specialization.toLowerCase() === specialization.toLowerCase() &&
                (subSpecialization === '' || doctor.subSpecialization.toLowerCase() === subSpecialization.toLowerCase())
            );
            return matchingDoctors;
        }
        
    },

    /**
     * Method: getDoctorsGroupedBySpecialization
     * Description: Retrieves doctors grouped by specialization from the database.
     * Returns a Promise that resolves to an array of objects, each containing a specialization and its sub-specializations.
     * If an error occurs during the database query, the Promise is rejected with the error.
     */
    getDoctorsGroupedBySpecialization: () => {
        const query = `
            SELECT 
                spec as specialization,               
                GROUP_CONCAT(DISTINCT sub_spec) as subSpecializations
            FROM 
                proc_doctors_schedule_final_2
            GROUP BY 
                spec;
        `;
        
        return new Promise((resolve, reject) => {
            db.query(query, (err, results) => {
                if (err) {
                    console.error("Error executing query:", err);
                    return reject(err);
                } else {
                    console.log('Doctors grouped by specialization fetched successfully');
                    groupedSpecializations = results.map(row => ({
                        specialization: row.specialization,
                        subSpecializations: row.subSpecializations ? row.subSpecializations.split(',') : []
                    }));
                   
                    return resolve(groupedSpecializations);
                }
            });
        });
    },

    /**
     * Search for a given specialization in the groupedSpecializations array.
     * 
     * @param {string} specialization - The specialization to search for.
     * @returns {Array} - An array of subSpecializations if the specialization is found, otherwise an empty array.
     */
    searchGroupedSpecializations: (specialization) => {
        const foundSpecialization = groupedSpecializations.find(spec => spec.specialization === specialization);
        if (foundSpecialization) {
            return foundSpecialization.subSpecializations;
        } else {
            return []; // Return an empty array if no match found
        }
    },

    getHmos: () => {
        const query = `SELECT id,name,has_photo
        FROM hmos where is_active = 1`;

        return new Promise((resolve, reject) => {
            
            db.query(query, (err, results) => {
                if (err) {
                    console.error("Error executing query:", err);
                    return reject(err);
                } else {
                    console.log('HMOs fetched successfully');
                    hmos = results.map(row => ({
                        id: row.id,
                        name: row.name
                    }));
                   
                    return resolve(hmos);
                }
            });
        });
    }

    
};

module.exports = Doctor;
