import React, { useState, useCallback } from "react";
import { QRScanner } from "@/components/scanner/QRScanner";
import { cardConfig } from "@/config/cardConfig";
import { generateWhatsAppLink, isValidPhoneNumber, getPhoneInfo } from "@/lib/whatsappUtils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Toaster, toast } from "sonner";
import { QrCode, User, Globe, Mail, Building2, MessageSquare, Info, FlaskConical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
export function HomePage() {
  const [isScanning, setIsScanning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTestMode, setIsTestMode] = useState(false);
  const processScanResult = useCallback((decodedText: string) => {
    try {
      if (!isValidPhoneNumber(decodedText)) {
        toast.error("Número inválido", {
          description: "El código QR no contiene un número telefónico válido.",
        });
        return;
      }
      setIsScanning(false);
      setIsProcessing(true);
      if ("vibrate" in navigator) {
        navigator.vibrate(200);
      }
      const country = getPhoneInfo(decodedText);
      toast.success(isTestMode ? "Simulación Exitosa" : "¡QR Detectado!", {
        description: `Número de ${country} identificado. Preparando puente...`,
      });
      const link = generateWhatsAppLink(decodedText, cardConfig);
      setTimeout(() => {
        window.location.href = link;
      }, 1500);
    } catch (error) {
      setIsProcessing(false);
      console.error("Scan processing error:", error);
      toast.error("Error de procesamiento", {
        description: "Hubo un problema al generar el enlace de WhatsApp.",
      });
    }
  }, [isTestMode]);
  const handleScanSuccess = useCallback((decodedText: string) => {
    processScanResult(decodedText);
  }, [processScanResult]);
  const handleScanError = useCallback((errorMessage: string) => {
    console.warn("Scanner Error:", errorMessage);
  }, []);
  const handleMainAction = () => {
    if (isTestMode) {
      toast.info("Iniciando simulación...");
      setTimeout(() => {
        processScanResult("+1234567890");
      }, 800);
    } else {
      setIsScanning(true);
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 min-h-screen flex flex-col items-center">
        <ThemeToggle />
        <div className="max-w-md w-full space-y-8 mt-4">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center p-3 bg-emerald-100 dark:bg-emerald-950/30 rounded-2xl mb-4">
              <QrCode className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">ScanBridge</h1>
              <p className="text-muted-foreground font-medium">Puente Profesional a WhatsApp</p>
              {isTestMode && (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800 gap-1.5 py-1">
                  <FlaskConical className="h-3 w-3" /> Modo de Prueba Activo
                </Badge>
              )}
            </div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-xl p-4 flex gap-3 items-start">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
              Escanea códigos QR que contengan un número telefónico con prefijo internacional para enviar tu tarjeta automáticamente.
            </p>
          </div>
          <Card className="border-none shadow-2xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md overflow-hidden relative group">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500" />
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <User className="h-5 w-5 text-emerald-600" />
                Tu Tarjeta Digital
              </CardTitle>
              <CardDescription>Así es como te verán los demás.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-zinc-800/50">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Identidad</span>
                    <span className="text-sm font-bold text-foreground truncate">{cardConfig.name}</span>
                    <span className="text-xs text-muted-foreground truncate">{cardConfig.title} en {cardConfig.company}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-zinc-800/50">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Contacto</span>
                    <span className="text-sm text-foreground truncate">{cardConfig.email}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-zinc-800/50">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Sitio Web</span>
                    <span className="text-sm text-foreground truncate">{cardConfig.website}</span>
                  </div>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-zinc-800">
                <p className="text-xs text-muted-foreground italic leading-relaxed line-clamp-3">
                  "{cardConfig.messageTemplate}"
                </p>
              </div>
            </CardContent>
          </Card>
          <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex flex-col">
                <Label htmlFor="test-mode" className="text-sm font-medium cursor-pointer">Modo de Prueba</Label>
                <span className="text-[10px] text-muted-foreground">Simular escaneo sin cámara</span>
              </div>
              <Switch 
                id="test-mode" 
                checked={isTestMode} 
                onCheckedChange={setIsTestMode}
                className="data-[state=checked]:bg-emerald-600"
              />
            </div>
            <Button
              size="lg"
              className="w-full h-16 text-lg font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200/50 dark:shadow-none transition-all active:scale-95 flex items-center justify-center gap-3"
              onClick={handleMainAction}
              disabled={isProcessing}
            >
              {isTestMode ? <FlaskConical className="h-6 w-6" /> : <QrCode className="h-6 w-6" />}
              {isProcessing ? "Redirigiendo..." : isTestMode ? "Simular Escaneo" : "Abrir Escáner"}
            </Button>
            <p className="text-center text-[10px] text-muted-foreground px-4 uppercase tracking-widest font-semibold">
              Desarrollado para redes de contacto profesionales
            </p>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isScanning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
          >
            <QRScanner
              onScanSuccess={handleScanSuccess}
              onClose={() => setIsScanning(false)}
              onError={handleScanError}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="relative mb-8">
              <div className="w-24 h-24 border-4 border-emerald-100 dark:border-emerald-950 border-t-emerald-500 rounded-full animate-spin" />
              <MessageSquare className="absolute inset-0 m-auto h-10 w-10 text-emerald-500 animate-pulse" />
            </div>
            <h2 className="text-3xl font-bold text-foreground">Conectando...</h2>
            <p className="text-muted-foreground mt-3 max-w-xs text-lg">
              Estamos enviando tu tarjeta profesional al destinatario.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      <Toaster richColors position="bottom-center" />
    </div>
  );
}