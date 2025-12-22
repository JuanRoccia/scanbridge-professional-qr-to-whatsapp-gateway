import React, { useState, useCallback } from "react";
import { QRScanner } from "@/components/scanner/QRScanner";
import { cardConfig } from "@/config/cardConfig";
import { generateWhatsAppLink } from "@/lib/whatsappUtils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Toaster, toast } from "sonner";
import { QrCode, User, Globe, Mail, Building2, ExternalLink, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
export function HomePage() {
  const [isScanning, setIsScanning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const handleScanSuccess = useCallback((decodedText: string) => {
    setIsScanning(false);
    setIsProcessing(true);
    // Simulate haptic feedback if available
    if ("vibrate" in navigator) {
      navigator.vibrate(200);
    }
    toast.success("QR Code Detected!", {
      description: "Preparing your professional bridge...",
    });
    const link = generateWhatsAppLink(decodedText, cardConfig);
    // Slight delay for visual feedback before redirect
    setTimeout(() => {
      window.location.href = link;
    }, 1200);
  }, []);
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <ThemeToggle />
      <div className="max-w-md w-full space-y-8 mt-8">
        {/* Header Section */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-100 dark:bg-emerald-950/30 rounded-2xl mb-4">
            <QrCode className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">ScanBridge</h1>
          <p className="text-muted-foreground">Pro QR to WhatsApp Gateway</p>
        </div>
        {/* Business Card Preview */}
        <Card className="border-none shadow-xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-emerald-600" />
              Your Business Card
            </CardTitle>
            <CardDescription>This is what the recipient will receive.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-zinc-800/50">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Name & Title</span>
                  <span className="text-sm font-semibold">{cardConfig.name}</span>
                  <span className="text-xs opacity-80">{cardConfig.title} at {cardConfig.company}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-zinc-800/50">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Contact</span>
                  <span className="text-sm">{cardConfig.email}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-zinc-800/50">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Website</span>
                  <span className="text-sm truncate">{cardConfig.website}</span>
                </div>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-zinc-800">
              <p className="text-xs text-muted-foreground italic leading-relaxed">
                "{cardConfig.messageTemplate.slice(0, 100)}..."
              </p>
            </div>
          </CardContent>
        </Card>
        {/* Main Actions */}
        <div className="space-y-4 pt-4">
          <Button 
            size="lg" 
            className="w-full h-16 text-lg font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200 dark:shadow-none transition-all active:scale-95 flex items-center gap-3"
            onClick={() => setIsScanning(true)}
            disabled={isProcessing}
          >
            <QrCode className="h-6 w-6" />
            {isProcessing ? "Redirecting..." : "Open Scanner"}
          </Button>
          <p className="text-center text-xs text-muted-foreground px-4">
            Point your camera at any QR code containing a phone number to instantly bridge.
          </p>
        </div>
      </div>
      {/* Scanner Overlay */}
      <AnimatePresence>
        {isScanning && (
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
          >
            <QRScanner 
              onScanSuccess={handleScanSuccess} 
              onClose={() => setIsScanning(false)} 
            />
          </motion.div>
        )}
      </AnimatePresence>
      {/* Processing State */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="relative">
              <div className="w-20 h-20 border-4 border-emerald-100 dark:border-emerald-950 border-t-emerald-500 rounded-full animate-spin" />
              <MessageSquare className="absolute inset-0 m-auto h-8 w-8 text-emerald-500 animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold mt-8 text-foreground">Bridging to WhatsApp</h2>
            <p className="text-muted-foreground mt-2 max-w-xs">
              Sending your digital card to the scanned recipient.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      <Toaster richColors position="bottom-center" />
    </div>
  );
}