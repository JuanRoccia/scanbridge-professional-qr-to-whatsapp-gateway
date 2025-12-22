import React from "react";
import { Card } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  MessageCircle, 
  Download, 
  Share2, 
  Copy 
} from "lucide-react";
interface ShareButtonsProps {
  card: Card;
}
export function ShareButtons({ card }: ShareButtonsProps) {
  const cardUrl = `${window.location.origin}/card/${card.id}`;
  const shareText = `Te comparto mi tarjeta 👋\n\n${cardUrl}`;
  const handleWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };
  const handleDownload = () => {
    const link = document.createElement("a");
    link.download = `tarjeta-${card.name.replace(/\s+/g, '-').toLowerCase()}.jpg`;
    link.href = card.imageData;
    link.click();
    toast.success("Imagen descargada");
  };
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Tarjeta Digital - ${card.name}`,
          text: `Contacta con ${card.name} de ${card.company}`,
          url: cardUrl,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          copyToClipboard();
        }
      }
    } else {
      copyToClipboard();
    }
  };
  const copyToClipboard = () => {
    navigator.clipboard.writeText(cardUrl);
    toast.success("Enlace copiado al portapapeles");
  };
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-40">
      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/20 dark:border-zinc-800 rounded-full p-2 shadow-2xl flex items-center justify-between gap-2">
        <Button 
          variant="ghost" 
          className="rounded-full flex-1 h-12 gap-2 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/30"
          onClick={handleWhatsApp}
        >
          <MessageCircle className="h-5 w-5" />
          <span className="hidden sm:inline">WhatsApp</span>
        </Button>
        <div className="w-px h-6 bg-slate-200 dark:bg-zinc-800" />
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full h-12 w-12 text-slate-600 dark:text-slate-400"
          onClick={handleDownload}
          title="Descargar Imagen"
        >
          <Download className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full h-12 w-12 text-slate-600 dark:text-slate-400"
          onClick={copyToClipboard}
          title="Copiar Enlace"
        >
          <Copy className="h-5 w-5" />
        </Button>
        <Button 
          className="rounded-full flex-1 h-12 gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg"
          onClick={handleNativeShare}
        >
          <Share2 className="h-5 w-5" />
          <span className="hidden sm:inline">Compartir</span>
        </Button>
      </div>
    </div>
  );
}