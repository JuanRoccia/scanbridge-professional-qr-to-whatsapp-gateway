import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getCard, Card } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { ShareButtons } from "@/components/cards/ShareButtons";
import { AlertCircle, ArrowLeft, QrCode } from "lucide-react";
import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
export function CardPage() {
  const { id } = useParams<{ id: string }>();
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (id) {
      const loadedCard = getCard(id);
      setCard(loadedCard);
    }
    setLoading(false);
  }, [id]);
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" />
      </div>
    );
  }
  if (!card) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-6">
        <AlertCircle className="h-16 w-16 text-red-500" />
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Tarjeta No Encontrada</h1>
          <p className="text-muted-foreground max-w-xs">El enlace es inválido o la tarjeta ha sido eliminada.</p>
        </div>
        <Link to="/" className={cn(buttonVariants({}), "bg-emerald-600")}>
          Volver al Inicio
        </Link>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl space-y-8"
        >
          <div className="flex items-center justify-between">
            <Link to="/admin" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-2")}>
              <ArrowLeft className="h-4 w-4" /> Panel
            </Link>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">ScanBridge</span>
              <span className="text-[8px] text-muted-foreground">Digital Card ID: {card?.id?.split('-')[0] || 'N/A'}</span>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-4 bg-emerald-500/10 blur-2xl rounded-[3rem] opacity-50" />
            <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-white/20 dark:border-zinc-800 bg-white dark:bg-zinc-900 aspect-[1.6/1]">
              <img
                src={card.imageData || ''}
                alt={card.name || 'Card'}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-foreground">{card.name || 'N/A'}</h1>
            <p className="text-emerald-600 dark:text-emerald-400 font-medium">{card.company || ''}</p>
          </div>
        </motion.div>
      </div>
      <ShareButtons card={card} />
      <footer className="py-8 text-center">
        <Link to="/" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-emerald-600 font-medium uppercase tracking-widest transition-colors">
          <QrCode className="h-3 w-3" /> Creado con ScanBridge
        </Link>
      </footer>
    </div>
  );
}