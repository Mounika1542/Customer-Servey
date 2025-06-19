const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, 'html')));
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/submit', (req, res) => {
  const data = req.body;
  let all = [];
  const filePath = path.join(__dirname, 'responses.json');

  if (fs.existsSync(filePath)) {
    all = JSON.parse(fs.readFileSync(filePath));
  }

  all.push(data);
  fs.writeFileSync(filePath, JSON.stringify(all, null, 2));
  res.send('<h2>✅ Thank you! Your response is saved.</h2><a href="/">Back to Home</a>');
});

app.listen(3000, () => console.log("✅ Server running at http://localhost:3000"));
