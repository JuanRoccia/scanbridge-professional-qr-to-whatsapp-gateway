import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Toaster, toast } from "sonner";
import { Trash2, ExternalLink, Plus, LayoutDashboard, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import { listCards, deleteCard, saveCard, Card as CardType } from "@/lib/storage";
import { ImageUploader } from "@/components/cards/ImageUploader";
import { QRGenerator } from "@/components/cards/QRGenerator";
import { ThemeToggle } from "@/components/ThemeToggle";
export function AdminPage() {
  const [cards, setCards] = useState<CardType[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [imageData, setImageData] = useState<string | null>(null);
  const [createdCard, setCreatedCard] = useState<CardType | null>(null);
  useEffect(() => {
    setCards(listCards());
  }, []);
  const handleCreate = () => {
    if (!imageData) {
      toast.error("Por favor, sube una imagen para tu tarjeta.");
      return;
    }
    try {
      const newCard = saveCard({
        name: name || "Sin nombre",
        company: company || "Empresa genérica",
        imageData: imageData
      });
      setCards(listCards());
      setCreatedCard(newCard);
      toast.success("Tarjeta creada con éxito");
    } catch (e: any) {
      toast.error(e.message);
    }
  };
  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta tarjeta?")) {
      deleteCard(id);
      setCards(listCards());
      toast.info("Tarjeta eliminada");
    }
  };
  const resetForm = () => {
    setCreatedCard(null);
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
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <LayoutDashboard className="h-8 w-8 text-emerald-600" /> Panel de Tarjetas
            </h1>
            <p className="text-muted-foreground">Gestiona tus credenciales digitales de forma local.</p>
          </div>
          {!showCreate && cards.length < 10 && (
            <Button onClick={() => setShowCreate(true)} className="bg-emerald-600 hover:bg-emerald-700 gap-2">
              <Plus className="h-5 w-5" /> Crear Nueva
            </Button>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <span>Uso de Almacenamiento</span>
            <span>{cards.length} / 10 Tarjetas</span>
          </div>
          <Progress value={(cards.length / 10) * 100} className="h-2 bg-emerald-100 dark:bg-emerald-950/20" />
        </div>
        {showCreate ? (
          <Card className="border-emerald-200 dark:border-emerald-900 shadow-xl overflow-hidden">
            <CardHeader className="bg-emerald-50/50 dark:bg-emerald-950/20">
              <CardTitle>Nueva Tarjeta Digital</CardTitle>
              <CardDescription>Configura los detalles de tu nueva tarjeta profesional.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {createdCard ? (
                <div className="flex flex-col items-center space-y-6 animate-in fade-in zoom-in duration-300">
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-100 dark:border-emerald-800 text-center">
                    <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto mb-2" />
                    <h3 className="text-xl font-bold">¡Tarjeta Lista!</h3>
                    <p className="text-sm text-muted-foreground">Tu tarjeta ha sido guardada localmente.</p>
                  </div>
                  <QRGenerator cardId={createdCard.id} />
                  <div className="flex gap-4 w-full">
                    <Button variant="outline" className="flex-1" onClick={resetForm}>Volver al Panel</Button>
                    <Button asChild className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                      <Link to={`/card/${createdCard.id}`}>Ver Tarjeta</Link>
                    </Button>
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
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Empresa / Cargo</Label>
                      <Input 
                        id="company" 
                        placeholder="Ej. Maqsur Vial - Especialista" 
                        value={company} 
                        onChange={(e) => setCompany(e.target.value)}
                      />
                    </div>
                    <div className="pt-4 flex gap-3">
                      <Button variant="ghost" onClick={() => setShowCreate(false)}>Cancelar</Button>
                      <Button className="bg-emerald-600 hover:bg-emerald-700 flex-1" onClick={handleCreate}>Generar Tarjeta</Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Imagen de Tarjeta (JPG/PNG)</Label>
                    <ImageUploader onImageSelected={setImageData} />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.length === 0 ? (
              <div className="col-span-full py-20 text-center space-y-4 border-2 border-dashed rounded-3xl">
                <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto" />
                <div className="space-y-1">
                  <p className="text-lg font-medium">No tienes tarjetas aún</p>
                  <p className="text-sm text-muted-foreground">Crea tu primera tarjeta digital para empezar.</p>
                </div>
                <Button onClick={() => setShowCreate(true)} className="bg-emerald-600 hover:bg-emerald-700">Crear Mi Primera Tarjeta</Button>
              </div>
            ) : (
              cards.map((card) => (
                <Card key={card.id} className="group hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="aspect-[1.6/1] bg-muted overflow-hidden relative">
                    <img src={card.imageData} alt={card.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button asChild size="sm" className="bg-white text-black hover:bg-white/90">
                        <Link to={`/card/${card.id}`}><ExternalLink className="h-4 w-4 mr-1" /> Ver</Link>
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(card.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="text-base truncate">{card.name}</CardTitle>
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