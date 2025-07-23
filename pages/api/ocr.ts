import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 3001;

app.use(bodyParser.json());

// Endpoint to receive OCR data from Python script
app.post('/api/ocr', (req, res) => {
    const ocrData = req.body;
    console.log('Received OCR Data:', ocrData);
    
    // Process OCR data as needed
    // ...

    res.status(200).json({ message: 'OCR data received successfully.' });
});

// Serve the frontend or provide additional API endpoints here

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
