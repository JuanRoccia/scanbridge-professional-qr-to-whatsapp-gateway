import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Toaster, toast } from "sonner";
import { Trash2, ExternalLink, Plus, LayoutDashboard, Image as ImageIcon, CheckCircle2, Loader2 } from "lucide-react";
import { useCards, useCreateCard, useDeleteCard } from "@/lib/api";
import { setLocalPrimaryCardId, getLocalPrimaryCardId } from "@/lib/storage";
import { ImageUploader } from "@/components/cards/ImageUploader";
import { QRGenerator } from "@/components/cards/QRGenerator";
import { ThemeToggle } from "@/components/ThemeToggle";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
export function AdminPage() {
  const { data: cards = [], isLoading: isLoadingCards } = useCards();
  const createMutation = useCreateCard();
  const deleteMutation = useDeleteCard();
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [imageData, setImageData] = useState<string | null>(null);
  const [createdCardId, setCreatedCardId] = useState<string | null>(null);
  const handleCreate = async () => {
    if (!imageData) {
      toast.error("Por favor, sube una imagen para tu tarjeta.");
      return;
    }
    try {
      const newCard = await createMutation.mutateAsync({
        name: name || "Sin nombre",
        company: company || "Empresa genérica",
        imageData: imageData
      });
      setCreatedCardId(newCard.id);
      setLocalPrimaryCardId(newCard.id); 
      toast.success("Tarjeta guardada en la nube");
    } catch (e: any) {
      toast.error(e.message || "Error al conectar con el servidor");
    }
  };
  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar esta tarjeta de la nube?")) {
      try {
        await deleteMutation.mutateAsync(id);
        const currentPrimary = getLocalPrimaryCardId();
        if (currentPrimary === id) {
          localStorage.removeItem('sb_primary_card_id');
        }
        toast.info("Tarjeta eliminada");
      } catch (e: any) {
        toast.error("No se pudo eliminar la tarjeta");
      }
    }
  };
  const resetForm = () => {
    setCreatedCardId(null);
    setShowCreate(false);
    setName("");
    setCompany("");
    setImageData(null);
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 min-h-screen flex flex-col space-y-8">
        <ThemeToggle />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2 text-foreground">
              <LayoutDashboard className="h-8 w-8 text-emerald-600" /> Panel Cloud
            </h1>
            <p className="text-muted-foreground">Tus tarjetas ahora están disponibles globalmente.</p>
          </div>
          {!showCreate && cards.length < 10 && (
            <Button onClick={() => setShowCreate(true)} className="bg-emerald-600 hover:bg-emerald-700 gap-2 shadow-lg">
              <Plus className="h-5 w-5" /> Crear Nueva
            </Button>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <span>Uso de Almacenamiento Cloud</span>
            <span>{cards.length} / 10 Tarjetas</span>
          </div>
          <Progress value={(cards.length / 10) * 100} className="h-2 bg-emerald-100 dark:bg-emerald-950/20" />
        </div>
        {showCreate ? (
          <Card className="border-emerald-200 dark:border-emerald-900 shadow-xl overflow-hidden">
            <CardHeader className="bg-emerald-50/50 dark:bg-emerald-950/20 border-b">
              <CardTitle>Nueva Tarjeta Digital Cloud</CardTitle>
              <CardDescription>Sube tu diseño para compartirlo en cualquier lugar.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {createdCardId ? (
                <div className="flex flex-col items-center space-y-6 animate-in fade-in zoom-in duration-300">
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-100 dark:border-emerald-800 text-center w-full max-w-sm">
                    <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto mb-2" />
                    <h3 className="text-xl font-bold">¡Publicada con éxito!</h3>
                    <p className="text-sm text-muted-foreground">Tu tarjeta ya tiene un enlace único.</p>
                  </div>
                  <QRGenerator cardId={createdCardId} />
                  <div className="flex gap-4 w-full max-w-sm">
                    <Button variant="outline" className="flex-1" onClick={resetForm}>Panel</Button>
                    <Link to={`/card/${createdCardId}`} className={cn(buttonVariants({}), "flex-1 bg-emerald-600 hover:bg-emerald-700")}>
                      Ver Online
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre Completo</Label>
                      <Input
                        id="name"
                        placeholder="Ej. Gonzalo Martínez Gómez"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={createMutation.isPending}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Empresa / Cargo</Label>
                      <Input
                        id="company"
                        placeholder="Ej. Maqsur Vial - Especialista"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        disabled={createMutation.isPending}
                      />
                    </div>
                    <div className="pt-4 flex gap-3">
                      <Button variant="ghost" onClick={() => setShowCreate(false)} disabled={createMutation.isPending}>Cancelar</Button>
                      <Button
                        className="bg-emerald-600 hover:bg-emerald-700 flex-1 gap-2"
                        onClick={handleCreate}
                        disabled={createMutation.isPending}
                      >
                        {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                        {createMutation.isPending ? 'Subiendo...' : 'Publicar Tarjeta'}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Imagen de Tarjeta (JPG/PNG - Max 1MB)</Label>
                    <ImageUploader onImageSelected={setImageData} />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ) : isLoadingCards ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-12 w-12 text-emerald-500 animate-spin" />
            <p className="text-muted-foreground font-medium">Sincronizando con la nube...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.length === 0 ? (
              <div className="col-span-full py-20 text-center space-y-4 border-2 border-dashed rounded-3xl bg-muted/20">
                <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto" />
                <div className="space-y-1">
                  <p className="text-lg font-medium">No hay tarjetas en tu cuenta</p>
                  <p className="text-sm text-muted-foreground">Crea una para que se guarde permanentemente en la nube.</p>
                </div>
                <Button onClick={() => setShowCreate(true)} className="bg-emerald-600 hover:bg-emerald-700 shadow-md">Crear Mi Primera Tarjeta</Button>
              </div>
            ) : (
              cards.map((card) => (
                <Card key={card.id} className="group hover:shadow-lg transition-shadow overflow-hidden relative border-zinc-200 dark:border-zinc-800">
                  <div className="aspect-[1.6/1] bg-muted overflow-hidden relative">
                    <img src={card.imageData} alt={card.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                      <Link to={`/card/${card.id}`} className={cn(buttonVariants({ size: "sm" }), "bg-white text-black hover:bg-white/90 font-bold")}>
                        <ExternalLink className="h-4 w-4 mr-1" /> Ver Online
                      </Link>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => handleDelete(card.id)} 
                        disabled={deleteMutation.isPending}
                      >
                        {deleteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <CardHeader className="p-4 bg-white dark:bg-zinc-900 border-t">
                    <CardTitle className="text-base truncate text-foreground">{card.name}</CardTitle>
                    <CardDescription className="text-xs truncate">{card.company}</CardDescription>
                  </CardHeader>
                </Card>
              ))
            )}
          </div>
        )}
        <Toaster richColors position="bottom-center" />
      </div>
    </div>
  );
}