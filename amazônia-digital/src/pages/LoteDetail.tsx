import { useParams } from 'react-router-dom';
import { lotesAPI, eventosAPI } from '@/lib/mock-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/StatusBadge';
import { MapView } from '@/components/MapView';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const LoteDetail = () => {
  const { id } = useParams();
  const lote = lotesAPI.getById(id!);
  const eventos = eventosAPI.getByLoteId(id!);

  if (!lote) return <div className="p-6">Lote não encontrado</div>;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{lote.codigo}</h1>
          <p className="text-muted-foreground capitalize">{lote.cadeia}</p>
        </div>
        <StatusBadge status={lote.status} />
      </div>

      <Tabs defaultValue="resumo">
        <TabsList>
          <TabsTrigger value="resumo">Resumo</TabsTrigger>
          <TabsTrigger value="eventos">Eventos</TabsTrigger>
          <TabsTrigger value="mapa">Mapa</TabsTrigger>
        </TabsList>

        <TabsContent value="resumo">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Lote</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Volume</p>
                <p className="font-medium">{lote.volume} {lote.unidade}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <StatusBadge status={lote.status} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Origem</p>
                <p className="font-medium">{lote.origem}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Destino</p>
                <p className="font-medium">{lote.destino}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="eventos">
          <Card>
            <CardHeader>
              <CardTitle>Timeline de Eventos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {eventos.map((evento) => (
                  <div key={evento.id} className="border-l-2 border-primary pl-4 pb-4">
                    <p className="font-medium capitalize">{evento.tipo}</p>
                    <p className="text-sm text-muted-foreground">{evento.descricao}</p>
                    <p className="text-xs text-muted-foreground">{new Date(evento.timestamp).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mapa">
          <Card>
            <CardContent className="pt-6">
              <MapView
                points={[{
                  id: lote.id,
                  latitude: lote.latitude,
                  longitude: lote.longitude,
                  title: lote.codigo,
                  status: lote.status,
                }]}
                height="500px"
                center={[lote.latitude, lote.longitude]}
                zoom={8}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LoteDetail;
