
const helpers = {
    /**
     * An object containing a method to generate a random OTP (One Time Password) between 100000 and 999999.
     */
    generateOTP: async() => {
        return Math.floor(100000 + Math.random() * 900000);
    }
};


module.exports = helpers