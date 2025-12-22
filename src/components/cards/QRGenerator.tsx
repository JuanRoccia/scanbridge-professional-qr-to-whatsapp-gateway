import React, { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Download, QrCode } from "lucide-react";
interface QRGeneratorProps {
  cardId: string;
}
export function QRGenerator({ cardId }: QRGeneratorProps) {
  const qrRef = useRef<HTMLDivElement>(null);
  const cardUrl = `${window.location.origin}/card/${cardId}`;
  const downloadQR = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `qr-tarjeta-${cardId.split('-')[0]}.png`;
      link.href = url;
      link.click();
    }
  };
  return (
    <div className="flex flex-col items-center space-y-6">
      <div 
        ref={qrRef} 
        className="p-6 bg-white rounded-3xl shadow-xl border-4 border-emerald-500/20"
      >
        <QRCodeCanvas
          value={cardUrl}
          size={256}
          level="H"
          includeMargin={false}
          className="rounded-lg"
        />
      </div>
      <div className="text-center space-y-2">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Enlace de la tarjeta</p>
        <p className="text-sm font-mono bg-muted px-3 py-1.5 rounded-lg border max-w-xs truncate">{cardUrl}</p>
      </div>
      <Button onClick={downloadQR} className="w-full bg-emerald-600 hover:bg-emerald-700 gap-2 h-12 shadow-lg shadow-emerald-200 dark:shadow-none">
        <Download className="h-5 w-5" /> Descargar QR Profesional
      </Button>
    </div>
  );
}