const { Collection } = require('../models/collections');


const getRefunds = require('../pipelines/getPatientBillRefunds');
const getResults = require('../pipelines/getPatientBillResults');
const getDeposits = require('../pipelines/getPatientBillDeposits');

// Function to format money amount (mocking PHP's money function)
// function money(amount) {
//   // Check if amount is not a number or is NaN
//   if (typeof amount !== 'number' || isNaN(amount)) {
//       // Handle the case where amount is not a valid number
    
//       return '0.00'; // or return whatever default value makes sense in your context
//   }

//   // Convert amount to a fixed 2 decimal places string
//   return parseFloat(amount);//.toFixed(2);
// }

const patientBill= {
    getRefunds: async (patientvisituid) => {
        try {
            await Collection.initializeDb(); // Ensure the database is initialized
            const collection = await Collection.getCollection('depositrefundapprovals');
           
            const pipeline = getRefunds(patientvisituid); // Assuming the pipeline function doesn't need parameters
           // console.log('Pipeline:', pipeline); // Log the pipeline
            const result = await collection.aggregate(pipeline).toArray();
          //  console.log('Aggregation Result:', result); // Log the result
            return result; // Return the result
          } catch (error) {
            console.error('Error:', error); // Log any errors
            throw error; // Throw the error for handling elsewhere if needed
          }
    },
    getResults: async (patientvisituid) => {
        try {
          
            await Collection.initializeDb(); // Ensure the database is initialized
            const collection = await Collection.getCollection('patientchargecodes');
           
            const pipeline = getResults(patientvisituid); // Assuming the pipeline function doesn't need parameters
            //console.log('Pipeline:', pipeline); // Log the pipeline
            const result = await collection.aggregate(pipeline).toArray();
            //console.log('Aggregation Result:', result); // Log the result
            return result; // Return the result
          } catch (error) {
            console.error('Error:', error); // Log any errors
            throw error; // Throw the error for handling elsewhere if needed
          }
    },
    getDeposits : async (patientvisituid) => {
        try {
            await Collection.initializeDb(); // Ensure the database is initialized
            const collection = await Collection.getCollection('deposits');
           
            const pipeline = getDeposits(patientvisituid); // Assuming the pipeline function doesn't need parameters
           // console.log('Pipeline:', pipeline); // Log the pipeline
            const result = await collection.aggregate(pipeline).toArray();
           //console.log('Aggregation Result:', result); // Log the result
            return result; // Return the result
          } catch (error) {
            console.error('Error:', error); // Log any errors
            throw error; // Throw the error for handling elsewhere if needed
          }
  },
  getCharges : async (results)=>{
    
    try {
        // Initialize arrays to store categorized results
        let arr_returns = {};
        let arr_charges = {};
        let arr_profFee = {};
        let total_returns = 0;
        let total_charges = 0;
        let total_profFee = 0;
        
        // Iterate over results and categorize them
        results.forEach(r => {

        r.netamount += 0;
            if (r.billingsubgroupname === 'PROFESSIONAL FEES') {
                if (!arr_profFee[r.chargedate]) arr_profFee[r.chargedate] =  { items: [], subtotal: 0 };

                r.unitprice = parseFloat(r.unitprice);
                r.netamount = parseFloat(r.netamount);

                arr_profFee[r.chargedate].items.push(r);
                arr_profFee[r.chargedate].subtotal += parseFloat(r.netamount);
                total_profFee += parseFloat(r.netamount);
                return; // Continue to next iteration
            }

            if (r.billinggroupname === 'EMERGENCY ROOM') {
                r.entype = 'Emergency';
            }

            if (r.netamount < 0) {
              
                if (!arr_returns[r.chargedate]) arr_returns[r.chargedate] =  { items: [], subtotal: 0 };

                r.unitprice = parseFloat(r.unitprice);
                r.netamount = parseFloat(r.netamount);
              
                arr_returns[r.chargedate].items.push(r);
                arr_returns[r.chargedate].subtotal += parseFloat(r.netamount);
                total_returns += parseFloat(r.netamount);
            } else if (r.netamount > 0) {
                const entype = r.entype || r.visitentype;
                if (!arr_charges[entype]) arr_charges[entype] = {};
                if (!arr_charges[entype][r.chargedate]) arr_charges[entype][r.chargedate] = { items: [], subtotal: 0 };

         
                r.unitprice = parseFloat(r.unitprice);
                r.netamount = parseFloat(r.netamount);
              
                arr_charges[entype][r.chargedate].items.push(r);
                arr_charges[entype][r.chargedate].subtotal += parseFloat(r.netamount);
                total_charges += parseFloat(r.netamount);
            }
        });

       // console.log(arr_returns);
        // Output or further process categorized results (for example, return them or store them)
        return {
            'profFee':arr_profFee,
            'returns':arr_returns,
            'charges':arr_charges,
            'total_returns':total_returns,
            'total_charges':total_charges,
            'total_profFee':total_profFee
        };
    } catch (error) {
        console.error('Error:', error); // Log any errors
        throw error; // Throw the error for handling elsewhere if needed
    }
  }
};


//Test
//patientBill.getResults('6677c630166b7147a72f03a4');

module.exports = patientBill;