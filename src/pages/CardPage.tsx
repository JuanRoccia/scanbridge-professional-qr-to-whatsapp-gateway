import React from "react";
import { useParams, Link } from "react-router-dom";
import { useCard } from "@/lib/api";
import { ShareButtons } from "@/components/cards/ShareButtons";
import { AlertCircle, ArrowLeft, QrCode, Loader2, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
export function CardPage() {
  const { id } = useParams<{ id: string }>();
  const { data: card, isLoading, isError } = useCard(id);
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-zinc-50 dark:bg-zinc-950">
        <Loader2 className="h-12 w-12 text-emerald-500 animate-spin" />
        <p className="text-muted-foreground font-medium animate-pulse">Cargando tarjeta digital...</p>
      </div>
    );
  }
  if (isError || !card) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-6 bg-zinc-50 dark:bg-zinc-950">
        <div className="p-6 bg-red-50 dark:bg-red-950/20 rounded-full">
           <AlertCircle className="h-16 w-16 text-red-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Tarjeta No Encontrada</h1>
          <p className="text-muted-foreground max-w-xs mx-auto">El enlace puede haber expirado o la tarjeta fue eliminada del servidor.</p>
        </div>
        <Link to="/" className={cn(buttonVariants({ size: "lg" }), "bg-emerald-600 hover:bg-emerald-700 shadow-lg px-8")}>
          Volver al Inicio
        </Link>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col selection:bg-emerald-200">
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl space-y-8"
        >
          <div className="flex items-center justify-between">
            <Link to="/admin" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-2 hover:bg-emerald-50 dark:hover:bg-emerald-950/20")}>
              <ArrowLeft className="h-4 w-4" /> Mis Tarjetas
            </Link>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 flex items-center gap-1">
                <Globe className="h-2 w-2" /> ScanBridge Cloud
              </span>
              <span className="text-[8px] text-muted-foreground uppercase font-mono">{card.id.split('-')[0]}</span>
            </div>
          </div>
          <div className="relative group">
            {/* Glossy Reflection Effect */}
            <div className="absolute -inset-1 bg-gradient-to-br from-emerald-500/20 via-transparent to-teal-500/20 rounded-[2rem] blur-xl opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-white/40 dark:border-zinc-800 bg-white dark:bg-zinc-900 aspect-[1.6/1] ring-1 ring-black/5">
              <img
                src={card.imageData}
                alt={card.name}
                className="w-full h-full object-contain bg-zinc-100 dark:bg-zinc-800/50"
              />
            </div>
          </div>
          <div className="text-center space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-200">
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">{card.name}</h1>
            <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800">
              <p className="text-emerald-700 dark:text-emerald-400 font-bold text-sm tracking-wide">{card.company}</p>
            </div>
          </div>
        </motion.div>
      </div>
      <ShareButtons card={card} />
      <footer className="py-12 text-center">
        <Link to="/" className="inline-flex items-center gap-2 text-[10px] text-muted-foreground hover:text-emerald-600 font-bold uppercase tracking-[0.2em] transition-all">
          <QrCode className="h-3 w-3" /> Powered by ScanBridge
        </Link>
      </footer>
    </div>
  );
}