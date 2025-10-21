import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapView } from '@/components/MapView';
import { StatusBadge } from '@/components/StatusBadge';
import { Leaf, Search, Filter, Download, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { lotesAPI, eventosAPI, Lote } from '@/lib/mock-api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const Explorar = () => {
  const navigate = useNavigate();
  const [searchId, setSearchId] = useState('');
  const [filterCadeia, setFilterCadeia] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedLote, setSelectedLote] = useState<Lote | null>(null);

  const allLotes = lotesAPI.getAll();
  
  const filteredLotes = allLotes.filter((lote) => {
    if (searchId && !lote.codigo.toLowerCase().includes(searchId.toLowerCase())) return false;
    if (filterCadeia !== 'all' && lote.cadeia !== filterCadeia) return false;
    if (filterStatus !== 'all' && lote.status !== filterStatus) return false;
    return true;
  });

  const mapPoints = filteredLotes.map((lote) => ({
    id: lote.id,
    latitude: lote.latitude,
    longitude: lote.longitude,
    title: `${lote.codigo} - ${lote.cadeia}`,
    status: lote.status,
    onClick: () => setSelectedLote(lote),
  }));

  const handleLoteClick = (lote: Lote) => {
    setSelectedLote(lote);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Leaf className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-primary">Amazônia Digital</span>
          </div>
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros e Busca
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por ID do lote..."
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  className="w-full pl-10"
                />
              </div>
              <Select value={filterCadeia} onValueChange={setFilterCadeia}>
                <SelectTrigger>
                  <SelectValue placeholder="Cadeia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as cadeias</SelectItem>
                  <SelectItem value="madeira">Madeira</SelectItem>
                  <SelectItem value="pescado">Pescado</SelectItem>
                  <SelectItem value="cacau">Cacau</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="conforme">Conforme</SelectItem>
                  <SelectItem value="analise">Em Análise</SelectItem>
                  <SelectItem value="irregular">Irregular</SelectItem>
                  <SelectItem value="bloqueado">Bloqueado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Exibindo {filteredLotes.length} de {allLotes.length} lotes
              </p>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Map */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Mapa de Rastreabilidade</CardTitle>
          </CardHeader>
          <CardContent>
            <MapView points={mapPoints} height="600px" />
          </CardContent>
        </Card>

        {/* Lotes List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLotes.map((lote) => (
            <Card
              key={lote.id}
              className="hover:shadow-lg transition-all cursor-pointer"
              onClick={() => handleLoteClick(lote)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{lote.codigo}</CardTitle>
                    <p className="text-sm text-muted-foreground capitalize">{lote.cadeia}</p>
                  </div>
                  <StatusBadge status={lote.status} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Volume:</span>
                    <span className="font-medium">{lote.volume} {lote.unidade}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Origem:</span>
                    <span className="font-medium truncate ml-2">{lote.origem}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Destino:</span>
                    <span className="font-medium truncate ml-2">{lote.destino}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Lote Detail Modal */}
      <Dialog open={!!selectedLote} onOpenChange={() => setSelectedLote(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedLote?.codigo}</span>
              {selectedLote && <StatusBadge status={selectedLote.status} />}
            </DialogTitle>
            <DialogDescription>
              Detalhes completos do lote
            </DialogDescription>
          </DialogHeader>
          {selectedLote && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Cadeia</p>
                  <p className="font-medium capitalize">{selectedLote.cadeia}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Volume</p>
                  <p className="font-medium">{selectedLote.volume} {selectedLote.unidade}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Origem</p>
                  <p className="font-medium">{selectedLote.origem}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Destino</p>
                  <p className="font-medium">{selectedLote.destino}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-2">Localização no Mapa</p>
                <MapView
                  points={[{
                    id: selectedLote.id,
                    latitude: selectedLote.latitude,
                    longitude: selectedLote.longitude,
                    title: selectedLote.codigo,
                    status: selectedLote.status,
                  }]}
                  height="300px"
                  center={[selectedLote.latitude, selectedLote.longitude]}
                  zoom={8}
                />
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Documentos</p>
                <div className="flex flex-wrap gap-2">
                  {selectedLote.documentos.length > 0 ? (
                    selectedLote.documentos.map((doc, i) => (
                      <Button key={i} variant="outline" size="sm">
                        <Download className="mr-2 h-3 w-3" />
                        {doc}
                      </Button>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">Nenhum documento anexado</p>
                  )}
                </div>
              </div>

              <Button onClick={() => navigate('/login')} className="w-full">
                Fazer login para ver mais detalhes
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Explorar;
