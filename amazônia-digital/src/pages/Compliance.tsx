import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { regrasAPI, Regra } from '@/lib/mock-api';
import { Plus, Edit, Trash } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const Compliance = () => {
  const [regras, setRegras] = useState<Regra[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRegra, setEditingRegra] = useState<Regra | null>(null);
  const [formData, setFormData] = useState({ nome: '', cadeia: 'madeira', severidade: 'alerta' as 'info' | 'alerta' | 'bloqueio', condicao: '', acao: '', ativo: true });

  useEffect(() => { loadRegras(); }, []);
  const loadRegras = () => setRegras(regrasAPI.getAll());

  const handleSave = () => {
    if (editingRegra) {
      regrasAPI.update(editingRegra.id, formData);
      toast.success('Regra atualizada!');
    } else {
      regrasAPI.create(formData);
      toast.success('Regra criada!');
    }
    setIsModalOpen(false);
    loadRegras();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Regras de Compliance</h1>
        <Button onClick={() => { setEditingRegra(null); setFormData({ nome: '', cadeia: 'madeira', severidade: 'alerta', condicao: '', acao: '', ativo: true }); setIsModalOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />Criar Regra
        </Button>
      </div>
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Cadeia</TableHead>
                <TableHead>Severidade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {regras.map((regra) => (
                <TableRow key={regra.id}>
                  <TableCell className="font-medium">{regra.nome}</TableCell>
                  <TableCell className="capitalize">{regra.cadeia}</TableCell>
                  <TableCell className="capitalize">{regra.severidade}</TableCell>
                  <TableCell>{regra.ativo ? '✅ Ativo' : '❌ Inativo'}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => { setEditingRegra(regra); setFormData(regra); setIsModalOpen(true); }}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => { regrasAPI.delete(regra.id); toast.success('Regra removida!'); loadRegras(); }}><Trash className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingRegra ? 'Editar' : 'Criar'} Regra</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Nome</Label><Input value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} /></div>
            <div><Label>Cadeia</Label><Select value={formData.cadeia} onValueChange={(value) => setFormData({ ...formData, cadeia: value })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="madeira">Madeira</SelectItem><SelectItem value="pescado">Pescado</SelectItem><SelectItem value="cacau">Cacau</SelectItem></SelectContent></Select></div>
            <div><Label>Severidade</Label><Select value={formData.severidade} onValueChange={(value: any) => setFormData({ ...formData, severidade: value })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="info">Info</SelectItem><SelectItem value="alerta">Alerta</SelectItem><SelectItem value="bloqueio">Bloqueio</SelectItem></SelectContent></Select></div>
            <div><Label>Condição</Label><Input value={formData.condicao} onChange={(e) => setFormData({ ...formData, condicao: e.target.value })} /></div>
            <div><Label>Ação</Label><Input value={formData.acao} onChange={(e) => setFormData({ ...formData, acao: e.target.value })} /></div>
            <div className="flex items-center gap-2"><Switch checked={formData.ativo} onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })} /><Label>Ativo</Label></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button><Button onClick={handleSave}>Salvar</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Compliance;
