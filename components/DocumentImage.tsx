import React, { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from '@/components/ui/select';
import { FormControl } from './ui/form';
import { Button } from './ui/button';
import Tesseract, { WorkerOptions } from 'tesseract.js';

interface DocumentScanPopoverProps {
  onScanComplete: (data: any) => void;
}

export const DocumentScanPopover: React.FC<DocumentScanPopoverProps> = ({ onScanComplete }) => {
  const [showPopover, setShowPopover] = useState(false);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [documentType, setDocumentType] = useState<string>('');

  const webcamRef = useRef<Webcam>(null);

  const handleCaptureImage = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImages(prevImages => [...prevImages, imageSrc]);
        setShowPopover(false);
      }
    }
  }, [webcamRef]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const uploadedFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setCapturedImages(prevImages => [...prevImages, reader.result as string]);
        }
      };
      reader.readAsDataURL(uploadedFile);
      setFiles(prevFiles => [...prevFiles, uploadedFile]);
      setShowPopover(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setCapturedImages(prevImages => prevImages.filter((_, i) => i !== index));
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };
  interface CustomWorkerOptions extends WorkerOptions {
    tessedit_char_whitelist?: string;
  }

  const handleOCR = useCallback(async () => {
    const results = await Promise.all(capturedImages.map(async (image) => {
      // Use type assertion to include tessedit_char_whitelist in options
      const { data } = await Tesseract.recognize(image, 'eng', {
        tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
      } as CustomWorkerOptions);
      return data.text;
    }));
    

    const processOCRResults = (results: string[], documentType: string) => {
      let parsedData = {};
      switch (documentType) {
        case 'adhar_card':
          parsedData = {
            name: extractNameFromAdhar(results),
            idNumber: extractIDNumberFromAdhar(results),
            dob: extractDOBFromAdhar(results),
            address: extractAddressFromAdhar(results)
          };
          break;
        case 'driving_license':
          parsedData = {
            name: extractNameFromDrivingLicense(results),
            idNumber: extractIDNumberFromDrivingLicense(results),
            dob: extractDOBFromDrivingLicense(results),
            address: extractAddressFromDrivingLicense(results),
            vehicleNumber: extractVehicleNumber(results)
          };
          break;
        case 'passport':
          parsedData = {
            name: extractNameFromPassport(results),
            idNumber: extractIDNumberFromPassport(results),
            dob: extractDOBFromPassport(results),
            nationality: extractNationalityFromPassport(results)
          };
          break;
        case 'voter_id':
          parsedData = {
            name: extractNameFromVoterID(results),
            idNumber: extractIDNumberFromVoterID(results),
            dob: extractDOBFromVoterID(results),
            address: extractAddressFromVoterID(results)
          };
          break;
        default:
          break;
      }
      return parsedData;
    };

    const parsedData = processOCRResults(results, documentType);
    onScanComplete(parsedData);
  }, [capturedImages, documentType, onScanComplete]);

  // Implement your extraction functions here
  const extractNameFromAdhar = (results: string[]) => {/* ... */};
  const extractIDNumberFromAdhar = (results: string[]) => {/* ... */};
  const extractDOBFromAdhar = (results: string[]) => {/* ... */};
  const extractAddressFromAdhar = (results: string[]) => {/* ... */};

  const extractNameFromDrivingLicense = (results: string[]) => {/* ... */};
  const extractIDNumberFromDrivingLicense = (results: string[]) => {/* ... */};
  const extractDOBFromDrivingLicense = (results: string[]) => {/* ... */};
  const extractAddressFromDrivingLicense = (results: string[]) => {/* ... */};
  const extractVehicleNumber = (results: string[]) => {/* ... */};

  const extractNameFromPassport = (results: string[]) => {/* ... */};
  const extractIDNumberFromPassport = (results: string[]) => {/* ... */};
  const extractDOBFromPassport = (results: string[]) => {/* ... */};
  const extractNationalityFromPassport = (results: string[]) => {/* ... */};

  const extractNameFromVoterID = (results: string[]) => {/* ... */};
  const extractIDNumberFromVoterID = (results: string[]) => {/* ... */};
  const extractDOBFromVoterID = (results: string[]) => {/* ... */};
  const extractAddressFromVoterID = (results: string[]) => {/* ... */};

  useEffect(() => {
    if (capturedImages.length === 2) {
      handleOCR();
    }
  }, [capturedImages, handleOCR]);

  return (
    <div className="p-4">
      <div className="mb-4">
        <FormControl>
          <Select value={documentType} onValueChange={(e) => setDocumentType(e)}>
            <SelectTrigger>
              <SelectValue placeholder="Select the identification type">{documentType || 'Select'}</SelectValue>
            </SelectTrigger>
            <SelectContent className="shad-select-content">
              <SelectItem value="driving_license">Driving License</SelectItem>
              <SelectItem value="passport">Passport</SelectItem>
              <SelectItem value="voter_id">Voter ID</SelectItem>
              <SelectItem value="adhar_card">Adhar Card</SelectItem>
            </SelectContent>
          </Select>
        </FormControl>
      </div>
      <div className="flex flex-wrap gap-4 mb-4">
        {capturedImages.map((image, index) => (
          <div key={index} className="flex flex-col items-center">
            <Image src={image} alt={`Captured ${index + 1}`} width={100} height={100} />
            <Button onClick={() => handleRemoveImage(index)} className="mt-2 bg-red-500 text-white py-1 px-3 rounded">
              Remove Image {index + 1}
            </Button>
          </div>
        ))}
      </div>
      <div className="flex items-center space-x-4">
        <Button onClick={() => setShowPopover(true)} className="bg-blue-500 text-white py-1 px-3 rounded">
          Add Image
        </Button>
        <Button onClick={handleOCR} className="bg-green-500 text-white py-1 px-3 rounded">
          Perform OCR
        </Button>
      </div>
      {showPopover && (
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg p-4 z-50">
            <div className="flex flex-col items-center space-y-4">
              <Webcam
                audio={false}
                screenshotFormat="image/jpeg"
                width={200}
                height={200}
                ref={webcamRef}
                className="rounded-lg"
              />
              <Button onClick={handleCaptureImage} className="bg-blue-500 text-white py-1 px-3 rounded">
                Capture Image
              </Button>
              <Input type="file" accept="image/*,.pdf" onChange={handleFileUpload} className="file-input mt-2" />
              <Button onClick={() => setShowPopover(false)} className="bg-red-500 text-white py-1 px-3 rounded">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
