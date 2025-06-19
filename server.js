const express = require('express'); //we install express using nodejs and express and install node express body parser()
const bodyParser = require('body-parser'); //here we have a bodyparser a module and require use to  all methods in files
const fs = require('fs'); //filepath
const path = require('path'); //path

const app = express(); //express call in the variable is used 

// Serve frontend files
app.use(express.static(path.join(__dirname, 'html')));  //server file in html which can be run all 
app.use(bodyParser.urlencoded({ extended: true }));
//urlencode is middleware to server
//Handle routes (app.get(...), app.post(...))

//Add middleware (app.use(...))

//Start the server (app.listen(...))

app.post('/submit', (req, res) => { // when last submit pwe use reponse sheet like fec=tch to backend and use  the connect the localserver 
  const data = req.body;
  const filePath = path.join(__dirname, 'responses.json');
  let all = [];

  if (fs.existsSync(filePath)) {
    all = JSON.parse(fs.readFileSync(filePath));
  }

  all.push(data);
  fs.writeFileSync(filePath, JSON.stringify(all, null, 2));

  res.send(`
    <h2> Thank you for your feedback!</h2>
    <a href="/">Back to Home</a>
  `);////  Get form data from the request body
//  Build path to 'responses.json' in the current directory
// Create an empty array to hold all responses
//  Check if the responses file already exists
//  If it exists, read and parse the JSON data into the array
//  Add the new response to the array
// Save the updated array back to the file in JSON format
//  Send a thank-you message back to the browser

});

app.listen(3000, () => console.log(" Server running at http://localhost:3000"));
