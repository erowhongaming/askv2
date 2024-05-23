
const { Doctor, index } = require('./src/models/doctorsModel');

// Call Doctor.getDetails() and handle the promise
Doctor.getDetails()
  .then(results => {
    console.log(results); // This will log the resolved value of the promise
  })
  .catch(error => {
    console.error('Error fetching doctor details:', error); // This will log any errors that occurred during the process
  });

// // Call index.search('Dental') and handle the promise
Doctor.search('Dental')
  .then(results => {
    console.log(results); // This will log the search results
  })
  .catch(error => {
    console.error('Error searching doctors:', error); // This will log any errors that occurred during the process
  });
