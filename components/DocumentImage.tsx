import React, { useState, useRef, useCallback } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import Webcam from "react-webcam";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { FormControl } from "./ui/form";
import { Button } from "./ui/button";
import Tesseract from 'tesseract.js';
import { toast } from "sonner";

interface DocumentScanPopoverProps {
  onScanComplete: (data: any) => void;
}
interface LicenseData {
  name: string;
  dateOfBirth: string;
  identificationNo: string;
  address: string;
}

export const DocumentScanPopover: React.FC<DocumentScanPopoverProps> = ({
  onScanComplete,
}) => {
  const [showPopover, setShowPopover] = useState(false);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [documentType, setDocumentType] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const webcamRef = useRef<Webcam>(null);

  const handleCaptureImage = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImages((prevImages) => [...prevImages, imageSrc]);
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
          setCapturedImages((prevImages) => [
            ...prevImages,
            reader.result as string,
          ]);
        }
      };
      reader.readAsDataURL(uploadedFile);
      setFiles((prevFiles) => [...prevFiles, uploadedFile]);
      setShowPopover(false);
    }
  };
  const removeHindi = (text: string): string => {
    return text.replace(/[^\x00-\x7F]/g, '');
  }


  function extractLicenseData(text: string): LicenseData | null {
    // Regex patterns
    const namePattern = /Name:\s*([A-Z\s]+)(?=\n)/i;
    const dobPattern = /Date of Birth:\s*(\d{2}-\d{2}-\d{4})/i;
    const idPattern = /\b([A-Z]{2}\d{2}\s*\d{11})\b/;
    const addressPattern = /Address\s*([\w\s,]*\d{6})/i;

    // Additional generic patterns for fallback
    const genericDobPattern = /(\d{2}[\/-]\d{2}[\/-]\d{4})/;

    // Extracting data
    const nameMatch = text.match(namePattern);
    const dobMatch = text.match(dobPattern) || text.match(genericDobPattern);
    const idMatch = text.match(idPattern);
    const addressMatch = text.match(addressPattern);

    return {
      name: nameMatch ? nameMatch[1].trim() : "",
      dateOfBirth: dobMatch ? dobMatch[1] : "",
      identificationNo: idMatch ? idMatch[1].replace(/\s/g, '') : "",
      address: addressMatch ? addressMatch[1].trim() : ""
    };
  }

  const handleRemoveImage = (index: number) => {
    setCapturedImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const performTesseractOCR = async (image: string) => {
    try {
      console.log("Fallback to Tesseract.js");
      toast.info("Attempting local OCR...");

      const result = await Tesseract.recognize(
        image,
        'eng',
        {
          logger: (m: any) => console.log(m),
        }
      );

      console.log("Tesseract Result:", result);
      const text = removeHindi(result.data.text);
      console.log("Cleaned Text:", text);

      const extractedData = extractLicenseData(text);
      console.log("Extracted Data:", extractedData);

      if (extractedData) {
        // Map to the format expected by the form
        onScanComplete({
          name: extractedData.name,
          dob: extractedData.dateOfBirth,
          idNumber: extractedData.identificationNo,
          address: extractedData.address
        });
        toast.success("OCR completed successfully!");
      } else {
        toast.error("Could not extract data from image.");
      }

    } catch (err) {
      console.error("Tesseract Error:", err);
      toast.error("Local OCR failed as well.");
    }
  };

  const handleOCR = useCallback(async () => {
    if (capturedImages.length === 0) {
      toast.error("Please capture or upload an image first.");
      return;
    }

    console.log("Starting OCR process");
    setIsProcessing(true);
    toast.loading("Processing image...");

    for (let image of capturedImages) {
      try {
        // Convert base64 to Blob
        const blob = await fetch(image).then((res) => res.blob());

        // Prepare the API request
        const data = new FormData();
        data.append('image', blob, 'image.jpg'); // Use 'image' as the field name

        const options = {
          method: 'POST',
          headers: {
            'x-rapidapi-key': 'b6ebee2f7dmshb79e2f003a3ba8cp1d5edcjsn679c6ac1763f',
            'x-rapidapi-host': 'ocr43.p.rapidapi.com'
          },
          body: data
        };

        console.log("Attempting RapidAPI OCR...");
        const response = await fetch('https://ocr43.p.rapidapi.com/v1/results', options);

        if (!response.ok) {
          throw new Error(`RapidAPI failed with status: ${response.status}`);
        }

        const result = await response.json();

        console.log('OCR API response:', result);

        if (result.results && result.results.length > 0) {
          const text = removeHindi(result.results[0].entities[0].objects[0].entities[0].text);
          console.log('Text :', text);
          const extractedData = extractLicenseData(text);

          if (extractedData) {
            onScanComplete({
              name: extractedData.name,
              dob: extractedData.dateOfBirth,
              idNumber: extractedData.identificationNo,
              address: extractedData.address
            });
            toast.success("OCR completed successfully!");
          }
        } else {
          throw new Error("RapidAPI returned empty results");
        }

      } catch (err) {
        console.error("RapidAPI Error:", err);
        toast.error("Cloud OCR failed, switching to local...");
        // Fallback to Tesseract
        await performTesseractOCR(image);
      }
    }

    setIsProcessing(false);
    toast.dismiss();
  }, [capturedImages, onScanComplete]);


  return (
    <div className="p-4">
      <div className="mb-4">
        <FormControl>
          <Select
            value={documentType}
            onValueChange={(e) => setDocumentType(e)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select the identification type">
                {documentType || "Select"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="shad-select-content">
              <SelectItem value="driving_license">Driving License</SelectItem>
              <SelectItem value="passport">Passport</SelectItem>
              <SelectItem value="voter_id">Voter ID Card</SelectItem>
              <SelectItem value="adhar">Adhaar Card</SelectItem>
            </SelectContent>
          </Select>
        </FormControl>
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <div
            className="w-full h-40 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center cursor-pointer dark:bg-gray-800 dark:border-gray-600"
            onClick={() => setShowPopover(true)}
          >
            {capturedImages.length || files.length ? (
              <div className="flex flex-row items-center">
                {capturedImages.map((img, index) => (
                  <div key={index} className="flex flex-col items-center mb-4">
                    <Image
                      src={img}
                      alt={`Captured ${index + 1}`}
                      width={100}
                      height={100}
                      className="transform scale-x--1"
                    />
                    <Button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(index);
                      }}
                      className="mt-2 bg-red-500 text-white py-1 px-3 rounded"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Image
                  src="/assets/icons/upload.svg"
                  alt="Upload"
                  width={40}
                  height={40}
                />
                <div className="file-upload_label">
                  <br />
                  <p className="text-14-regular">
                    <span className="text-green-500">Click to upload </span>
                    or drag and drop
                  </p>
                  <p className="text-12-regular">
                    SVG, PNG, JPG or GIF (max. 800x400px)
                  </p>
                </div>
              </div>
            )}
          </div>
        </PopoverTrigger>
        {showPopover && (
          <PopoverContent className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg p-4 z-50">
            <div className="flex flex-col items-center space-y-4">
              <Webcam
                audio={false}
                screenshotFormat="image/jpeg"
                width={200}
                height={200}
                ref={webcamRef}
                className="rounded-lg transform scale-x--1"
              />
              <Button
                onClick={handleCaptureImage}
                className="bg-blue-500 text-white py-1 px-3 rounded"
              >
                Capture Image
              </Button>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="file-input mt-2"
              />
            </div>
          </PopoverContent>
        )}
      </Popover>
      <div className="mt-4">
        <Button
          type="button"
          onClick={handleOCR}
          disabled={isProcessing}
          className="bg-green-500 text-white py-2 px-4 rounded w-full"
        >
          {isProcessing ? "Scanning..." : "Start OCR Scanning"}
        </Button>
      </div>
    </div>
  );
};
