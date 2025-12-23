import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { QRScanner } from "@/components/scanner/QRScanner";
import { isValidPhoneNumber, generateWhatsAppLink } from "@/lib/whatsappUtils";
import { getPrimaryCard } from "@/lib/storage";
import { cardConfig } from "@/config/cardConfig";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Phone, ShieldAlert, FlaskConical, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRef } from "react";
export function ScannerPage() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const isProcessingRef = useRef(false);
  const [testMode, setTestMode] = useState(false);
  const [testNumber, setTestNumber] = useState("");
  const handleScanSuccess = useCallback((decodedText: string) => {
    if (isProcessingRef.current) return;

    // Check for card QR codes first
    const lowerText = decodedText.toLowerCase();
    if (lowerText.startsWith('http') && lowerText.includes('/card/')) {
      try {
        const url = new URL(decodedText);
        const pathname = url.pathname;
        const pathParts = pathname.split('/').filter(Boolean);
        const id = pathParts[1]; // /card/{id} -> pathParts[0]="card", pathParts[1]="id"
        if (id) {
          setIsProcessing(true);
          isProcessingRef.current = true;
          toast.success('Abriendo tarjeta digital...');
          if ("vibrate" in navigator) {
            navigator.vibrate(200);
          }
          setTimeout(() => {
            navigate(`/card/${id}`);
          }, 1500);
          return;
        }
      } catch (err) {
        console.error("Card URL parsing failed:", err);
      }
    }

    // Existing phone number handling
    // Sanitize and validate
    const cleanNumber = decodedText.replace(/\D/g, "");
    if (!isValidPhoneNumber(cleanNumber)) {
      toast.error("El código QR no contiene un número de teléfono válido.");
      return;
    }
    setIsProcessing(true);
    isProcessingRef.current = true;
    // Get the card to share (either primary from storage or the one from environment config)
    const primaryCard = getPrimaryCard();
    const sharingConfig = primaryCard ? {
      name: primaryCard.name,
      company: primaryCard.company,
      title: "Profesional",
      email: "",
      website: "",
      messageTemplate: cardConfig.messageTemplate
    } : cardConfig;
    try {
      const waLink = generateWhatsAppLink(cleanNumber, sharingConfig);
      // Haptic feedback if available
      if ("vibrate" in navigator) {
        navigator.vibrate(200);
      }
      // Short delay for the animation
      setTimeout(() => {
        window.location.href = waLink;
      }, 1500);
    } catch (err) {
      console.error("WhatsApp Link Generation failed:", err);
      toast.error("Error al generar el enlace de WhatsApp.");
      setIsProcessing(false);
      isProcessingRef.current = false;
    }
  }, [navigate]);

  // Sync ref with state
  React.useEffect(() => {
    isProcessingRef.current = isProcessing;
  }, [isProcessing]);
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
      <AnimatePresence>
        {!isProcessing ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="w-full h-full"
          >
            {/* Actual Scanner */}
            {!testMode ? (
              <QRScanner 
                onScanSuccess={handleScanSuccess} 
                onClose={() => navigate("/")} 
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-8 space-y-8 text-white min-h-screen">
                <FlaskConical className="h-16 w-16 text-emerald-500 animate-pulse" />
                <div className="text-center space-y-2">
                  <h1 className="text-2xl font-bold">Modo de Prueba</h1>
                  <p className="text-zinc-400">Simula un escaneo ingresando un número</p>
                </div>
                <div className="w-full max-w-xs space-y-4">
                  <Input 
                    placeholder="Ej: 5491112345678" 
                    value={testNumber}
                    onChange={(e) => setTestNumber(e.target.value)}
                    className="bg-zinc-900 border-zinc-700 text-white h-12"
                  />
                  <Button 
                    onClick={() => handleScanSuccess(testNumber)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 font-bold"
                  >
                    Simular Escaneo
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={() => setTestMode(false)}
                    className="w-full text-zinc-400 hover:text-white"
                  >
                    Volver a Cámara
                  </Button>
                </div>
              </div>
            )}
            {/* Navigation Overlay */}
            <div className="fixed top-8 left-8 z-[70] flex gap-2">
               <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white border border-white/10"
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </div>
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[70]">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setTestMode(!testMode)}
                className="rounded-full bg-black/40 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all backdrop-blur-md"
              >
                {testMode ? "Usar Cámara" : "Probar sin Cámara"}
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center space-y-6 text-white z-[80]"
          >
            <div className="relative">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12, stiffness: 200 }}
                className="bg-emerald-500 p-6 rounded-full shadow-[0_0_40px_rgba(16,185,129,0.4)]"
              >
                <CheckCircle2 className="h-20 w-20 text-white" />
              </motion.div>
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 bg-emerald-500/20 rounded-full -z-10" 
              />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">✅ ¡Listo!</h2>
              <p className="text-emerald-400 font-medium flex items-center justify-center gap-2">
                <Phone className="h-4 w-4" /> Conectando...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}