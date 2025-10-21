import { auditoriaAPI } from '@/lib/mock-api';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const Auditoria = () => {
  const logs = auditoriaAPI.getAll().reverse();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Auditoria Blockchain</h1>
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Ação</TableHead>
                <TableHead>Hash</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                  <TableCell>{log.usuario}</TableCell>
                  <TableCell>{log.detalhes}</TableCell>
                  <TableCell className="font-mono text-xs">{log.hash.substring(0, 16)}...</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auditoria;
