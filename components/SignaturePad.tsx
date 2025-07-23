import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "./ui/button";

interface SignaturePadProps {
  onSave: (dataURL: string) => void;
}

const SignaturePad: React.FC<SignaturePadProps> = ({ onSave }) => {
  const [signature, setSignature] = useState<string | null>(null);
  const signatureRef = useRef<any>(null);

  const handleSave = () => {
    if (signatureRef.current) {
      const dataURL = signatureRef.current.toDataURL();
      setSignature(dataURL);
      onSave(dataURL); // This calls the onSave function passed from the parent component
    }
  };

  const handleClear = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
      setSignature(null);
    }
  };

  const handleExport = () => {
    if (signature) {
      const blob = dataURLToBlob(signature);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "signature.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const dataURLToBlob = (dataURL: string) => {
    const parts = dataURL.split(";base64,");
    const contentType = parts[0].split(":")[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);
    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], { type: contentType });
  };

  return (
    <div>
      <div>
        <h2>Draw Your Signature:</h2>
        <SignatureCanvas
          ref={signatureRef}
          penColor="white"
          backgroundColor="#212121"
          canvasProps={{
            width: 400,
            height: 200,
            className: "signatureCanvas",
          }}
        />
        <br />
        <Button type="button" onClick={handleSave}>
          Save Signature
        </Button>
        <Button type="button" onClick={handleClear}>
          Clear Signature
        </Button>
      </div>
      {signature && (
        <div>
          <h2>Export Signature:</h2>
          <Button type="button" onClick={handleExport}>
            Export Signature as Image
          </Button>
        </div>
      )}
    </div>
  );
};

export default SignaturePad;
