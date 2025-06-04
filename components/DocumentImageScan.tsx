import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const DocumentTypeSelector: React.FC = () => {
    const [documentType, setDocumentType] = useState<string>('driving_license');
    const [ocrResults, setOcrResults] = useState<any[]>([]);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const captureImage = async () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
                context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
                const image = canvasRef.current.toDataURL('image/jpeg');
                
                try {
                    // Send the image to your backend for OCR processing
                    const response = await axios.post('/api/ocr', { image, documentType });
                    const data = response.data;
                    setOcrResults(data);
                    
                    // Log the OCR results to the console
                    console.log('OCR Results:', data);
                } catch (error) {
                    console.error('Error processing image:', error);
                }
            }
        }
    };    useEffect(() => {
        // Set up video stream
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                }
            })
            .catch(error => console.error('Error accessing webcam: ', error));
        
        // Capture images every 50 ms for 5 seconds
        const interval = setInterval(captureImage, 50);
        setTimeout(() => clearInterval(interval), 5000);

        return () => clearInterval(interval);
    }, [documentType, captureImage]);

    return (
        <div>
            <select onChange={(e) => setDocumentType(e.target.value)} value={documentType}>
                <option value="driving_license">Driving License</option>
                <option value="voter_id">Voter ID</option>
                <option value="passport">Passport</option>
                <option value="adhar_card">Aadhaar Card</option>
            </select>
            <video ref={videoRef} width="640" height="480" autoPlay></video>
            <canvas ref={canvasRef} width="640" height="480" style={{ display: 'none' }}></canvas>
            <div>
                <h2>OCR Results:</h2>
                <pre>{JSON.stringify(ocrResults, null, 2)}</pre>
            </div>
        </div>
    );
};

export default DocumentTypeSelector;
