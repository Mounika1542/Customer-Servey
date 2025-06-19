const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

// Handle form submissions
app.post('/submit', (req, res) => {
    const responses = req.body;

    const filePath = path.join(__dirname, 'survey_data.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        let allResponses = [];
        if (!err && data) {
            try {
                allResponses = JSON.parse(data);
            } catch (e) {
                console.error('Corrupted JSON, resetting.');
            }
        }

        allResponses.push({
            timestamp: new Date().toISOString(),
            responses
        });

        fs.writeFile(filePath, JSON.stringify(allResponses, null, 2), (err) => {
            if (err) {
                return res.status(500).send('<h1>Error saving data</h1>');
            }

            res.send(`
                <div style="text-align:center;padding:40px;font-family:sans-serif;">
                    <h1>Thank You!</h1>
                    <p>Your feedback has been submitted successfully.</p>
                </div>
            `);
        });
    });
});

// Fallback route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
