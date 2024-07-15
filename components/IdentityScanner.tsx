// import React, { useState } from 'react';
// import QrReader, { QrReaderProps } from 'react-qr-reader'; 
// import Tesseract from 'tesseract.js';

// interface IdentityData {
//   name: string;
//   idNumber: string;
//   dob: string;
//   address?: string;
//   photo?: string;
//   nationality?: string;
//   vehicleNumber?: string;
//   // Add other fields as needed for different types of IDs
// }

// type IdentityType = 'aadhaar' | 'drivingLicense' | 'passport' | 'voterID';

// interface IdentityScannerProps {
//   identityType: IdentityType;
//   onScanComplete: (data: IdentityData | null) => void;
// }

// const IdentityScanner: React.FC<IdentityScannerProps> = ({ identityType, onScanComplete }) => {
//   const [scanResultFront, setScanResultFront] = useState<string | null>(null);
//   const [scanResultBack, setScanResultBack] = useState<string | null>(null);

//   const handleScanFront = (data: string | null) => {
//     if (data) {
//       setScanResultFront(data);
//       processScanData(data);
//     }
//   };

//   const handleScanBack = (data: string | null) => {
//     if (data) {
//       setScanResultBack(data);
//       processScanData(data);
//     }
//   };

//   const processScanData = async (data: string) => {
//     switch (identityType) {
//       case 'aadhaar':
//         processAadhaarData(data);
//         break;
//       case 'drivingLicense':
//         processDrivingLicenseData(data);
//         break;
//       case 'passport':
//         processPassportData(data);
//         break;
//       case 'voterID':
//         processVoterIDData(data);
//         break;
//       default:
//         console.error('Unsupported identity type');
//     }
//   };

//   const processAadhaarData = (data: string) => {
//     // Example: Assuming Aadhaar QR data is in XML format
//     if (data.startsWith('<?xml')) {
//       const decodedData = atob(data.split(',')[1]);
//       const parsedData = parseAadhaarData(decodedData);
//       onScanComplete(parsedData);
//     } else {
//       console.error('Invalid Aadhaar QR code');
//       onScanComplete(null);
//     }
//   };

//   const parseAadhaarData = (xmlData: string): IdentityData | null => {
//     try {
//       const parser = new DOMParser();
//       const xmlDoc = parser.parseFromString(xmlData, 'text/xml');
//       const name = xmlDoc.getElementsByTagName('name')[0].textContent ?? '';
//       const idNumber = xmlDoc.getElementsByTagName('uid')[0].textContent ?? '';
//       const dob = xmlDoc.getElementsByTagName('dob')[0].textContent ?? '';
//       const address = xmlDoc.getElementsByTagName('address')[0]?.textContent ?? '';
//       // Add more fields if available in Aadhaar XML

//       return { name, idNumber, dob, address };
//     } catch (error) {
//       console.error('Error parsing Aadhaar data:', error);
//       return null;
//     }
//   };

//   const processDrivingLicenseData = async (data: string) => {
//     // Implement logic to process driving license data
//     // Here, assuming OCR for both front and back sides
//     const frontImageData = await Tesseract.recognize(data, 'eng');
//     const backImageData = await Tesseract.recognize(data, 'eng');
//     const parsedData = processOCRResult(frontImageData, backImageData);
//     onScanComplete(parsedData);
//   };

//   const processPassportData = async (data: string) => {
//     // Implement logic to process passport data
//     // Here, assuming OCR for both front and back sides
//     const frontImageData = await Tesseract.recognize(data, 'eng');
//     const backImageData = await Tesseract.recognize(data, 'eng');
//     const parsedData = processOCRResult(frontImageData, backImageData);
//     onScanComplete(parsedData);
//   };

//   const processVoterIDData = async (data: string) => {
//     // Voter ID handling logic
//     // Voter IDs typically don't have QR codes, so implement OCR logic directly
//     const imageData = await Tesseract.recognize(data, 'eng');
//     const parsedData = processOCRResult(imageData);
//     onScanComplete(parsedData);
//   };

//   const processOCRResult = (frontResult: Tesseract.RecognizeResult, backResult?: Tesseract.RecognizeResult): IdentityData | null => {
//     // Implement logic to parse OCR results for front and back sides
//     let parsedData: IdentityData = {
//       name: '',
//       idNumber: '',
//       dob: '',
//     };

//     // Example: Extracting data from OCR results
//     if(frontResult) parsedData.name = extractName(frontResult);
//     if(frontResult) parsedData.idNumber = extractIDNumber(frontResult);
//     if(frontResult) parsedData.dob = extractDOB(frontResult);
//     if(backResult) parsedData.address = extractAddress(backResult);
//     if(frontResult) parsedData.photo = extractPhoto(frontResult); // Assuming base64 encoded image
//     if(backResult) parsedData.nationality = extractNationality(backResult);
//     if(backResult) parsedData.vehicleNumber = extractVehicleNumber(backResult);

//     return parsedData;
//   };

//   const extractName = (result: Tesseract.RecognizeResult): string => {
//     // Implement logic to extract name from OCR result
//     return '';
//   };

//   const extractIDNumber = (result: Tesseract.RecognizeResult): string => {
//     // Implement logic to extract ID number from OCR result
//     return '';
//   };

//   const extractDOB = (result: Tesseract.RecognizeResult): string => {
//     // Implement logic to extract date of birth from OCR result
//     return '';
//   };

//   const extractAddress = (result: Tesseract.RecognizeResult): string | undefined => {
//     // Implement logic to extract address from OCR result (back side)
//     return undefined;
//   };

//   const extractPhoto = (result: Tesseract.RecognizeResult): string | undefined => {
//     // Implement logic to extract photo (base64 encoded) from OCR result (front side)
//     return undefined;
//   };

//   const extractNationality = (result: Tesseract.RecognizeResult): string | undefined => {
//     // Implement logic to extract nationality from OCR result (back side)
//     return undefined;
//   };

//   const extractVehicleNumber = (result: Tesseract.RecognizeResult): string | undefined => {
//     // Implement logic to extract vehicle number from OCR result (back side)
//     return undefined;
//   };

//   const handleError = (err: any) => {
//     console.error(err);
//   };

//   return (
//     <div>
//       <div>
//         <QrReader
//           delay={300}
//           onError={handleError}
//           onScan={handleScanFront}
//           style={{ width: '50%', float: 'left' }}
//         />
//         <QrReader
//           delay={300}
//           onError={handleError}
//           onScan={handleScanBack}
//           style={{ width: '50%', float: 'left' }}
//         />
//         <div style={{ clear: 'both' }}></div>
//       </div>
//     </div>
//   );
// };

// export default IdentityScanner;
