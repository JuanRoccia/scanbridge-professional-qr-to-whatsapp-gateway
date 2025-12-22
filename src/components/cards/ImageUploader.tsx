import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { compressImage } from "@/lib/imageUtils";
import { toast } from "sonner";
interface ImageUploaderProps {
  onImageSelected: (base64: string | null) => void;
}
export function ImageUploader({ onImageSelected }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Imagen demasiado grande. Máximo 5MB.");
      return;
    }
    setIsProcessing(true);
    try {
      const compressed = await compressImage(file);
      setPreview(compressed);
      onImageSelected(compressed);
    } catch (err) {
      console.error(err);
      toast.error("Error al procesar la imagen.");
    } finally {
      setIsProcessing(false);
    }
  }, [onImageSelected]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': []
    },
    maxFiles: 1
  });
  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onImageSelected(null);
  };
  return (
    <div 
      {...getRootProps()} 
      className={cn(
        "relative min-h-[200px] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-4 transition-all cursor-pointer",
        isDragActive ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20" : "border-muted-foreground/20 hover:border-emerald-500/50",
        preview ? "p-0 overflow-hidden border-solid" : ""
      )}
    >
      <input {...getInputProps()} />
      {isProcessing ? (
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm font-medium">Comprimiendo...</p>
        </div>
      ) : preview ? (
        <div className="relative w-full h-full group">
          <img src={preview} alt="Vista previa" className="w-full h-48 object-contain bg-muted" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <p className="text-white text-xs font-bold uppercase tracking-widest">Haz clic para cambiar</p>
          </div>
          <button 
            onClick={removeImage}
            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center text-center space-y-3 p-4">
          <div className="p-3 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600">
            <Upload className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold">Haz clic o arrastra una imagen</p>
            <p className="text-xs text-muted-foreground">JPG, PNG o WebP hasta 5MB</p>
          </div>
        </div>
      )}
    </div>
  );
}