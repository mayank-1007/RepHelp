import React, { useState, useRef, useCallback } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import Webcam from "react-webcam";
import Image from "next/image";
import { Input } from "@/components/ui/input";

const CapturePopover: React.FC = () => {
  const [showPopover, setShowPopover] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const webcamRef = useRef<Webcam>(null);

  const handleCaptureImage = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
        setShowPopover(false);
        handleImageChange(imageSrc);
      }
    }
  }, [webcamRef]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const uploadedFile = event.target.files[0];
      setFile(uploadedFile);
      console.log("Uploaded File:", uploadedFile.name); // Debugging line
      setShowPopover(false);
      handleFileChange(uploadedFile);
    }
  };

  const handleRemoveImage = () => {
    setCapturedImage(null);
    setFile(null);
    handleImageChange(null);
    handleFileChange(null);
  };

  const handleImageChange = (imageSrc: string | null) => {
    // Implement logic to handle the captured image change
  };

  const handleFileChange = (file: File | null) => {
    // Implement logic to handle the uploaded file change
  };

  return (
    <div className="p-4">
      <Popover>
        <PopoverTrigger asChild>
          <div
            className="w-full h-40 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center cursor-pointer dark:bg-gray-800 dark:border-gray-600"
            onClick={() => setShowPopover(true)}
          >
            {capturedImage || file ? (
              <div className="flex flex-col items-center">
                {capturedImage && (
                  <Image
                    src={capturedImage}
                    alt="Captured"
                    width={100}
                    height={100}
                    className="transform scale-x-[-1]"
                  />
                )}
                {file && <p className="text-white">{file.name}</p>}
                <button
                  onClick={handleRemoveImage}
                  className="mt-2 bg-red-500 text-white py-1 px-3 rounded"
                >
                  Remove Image
                </button>
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
              <button
                onClick={handleCaptureImage}
                className="bg-blue-500 text-white py-1 px-3 rounded"
              >
                Capture Image
              </button>
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

export default CapturePopover;
