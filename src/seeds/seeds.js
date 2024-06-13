
require('../config/env-load'); // Ensure environment variables are loaded
const mysql = require('mysql2');

// Database connection configuration
const config = {
    host: process.env.MYSQL_PROD_HOST,
    user: process.env.MYSQL_PROD_USERNAME,
    password: process.env.MYSQL_PROD_PASSWORD,
    database: process.env.ASK_DB,
    port: process.env.MYSQL_PROD_PORT
};

// Seed functions
const seedFunctions = [
    /**
     * Asynchronous function to seed the mobile_otp_log table in the database.
     * Creates the table if it doesn't exist, inserts sample data if the table is empty,
     * and logs the seeding status.
     * 
     * @param {Object} connection - The MySQL connection object.
     * @returns {Promise<void>} A Promise that resolves once the seeding process is completed.
     * @throws {Error} If an error occurs during the seeding process.
     */
    async function seedMobileOTPLog(connection) {
        console.log("Seeding mobile_otp_log...");
        try {
            await connection.execute(`
                CREATE TABLE IF NOT EXISTS mobile_otp_log (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    mobile_number VARCHAR(15) NOT NULL,
                    otp VARCHAR(6) NOT NULL,
                    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    expires_at TIMESTAMP,
                    status ENUM('pending', 'verified', 'expired') DEFAULT 'pending',
                    INDEX (mobile_number),
                    INDEX (generated_at)
                )
            `);

            // Insert sample data into mobile_otp_log if it's empty
            const [rows] = await connection.execute("SELECT COUNT(*) AS count FROM mobile_otp_log");
            if (rows[0].count === 0) {
                await connection.execute(`
                    INSERT INTO mobile_otp_log (mobile_number, otp, expires_at, status)
                    VALUES 
                        ('09999999999', '123456', DATE_ADD(NOW(), INTERVAL 5 MINUTE), 'expired');
                      
                `);
                console.log("Mobile OTP log seeded successfully!");
            } else {
                console.log("Mobile OTP log already seeded, skipping insertion.");
            }
        } catch (error) {
            console.error("Error seeding mobile_otp_log:", error);
        }
    },
    /**
     * Asynchronous function to seed the tracking_module_logs table in the database.
     * Creates the table if it doesn't exist, inserts sample data if the table is empty,
     * and logs the seeding status.
     * 
     * @param {Object} connection - The MySQL connection object.
     * @returns {Promise<void>} A Promise that resolves once the seeding process is completed.
     * @throws {Error} If an error occurs during the seeding process.
     */
    async function seedTrackingModuleLogs(connection) {
        console.log("Seeding tracking_module_logs...");
        try {
            await connection.execute(`
                CREATE TABLE IF NOT EXISTS tracking_module_logs (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    module_name VARCHAR(255) NOT NULL,
                    click_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    INDEX (module_name),
                    INDEX (click_timestamp)
                )
            `);

            // Insert sample data into tracking_module_logs if it's empty
            const [rows] = await connection.execute("SELECT COUNT(*) AS count FROM tracking_module_logs");
            if (rows[0].count === 0) {
                await connection.execute(`
                    INSERT INTO tracking_module_logs (module_name)
                    VALUES 
                        ('doctor's directory),
                        ('running bill'),
                       
                `);
                console.log("Tracking module logs seeded successfully!");
            } else {
                console.log("Tracking module logs already seeded, skipping insertion.");
            }
        } catch (error) {
            console.error("Error seeding tracking_module_logs:", error);
        }
    }
];
/**
 * Function to seed the database with predefined data using the provided seed functions.
 * 
 * @returns {Promise<void>} A Promise that resolves once the database seeding is completed successfully.
 * @throws {Error} If there is an error during the database seeding process.
 */
async function seedDatabase() {
    try {
        const connection = await mysql.createConnection(config);

        for (const seedFunction of seedFunctions) {
            await seedFunction(connection);
        }

        console.log("Database seeding completed successfully!");

        // Close the database connection
        await connection.end();
    } catch (error) {
        console.error("Error seeding database:", error);
    }
}

// Execute the seeding function
seedDatabase();