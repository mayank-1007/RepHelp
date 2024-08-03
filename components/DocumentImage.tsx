import React, { useState, useRef, useCallback, useEffect } from "react";
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
import Tesseract, { WorkerOptions } from "tesseract.js";

interface DocumentScanPopoverProps {
  onScanComplete: (data: any) => void;
}

export const DocumentScanPopover: React.FC<DocumentScanPopoverProps> = ({
  onScanComplete,
}) => {
  const [showPopover, setShowPopover] = useState(false);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [documentType, setDocumentType] = useState<string>("");

  const webcamRef = useRef<Webcam>(null);
  const ocrIndexRef = useRef<number>(0);
  const maxIterations = 1000; // Maximum number of OCR iterations

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

  const handleRemoveImage = (index: number) => {
    setCapturedImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };
  interface CustomWorkerOptions extends WorkerOptions {
    tessedit_char_whitelist?: string;
  }

  const handleOCR = useCallback(async () => {
    console.log("Starting OCR process");
    const image = capturedImages[ocrIndexRef.current];
    if (image) {
      try {
        const customOptions: CustomWorkerOptions = {
          tessedit_char_whitelist:
            "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
          corePath: "",
          langPath: "",
          cachePath: "",
          dataPath: "",
          workerPath: "",
          cacheMethod: "",
          workerBlobURL: false,
          gzip: false,
          legacyLang: false,
          legacyCore: false,
          logger: function (arg: Tesseract.LoggerMessage): void {
            throw new Error("Function not implemented.");
          },
          errorHandler: function (arg: any): void {
            throw new Error("Function not implemented.");
          },
        };
        const { data } = await Tesseract.recognize(image, "eng");
        console.log("OCR result for image:", data.text);
        ocrIndexRef.current++;
        if (
          ocrIndexRef.current < capturedImages.length &&
          ocrIndexRef.current < maxIterations
        ) {
          setTimeout(handleOCR, 100); // Perform OCR every 100ms
        } else {
          ocrIndexRef.current = 0; // Reset index for future scans
          const results = await Promise.all(
            capturedImages.map(async (img) => {
              const { data } = await Tesseract.recognize(img, "eng");
              return data.text;
            }),
          );
          const processOCRResults = (
            results: string[],
            documentType: string,
          ) => {
            let parsedData = {};
            switch (documentType) {
              case "driving_license":
                parsedData = {
                  name: extractNameFromDrivingLicense(results),
                  idNumber: extractIDNumberFromDrivingLicense(results),
                  dob: extractDOBFromDrivingLicense(results),
                  address: extractAddressFromDrivingLicense(results),
                  vehicleNumber: extractVehicleNumber(results),
                };
                break;
              case "driving_license":
                parsedData = {
                  name: extractNameFromDrivingLicense(results),
                  idNumber: extractIDNumberFromDrivingLicense(results),
                  dob: extractDOBFromDrivingLicense(results),
                  address: extractAddressFromDrivingLicense(results),
                  vehicleNumber: extractVehicleNumber(results),
                };
                break;
              case "passport":
                parsedData = {
                  name: extractNameFromDrivingLicense(results),
                  idNumber: extractIDNumberFromDrivingLicense(results),
                  dob: extractDOBFromDrivingLicense(results),
                  address: extractAddressFromDrivingLicense(results),
                  vehicleNumber: extractVehicleNumber(results),
                };
                break;
              case "driving_license":
                parsedData = {
                  name: extractNameFromDrivingLicense(results),
                  idNumber: extractIDNumberFromDrivingLicense(results),
                  dob: extractDOBFromDrivingLicense(results),
                  address: extractAddressFromDrivingLicense(results),
                  vehicleNumber: extractVehicleNumber(results),
                };
                break;
              // Add cases for other document types (passport, Aadhar card, etc.)
              default:
                break;
            }
            return parsedData;
          };
          const parsedData = processOCRResults(results, documentType);
          console.log("Parsed OCR results:", parsedData);
          onScanComplete(parsedData);
        }
      } catch (err) {
        console.error("Error during OCR:", err);
      }
    }
  }, [capturedImages, documentType, onScanComplete]);

  useEffect(() => {
    if (capturedImages.length > 0) {
      handleOCR();
    }
  }, [capturedImages, handleOCR]);

  const extractNameFromDrivingLicense = (results: string[]) => {
    // const ocrText = results.join('\n'); // Join all OCR results into a single string
    // const nameRegex = /Name:\s+([A-Za-z]{2,}(?:\s+[A-Za-z]{2,}){1,2})/;
    // const match = ocrText.match(nameRegex);
    // return match ? match[1].trim() : '';
    return "";
  };

  const extractIDNumberFromDrivingLicense = (results) => {
    const ocrText = results.join("\n"); // Join all OCR results into a single string
    const idNumberRegex = /\b\d{4} \d{4} \d{4}\b/; // Define the regex for three sets of four-digit numbers separated by spaces
    const match = ocrText.match(idNumberRegex);
    return match ? match[0].trim() : "";
  };

  const extractDOBFromDrivingLicense = (results: string[]) => {
    // const ocrText = results.join('\n'); // Join all OCR results into a single string
    // const nameRegex = ;
    // const match = ocrText.match(nameRegex);
    // return match ? match[1].trim() : '';
    return "";
  };

  const extractAddressFromDrivingLicense = (results: string[]) => {
    // Implement based on the structure of your OCR result
    return "";
  };

  const extractVehicleNumber = (results: string[]) => {
    // Implement based on the structure of your OCR result
    return "";
  };

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
              {/* Add other document types as needed */}
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
                      onClick={() => handleRemoveImage(index)}
                      className="mt-2 bg-red-500 text-white py-1 px-3 rounded"
                    >
                      Remove Image {index + 1}
                    </Button>
                  </div>
                ))}
                {files.map((file, index) => (
                  <div key={index} className="flex flex-col items-center mb-4">
                    <p className="text-white">{file.name}</p>
                    <Button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="mt-2 bg-red-500 text-white py-1 px-3 rounded"
                    >
                      Remove File {index + 1}
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
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                className="file-input mt-2"
              />
            </div>
          </PopoverContent>
        )}
      </Popover>
    </div>
  );
};
