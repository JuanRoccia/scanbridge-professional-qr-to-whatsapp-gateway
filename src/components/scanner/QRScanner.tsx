import React, { useEffect, useRef, useState, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { ScanOverlay } from "@/components/ui/ScanOverlay";
import { Button } from "@/components/ui/button";
import { X, Camera, AlertCircle, RefreshCw } from "lucide-react";
interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onClose: () => void;
  onError?: (error: string) => void;
}
export function QRScanner({ onScanSuccess, onClose, onError }: QRScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const regionId = "qr-reader-region";
  const startScanner = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const html5QrCode = new Html5Qrcode(regionId);
      scannerRef.current = html5QrCode;
      const config = {
        fps: 15,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      };
      await html5QrCode.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          onScanSuccess(decodedText);
        },
        () => {
          // Continuous scanning, ignore common errors
        }
      );
      setIsLoading(false);
    } catch (err: any) {
      console.error("Scanner startup failed:", err);
      let message = "No se pudo acceder a la cámara.";
      if (err.name === "NotAllowedError") {
        message = "Permiso denegado. Habilita el acceso a la cámara en los ajustes.";
      } else if (err.name === "NotFoundError") {
        message = "No se encontró ninguna cámara en este dispositivo.";
      } else if (err.name === "NotReadableError") {
        message = "La cámara está siendo usada por otra aplicación.";
      }
      setError(message);
      setIsLoading(false);
      if (onError) onError(message);
    }
  }, [onScanSuccess, onError]);
  useEffect(() => {
    startScanner();
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch((e) => console.warn("Cleanup error:", e));
      }
    };
  }, [startScanner]);
  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden">
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        <div id={regionId} className="w-full h-full object-cover" />
        {/* State Overlays */}
        {isLoading && (
          <div className="absolute inset-0 z-[55] bg-black flex flex-col items-center justify-center text-white space-y-4">
            <div className="relative">
              <Camera className="h-12 w-12 text-emerald-500 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full animate-ping" />
            </div>
            <p className="text-lg font-medium">Iniciando cámara...</p>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 z-[55] bg-zinc-950 flex flex-col items-center justify-center text-white p-8 text-center space-y-6">
            <AlertCircle className="h-16 w-16 text-red-500" />
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Error de Cámara</h3>
              <p className="text-zinc-400 max-w-xs mx-auto">{error}</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} className="border-zinc-700 text-white hover:bg-zinc-800">
                Cancelar
              </Button>
              <Button onClick={startScanner} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                <RefreshCw className="h-4 w-4" /> Reintentar
              </Button>
            </div>
          </div>
        )}
        {!isLoading && !error && (
          <>
            <ScanOverlay />
            <div className="absolute bottom-16 text-center text-white px-8 pointer-events-none z-[60]">
              <p className="text-xl font-bold drop-shadow-lg text-emerald-400">Escaneando...</p>
              <p className="text-sm opacity-90 mt-2 font-medium">Ubica el código QR dentro del marco verde</p>
            </div>
          </>
        )}
        {/* Close Button always visible on top */}
        <div className="absolute top-8 right-8 z-[70]">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white border border-white/10"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}