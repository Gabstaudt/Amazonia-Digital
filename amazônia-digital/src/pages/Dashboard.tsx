import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapView } from '@/components/MapView';
import { lotesAPI, eventosAPI, auditoriaAPI, Lote } from '@/lib/mock-api';
import { TrendingUp, CheckCircle, Clock, AlertTriangle, Activity } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { StatusBadge } from '@/components/StatusBadge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const Dashboard = () => {
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [selectedLote, setSelectedLote] = useState<Lote | null>(null);

  useEffect(() => {
    setLotes(lotesAPI.getAll());
  }, []);

  // KPIs
  const transacoesAuditadas = auditoriaAPI.getAll().length;
  const conformidade = lotes.length > 0 ? Math.round((lotes.filter(l => l.status === 'conforme').length / lotes.length) * 100) : 0;
  const tempoMedio = 12; // minutos
  const alertasCriticos = lotes.filter(l => l.status === 'bloqueado').length;

  // Gráfico de linha - Tempo médio por semana (mock data)
  const tempoData = [
    { semana: 'S1', tempo: 15 },
    { semana: 'S2', tempo: 14 },
    { semana: 'S3', tempo: 13 },
    { semana: 'S4', tempo: 12 },
  ];

  // Gráfico de barras - Transações por cadeia
  const cadeiaData = [
    { cadeia: 'Madeira', total: lotes.filter(l => l.cadeia === 'madeira').length },
    { cadeia: 'Pescado', total: lotes.filter(l => l.cadeia === 'pescado').length },
    { cadeia: 'Cacau', total: lotes.filter(l => l.cadeia === 'cacau').length },
    { cadeia: 'Outro', total: lotes.filter(l => l.cadeia === 'outro').length },
  ];

  // Gráfico de pizza - Conformidade
  const complianceData = [
    { name: 'Conforme', value: lotes.filter(l => l.status === 'conforme').length, color: '#16a34a' },
    { name: 'Análise', value: lotes.filter(l => l.status === 'analise').length, color: '#eab308' },
    { name: 'Irregular', value: lotes.filter(l => l.status === 'irregular').length, color: '#f97316' },
    { name: 'Bloqueado', value: lotes.filter(l => l.status === 'bloqueado').length, color: '#dc2626' },
  ];

  // Mapa
  const mapPoints = lotes.map((lote) => ({
    id: lote.id,
    latitude: lote.latitude,
    longitude: lote.longitude,
    title: `${lote.codigo} - ${lote.cadeia}`,
    status: lote.status,
    onClick: () => setSelectedLote(lote),
  }));

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transações Auditadas</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transacoesAuditadas}</div>
            <p className="text-xs text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conformidade</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conformidade}%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 text-green-600" /> +2.5% vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio Verificação</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tempoMedio} min</div>
            <p className="text-xs text-muted-foreground">Por validação completa</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas Críticos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{alertasCriticos}</div>
            <p className="text-xs text-muted-foreground">Requerem atenção imediata</p>
          </CardContent>
        </Card>
      </div>

      {/* Mapa */}
      <Card>
        <CardHeader>
          <CardTitle>Mapa de Lotes Auditados</CardTitle>
        </CardHeader>
        <CardContent>
          <MapView points={mapPoints} height="400px" />
          <div className="mt-4 flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-600"></div>
              <span>Conforme</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-600"></div>
              <span>Análise</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-600"></div>
              <span>Irregular</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-600"></div>
              <span>Bloqueado</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tempo médio por semana */}
        <Card>
          <CardHeader>
            <CardTitle>Tempo Médio de Verificação</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={tempoData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="semana" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="tempo" stroke="#16a34a" name="Minutos" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Transações por cadeia */}
        <Card>
          <CardHeader>
            <CardTitle>Transações por Cadeia</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cadeiaData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="cadeia" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#0ea5e9" name="Total" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Conformidade (Pizza) */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Distribuição de Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={complianceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {complianceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
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
              Detalhes do lote selecionado
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
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
