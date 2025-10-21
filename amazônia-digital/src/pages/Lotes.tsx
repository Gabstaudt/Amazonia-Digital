import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/StatusBadge';
import { lotesAPI, eventosAPI, complianceEngine, Lote } from '@/lib/mock-api';
import { Plus, Edit, Trash, FileText, CheckCircle, Upload, Download, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

const Lotes = () => {
  const navigate = useNavigate();
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isValidateModalOpen, setIsValidateModalOpen] = useState(false);
  const [selectedLote, setSelectedLote] = useState<Lote | null>(null);
  const [validationResult, setValidationResult] = useState<{ status: string; messages: string[] } | null>(null);

  const [formData, setFormData] = useState({
    codigo: '',
    cadeia: 'madeira' as 'madeira' | 'pescado' | 'cacau' | 'outro',
    volume: 0,
    unidade: 'm³',
    origem: '',
    destino: '',
    latitude: -3.4653,
    longitude: -62.2159,
    status: 'analise' as 'conforme' | 'analise' | 'irregular' | 'bloqueado',
    documentos: [] as string[],
    licencas: [] as string[],
  });

  const [eventFormData, setEventFormData] = useState({
    tipo: 'transporte' as 'criacao' | 'transporte' | 'processamento' | 'certificacao' | 'venda',
    descricao: '',
    volume: 0,
    latitude: -3.4653,
    longitude: -62.2159,
  });

  useEffect(() => {
    loadLotes();
  }, []);

  const loadLotes = () => {
    setLotes(lotesAPI.getAll());
  };

  const filteredLotes = lotes.filter((lote) =>
    lote.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lote.cadeia.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lote.origem.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    if (!formData.codigo || !formData.origem || !formData.destino) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    lotesAPI.create(formData);
    toast.success('Lote criado com sucesso!');
    setIsCreateModalOpen(false);
    resetForm();
    loadLotes();
  };

  const handleEdit = () => {
    if (!selectedLote) return;
    
    lotesAPI.update(selectedLote.id, formData);
    toast.success('Lote atualizado com sucesso!');
    setIsEditModalOpen(false);
    resetForm();
    loadLotes();
  };

  const handleDelete = () => {
    if (!selectedLote) return;
    
    lotesAPI.delete(selectedLote.id);
    toast.success('Lote removido com sucesso!');
    setIsDeleteModalOpen(false);
    setSelectedLote(null);
    loadLotes();
  };

  const handleAddEvent = () => {
    if (!selectedLote || !eventFormData.descricao) {
      toast.error('Preencha todos os campos');
      return;
    }

    eventosAPI.create({
      loteId: selectedLote.id,
      ...eventFormData,
      timestamp: new Date().toISOString(),
      usuario: 'Usuário Atual',
    });

    toast.success('Evento registrado com sucesso!');
    setIsEventModalOpen(false);
    resetEventForm();
  };

  const handleValidate = () => {
    if (!selectedLote) return;

    const eventos = eventosAPI.getByLoteId(selectedLote.id);
    const result = complianceEngine.validateLote(selectedLote, eventos);
    
    // Update lote status
    const updateStatus = result.status as 'conforme' | 'analise' | 'irregular' | 'bloqueado';
    lotesAPI.update(selectedLote.id, { status: updateStatus });
    
    setValidationResult(result);
    toast.success('Validação concluída!');
    loadLotes();
  };

  const openCreateModal = () => {
    resetForm();
    setIsCreateModalOpen(true);
  };

  const openEditModal = (lote: Lote) => {
    setSelectedLote(lote);
    setFormData({
      codigo: lote.codigo,
      cadeia: lote.cadeia,
      volume: lote.volume,
      unidade: lote.unidade,
      origem: lote.origem,
      destino: lote.destino,
      latitude: lote.latitude,
      longitude: lote.longitude,
      status: lote.status,
      documentos: lote.documentos,
      licencas: lote.licencas,
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (lote: Lote) => {
    setSelectedLote(lote);
    setIsDeleteModalOpen(true);
  };

  const openEventModal = (lote: Lote) => {
    setSelectedLote(lote);
    resetEventForm();
    setIsEventModalOpen(true);
  };

  const openValidateModal = (lote: Lote) => {
    setSelectedLote(lote);
    setValidationResult(null);
    setIsValidateModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      codigo: '',
      cadeia: 'madeira',
      volume: 0,
      unidade: 'm³',
      origem: '',
      destino: '',
      latitude: -3.4653,
      longitude: -62.2159,
      status: 'analise',
      documentos: [],
      licencas: [],
    });
  };

  const resetEventForm = () => {
    setEventFormData({
      tipo: 'transporte',
      descricao: '',
      volume: 0,
      latitude: -3.4653,
      longitude: -62.2159,
    });
  };

  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        let imported = 0;
        results.data.forEach((row: any) => {
          if (row.codigo && row.cadeia && row.volume) {
            lotesAPI.create({
              codigo: row.codigo,
              cadeia: row.cadeia,
              volume: parseFloat(row.volume),
              unidade: row.unidade || 'm³',
              origem: row.origem || 'N/A',
              destino: row.destino || 'N/A',
              latitude: parseFloat(row.latitude) || -3.4653,
              longitude: parseFloat(row.longitude) || -62.2159,
              status: 'analise',
              documentos: [],
              licencas: [],
            });
            imported++;
          }
        });
        toast.success(`${imported} lotes importados com sucesso!`);
        loadLotes();
      },
    });
  };

  const handleExportXLSX = () => {
    const ws = XLSX.utils.json_to_sheet(filteredLotes);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Lotes');
    XLSX.writeFile(wb, 'lotes.xlsx');
    toast.success('Arquivo exportado com sucesso!');
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Gestão de Lotes</h1>
          <p className="text-muted-foreground">Gerenciar lotes e registrar eventos</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept=".csv"
            onChange={handleImportCSV}
            className="hidden"
            id="import-csv"
          />
          <Button variant="outline" onClick={() => document.getElementById('import-csv')?.click()}>
            <Upload className="mr-2 h-4 w-4" />
            Importar CSV
          </Button>
          <Button variant="outline" onClick={handleExportXLSX}>
            <Download className="mr-2 h-4 w-4" />
            Exportar XLSX
          </Button>
          <Button onClick={openCreateModal}>
            <Plus className="mr-2 h-4 w-4" />
            Criar Lote
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar lotes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Cadeia</TableHead>
                <TableHead>Volume</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLotes.map((lote) => (
                <TableRow key={lote.id}>
                  <TableCell className="font-medium">{lote.codigo}</TableCell>
                  <TableCell className="capitalize">{lote.cadeia}</TableCell>
                  <TableCell>{lote.volume} {lote.unidade}</TableCell>
                  <TableCell>{lote.origem}</TableCell>
                  <TableCell>
                    <StatusBadge status={lote.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/app/lotes/${lote.id}`)}>
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openEventModal(lote)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openValidateModal(lote)}>
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openEditModal(lote)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openDeleteModal(lote)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Novo Lote</DialogTitle>
            <DialogDescription>Preencha os dados do lote</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Código*</Label>
              <Input value={formData.codigo} onChange={(e) => setFormData({ ...formData, codigo: e.target.value })} />
            </div>
            <div>
              <Label>Cadeia*</Label>
              <Select value={formData.cadeia} onValueChange={(value: any) => setFormData({ ...formData, cadeia: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="madeira">Madeira</SelectItem>
                  <SelectItem value="pescado">Pescado</SelectItem>
                  <SelectItem value="cacau">Cacau</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Volume*</Label>
                <Input type="number" value={formData.volume} onChange={(e) => setFormData({ ...formData, volume: parseFloat(e.target.value) })} />
              </div>
              <div>
                <Label>Unidade</Label>
                <Input value={formData.unidade} onChange={(e) => setFormData({ ...formData, unidade: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>Origem*</Label>
              <Input value={formData.origem} onChange={(e) => setFormData({ ...formData, origem: e.target.value })} />
            </div>
            <div>
              <Label>Destino*</Label>
              <Input value={formData.destino} onChange={(e) => setFormData({ ...formData, destino: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreate}>Criar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Lote</DialogTitle>
            <DialogDescription>Atualize os dados do lote</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Código*</Label>
              <Input value={formData.codigo} onChange={(e) => setFormData({ ...formData, codigo: e.target.value })} />
            </div>
            <div>
              <Label>Volume*</Label>
              <Input type="number" value={formData.volume} onChange={(e) => setFormData({ ...formData, volume: parseFloat(e.target.value) })} />
            </div>
            <div>
              <Label>Origem*</Label>
              <Input value={formData.origem} onChange={(e) => setFormData({ ...formData, origem: e.target.value })} />
            </div>
            <div>
              <Label>Destino*</Label>
              <Input value={formData.destino} onChange={(e) => setFormData({ ...formData, destino: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleEdit}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o lote <strong>{selectedLote?.codigo}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDelete}>Excluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Event Modal */}
      <Dialog open={isEventModalOpen} onOpenChange={setIsEventModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Evento</DialogTitle>
            <DialogDescription>Adicionar novo evento ao lote {selectedLote?.codigo}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Tipo de Evento</Label>
              <Select value={eventFormData.tipo} onValueChange={(value: any) => setEventFormData({ ...eventFormData, tipo: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="criacao">Criação</SelectItem>
                  <SelectItem value="transporte">Transporte</SelectItem>
                  <SelectItem value="processamento">Processamento</SelectItem>
                  <SelectItem value="certificacao">Certificação</SelectItem>
                  <SelectItem value="venda">Venda</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Descrição*</Label>
              <Input value={eventFormData.descricao} onChange={(e) => setEventFormData({ ...eventFormData, descricao: e.target.value })} />
            </div>
            <div>
              <Label>Volume (opcional)</Label>
              <Input type="number" value={eventFormData.volume} onChange={(e) => setEventFormData({ ...eventFormData, volume: parseFloat(e.target.value) })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEventModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddEvent}>Registrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Validate Modal */}
      <Dialog open={isValidateModalOpen} onOpenChange={setIsValidateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Validar Compliance</DialogTitle>
            <DialogDescription>Executar motor de regras para o lote {selectedLote?.codigo}</DialogDescription>
          </DialogHeader>
          {!validationResult ? (
            <div className="text-center py-8">
              <Button onClick={handleValidate}>Executar Validação</Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <StatusBadge status={validationResult.status as any} />
              </div>
              <div className="space-y-2">
                {validationResult.messages.map((msg, i) => (
                  <p key={i} className="text-sm">{msg}</p>
                ))}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsValidateModalOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Lotes;
