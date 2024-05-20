const db = require('../config/mysql-db');

const Doctor = {
    getDetails: (callback) => {
        const query =
            `SELECT 
            CONCAT(firstname, ' ', LEFT(middlename, 1), '. ', lastname) AS fullname,
            spec as specialization,
            sub_spec as subSpecialization,
            HMOS as affiliated_payors,
            secretary_name as secretary,
            secretary_contact,
            CONCAT(bldg,' ',room,'-',local_num) as room,
            is_in
            FROM proc_doctors_schedule_final_2 
            `;
        db.query(query, (err, results) => {
            if (err) {
                console.error("Error executing query:", err);
                return callback(err, null);
            } else {
              
                return callback(null, results);
            }
        });
    },
};
module.exports = Doctor;
