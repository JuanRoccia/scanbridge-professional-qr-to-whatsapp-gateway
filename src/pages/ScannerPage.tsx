import React, { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { QRScanner } from "@/components/scanner/QRScanner";
import { isValidPhoneNumber, generateWhatsAppLink } from "@/lib/whatsappUtils";
import { getLocalPrimaryCardId } from "@/lib/storage";
import { useCard } from "@/lib/api";
import { cardConfig } from "@/config/cardConfig";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Phone, FlaskConical, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
export function ScannerPage() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const isProcessingRef = useRef(false);
  const [testMode, setTestMode] = useState(false);
  const [testNumber, setTestNumber] = useState("");
  // Get the locally preferred primary card ID
  const primaryCardId = getLocalPrimaryCardId();
  // Fetch its data from API if it exists
  const { data: primaryCard } = useCard(primaryCardId || undefined);
  const handleScanSuccess = useCallback(async (decodedText: string) => {
    if (isProcessingRef.current) return;
    // 1. Check for Card URLs
    const lowerText = decodedText.toLowerCase();
    if (lowerText.startsWith('http') && lowerText.includes('/card/')) {
      try {
        const url = new URL(decodedText);
        const pathParts = url.pathname.split('/').filter(Boolean);
        const id = pathParts[1]; 
        if (id) {
          setIsProcessing(true);
          isProcessingRef.current = true;
          toast.success('Abriendo tarjeta digital...');
          if ("vibrate" in navigator) navigator.vibrate(200);
          setTimeout(() => navigate(`/card/${id}`), 1200);
          return;
        }
      } catch (err) {
        console.error("Card URL error:", err);
      }
    }
    // 2. Standard Phone Number Handling
    const cleanNumber = decodedText.replace(/\D/g, "");
    if (!isValidPhoneNumber(cleanNumber)) {
      toast.error("Código QR no válido. Se requiere un número telefónico.");
      return;
    }
    setIsProcessing(true);
    isProcessingRef.current = true;
    // Use primary cloud card data if available, else fallback to environment config
    const sharingConfig = primaryCard ? {
      name: primaryCard.name,
      company: primaryCard.company,
      title: "Profesional",
      email: "",
      website: `${window.location.origin}/card/${primaryCard.id}`,
      messageTemplate: cardConfig.messageTemplate
    } : cardConfig;
    try {
      const waLink = generateWhatsAppLink(cleanNumber, sharingConfig);
      if ("vibrate" in navigator) navigator.vibrate(200);
      // Delay to show the success state
      setTimeout(() => {
        window.location.href = waLink;
      }, 1800);
    } catch (err) {
      console.error("Bridge failed:", err);
      toast.error("Error al generar el puente de WhatsApp.");
      setIsProcessing(false);
      isProcessingRef.current = false;
    }
  }, [navigate, primaryCard]);
  useEffect(() => {
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
            {!testMode ? (
              <QRScanner
                onScanSuccess={handleScanSuccess}
                onClose={() => navigate("/")}
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-8 space-y-8 text-white min-h-screen bg-zinc-950">
                <FlaskConical className="h-16 w-16 text-emerald-500 animate-pulse" />
                <div className="text-center space-y-2">
                  <h1 className="text-2xl font-bold">Bridge Simulator</h1>
                  <p className="text-zinc-400">Prueba el envío de tu tarjeta cloud</p>
                </div>
                <div className="w-full max-w-xs space-y-4">
                  <Input
                    placeholder="Número ej: 54911..."
                    value={testNumber}
                    onChange={(e) => setTestNumber(e.target.value)}
                    className="bg-zinc-900 border-zinc-700 text-white h-12 rounded-xl focus:ring-emerald-500"
                  />
                  <Button
                    onClick={() => handleScanSuccess(testNumber)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 font-bold rounded-xl"
                  >
                    Simular Puente Cloud
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
            <div className="fixed top-8 left-8 z-[70]">
               <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white border border-white/10"
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </div>
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[70] flex flex-col items-center gap-3">
              {primaryCard && (
                <div className="px-3 py-1 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 rounded-full text-[10px] text-emerald-400 font-bold uppercase tracking-widest">
                  Compartiendo: {primaryCard.name}
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTestMode(!testMode)}
                className="rounded-full bg-black/40 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all backdrop-blur-md px-6"
              >
                {testMode ? "Usar Cámara" : "Probar sin Cámara"}
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center space-y-8 text-white z-[80]"
          >
            <div className="relative">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12, stiffness: 200 }}
                className="bg-emerald-500 p-8 rounded-full shadow-[0_0_60px_rgba(16,185,129,0.6)]"
              >
                <CheckCircle2 className="h-20 w-20 text-white" />
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.2, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 bg-emerald-500 rounded-full -z-10"
              />
            </div>
            <div className="text-center space-y-3">
              <h2 className="text-4xl font-black tracking-tight italic">¡CONECTADO!</h2>
              <div className="flex flex-col items-center gap-2">
                 <p className="text-emerald-400 font-bold flex items-center gap-2 text-lg">
                    <Phone className="h-5 w-5 animate-bounce" /> Abriendo WhatsApp...
                 </p>
                 <Loader2 className="h-4 w-4 animate-spin text-zinc-600" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}