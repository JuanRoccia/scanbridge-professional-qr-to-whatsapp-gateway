import React, { useEffect, useRef } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { ScanOverlay } from "@/components/ui/ScanOverlay";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onClose: () => void;
}
export function QRScanner({ onScanSuccess, onClose }: QRScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const regionId = "qr-reader-region";
  useEffect(() => {
    const html5QrCode = new Html5Qrcode(regionId);
    scannerRef.current = html5QrCode;
    const config = { 
      fps: 10, 
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0 
    };
    html5QrCode.start(
      { facingMode: "environment" },
      config,
      (decodedText) => {
        // Success
        onScanSuccess(decodedText);
      },
      () => {
        // Error is common during seeking, we usually ignore it
      }
    ).catch((err) => {
      console.error("Unable to start scanner", err);
    });
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch((e) => console.warn("Stop error", e));
      }
    };
  }, [onScanSuccess]);
  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        <div id={regionId} className="w-full h-full object-cover" />
        <ScanOverlay />
        <div className="absolute top-6 right-6 z-[60]">
          <Button 
            variant="secondary" 
            size="icon" 
            className="rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white border-none"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
        <div className="absolute bottom-12 text-center text-white px-6 pointer-events-none">
          <p className="text-lg font-medium drop-shadow-md">Align QR Code within the frame</p>
          <p className="text-sm opacity-80 mt-2">The message will be sent to the scanned number</p>
        </div>
      </div>
    </div>
  );
}