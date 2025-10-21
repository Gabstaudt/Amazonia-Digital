import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Leaf, Download, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Sobre = () => {
  const navigate = useNavigate();

  const handleDownloadBanner = () => {
    toast.success('Banner baixado com sucesso!');
    // In a real scenario, would trigger actual file download
  };

  const handleDownloadArtigo = () => {
    toast.success('Artigo baixado com sucesso!');
    // In a real scenario, would trigger actual file download
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

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-primary mb-8">Sobre o Projeto</h1>

        <Card className="mb-8">
          <CardContent className="prose prose-lg max-w-none pt-6">
            <h2 className="text-2xl font-bold text-primary mb-4">O Modelo Conceitual</h2>
            
            <p className="text-foreground leading-relaxed mb-4">
              <strong>Amazônia Digital</strong> é um sistema inovador de gestão sustentável que combina tecnologia blockchain, 
              compliance ambiental automatizado e rastreabilidade pública para revolucionar a forma como gerenciamos 
              recursos naturais na região amazônica.
            </p>

            <h3 className="text-xl font-bold text-primary mt-6 mb-3">Pilares do Sistema</h3>
            
            <div className="space-y-4">
              <div className="bg-primary/5 p-4 rounded-lg">
                <h4 className="font-bold text-primary mb-2">1. Blockchain Imutável</h4>
                <p className="text-foreground">
                  Cada transação é registrada em uma cadeia de blocos criptograficamente segura, garantindo que 
                  o histórico completo seja imutável e verificável por qualquer parte interessada.
                </p>
              </div>

              <div className="bg-secondary/5 p-4 rounded-lg">
                <h4 className="font-bold text-secondary mb-2">2. Compliance Automático</h4>
                <p className="text-foreground">
                  Motor de regras customizável que valida automaticamente cada operação contra requisitos ambientais, 
                  detectando irregularidades em tempo real e prevenindo violações antes que ocorram.
                </p>
              </div>

              <div className="bg-accent/5 p-4 rounded-lg">
                <h4 className="font-bold text-foreground mb-2">3. Rastreabilidade Pública</h4>
                <p className="text-foreground">
                  Interface pública que permite a qualquer cidadão verificar a origem, trajeto e conformidade de 
                  produtos amazônicos, promovendo transparência e accountability.
                </p>
              </div>
            </div>

            <h3 className="text-xl font-bold text-primary mt-6 mb-3">Benefícios</h3>
            
            <ul className="space-y-2 text-foreground">
              <li>✅ <strong>Transparência Total:</strong> Auditoria pública de toda a cadeia produtiva</li>
              <li>✅ <strong>Prevenção de Fraudes:</strong> Impossibilidade de adulteração de registros históricos</li>
              <li>✅ <strong>Compliance Garantido:</strong> Validação automática contra legislação ambiental</li>
              <li>✅ <strong>Rastreabilidade Completa:</strong> Do produtor ao consumidor final</li>
              <li>✅ <strong>Sustentabilidade:</strong> Incentivo a práticas ambientalmente responsáveis</li>
            </ul>

            <h3 className="text-xl font-bold text-primary mt-6 mb-3">Casos de Uso</h3>
            
            <p className="text-foreground">
              O sistema pode ser aplicado a diversas cadeias produtivas amazônicas:
            </p>
            
            <ul className="space-y-2 text-foreground">
              <li>🌲 <strong>Madeira:</strong> Controle de volume, origem legal e transporte</li>
              <li>🐟 <strong>Pescado:</strong> Monitoramento de defeso e práticas sustentáveis</li>
              <li>🍫 <strong>Cacau:</strong> Certificação orgânica e rastreamento de qualidade</li>
              <li>🌿 <strong>Produtos Florestais:</strong> Extrativismo sustentável e comércio justo</li>
            </ul>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-4">
          <Card className="bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer" onClick={handleDownloadBanner}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <Download className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">Banner Institucional</h3>
                  <p className="text-sm text-muted-foreground">Material gráfico para apresentações</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-secondary/5 hover:bg-secondary/10 transition-colors cursor-pointer" onClick={handleDownloadArtigo}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                  <Download className="h-6 w-6 text-secondary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">Artigo Científico</h3>
                  <p className="text-sm text-muted-foreground">Fundamentação técnica completa</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <Button size="lg" onClick={() => navigate('/explorar')}>
            Explorar Sistema
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate('/login')}>
            Fazer Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sobre;
