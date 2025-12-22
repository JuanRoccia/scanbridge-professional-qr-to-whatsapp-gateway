import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { 
  ArrowRight, 
  Upload, 
  QrCode, 
  Share2, 
  ShieldCheck, 
  Zap, 
  Smartphone 
} from "lucide-react";
import { motion } from "framer-motion";
export function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 min-h-screen flex flex-col">
        <ThemeToggle />
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center space-y-6 pt-12 pb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-sm font-medium border border-emerald-200 dark:border-emerald-800"
          >
            <Zap className="h-4 w-4" /> Nueva Era de Networking
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground max-w-3xl"
          >
            Transforma tu Imagen <span className="text-emerald-600">Profesional</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl"
          >
            Crea, gestiona y comparte tu tarjeta de presentación digital en segundos. Sin aplicaciones pesadas, solo escanea y conecta.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 h-14 text-lg font-bold gap-2">
              <Link to="/admin">Empezar Ahora <ArrowRight className="h-5 w-5" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8 h-14 text-lg">
              <a href="#how-it-works">Saber Más</a>
            </Button>
          </motion.div>
        </section>
        {/* How it Works */}
        <section id="how-it-works" className="py-20 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Cómo Funciona</h2>
            <p className="text-muted-foreground">Tres pasos simples para digitalizar tu presencia.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Upload, title: "1. Sube tu imagen", desc: "Carga tu tarjeta física actual o un diseño profesional." },
              { icon: QrCode, title: "2. Genera tu QR", desc: "Creamos un código único que enlaza a tu tarjeta digital." },
              { icon: Share2, title: "3. Comparte y Conecta", desc: "Muestra tu QR y permite que guarden tu contacto al instante." }
            ].map((step, i) => (
              <div key={i} className="bg-card p-8 rounded-2xl border shadow-sm flex flex-col items-center text-center space-y-4">
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl text-emerald-600">
                  <step.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>
        {/* Features */}
        <section className="py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Por qué elegir ScanBridge</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="mt-1"><ShieldCheck className="h-6 w-6 text-emerald-600" /></div>
                <div>
                  <h4 className="font-bold">Privacidad Total</h4>
                  <p className="text-sm text-muted-foreground">Tus datos se guardan solo en tu navegador. Nada se sube a servidores externos.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1"><Smartphone className="h-6 w-6 text-emerald-600" /></div>
                <div>
                  <h4 className="font-bold">Optimizado para Móvil</h4>
                  <p className="text-sm text-muted-foreground">Diseño ligero y rápido, perfecto para compartir en ferias o reuniones.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1"><Zap className="h-6 w-6 text-emerald-600" /></div>
                <div>
                  <h4 className="font-bold">Sin Suscripciones</h4>
                  <p className="text-sm text-muted-foreground">Herramienta 100% gratuita para profesionales independientes.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative aspect-square rounded-3xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center p-12 overflow-hidden border">
             <QrCode className="w-full h-full text-emerald-600/20 absolute -rotate-12 -bottom-20 -right-20" />
             <div className="z-10 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-2xl border transform rotate-3">
                <div className="w-48 h-64 bg-slate-100 dark:bg-zinc-800 rounded-lg flex flex-col p-4 space-y-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500" />
                  <div className="h-3 w-3/4 bg-slate-200 dark:bg-zinc-700 rounded" />
                  <div className="h-2 w-1/2 bg-slate-200 dark:bg-zinc-700 rounded" />
                  <div className="mt-auto h-20 w-full bg-emerald-100 dark:bg-emerald-900/40 rounded flex items-center justify-center">
                    <QrCode className="h-8 w-8 text-emerald-600" />
                  </div>
                </div>
             </div>
          </div>
        </section>
        <footer className="mt-auto pt-20 pb-8 border-t text-center space-y-4">
          <p className="text-sm text-muted-foreground font-medium">ScanBridge &copy; 2024 - Sistema de Tarjetas Digitales</p>
          <div className="flex justify-center gap-6 text-xs text-muted-foreground uppercase tracking-widest">
            <Link to="/" className="hover:text-emerald-600">Inicio</Link>
            <Link to="/admin" className="hover:text-emerald-600">Panel de Control</Link>
            <a href="#" className="hover:text-emerald-600">Privacidad</a>
          </div>
        </footer>
      </div>
    </div>
  );
}