import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Shield, Eye, Link as LinkIcon, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const Landing = () => {
  const navigate = useNavigate();
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const features = [
    {
      id: 'transparencia',
      icon: Eye,
      title: 'Transparência Total',
      description: 'Rastreabilidade pública com mapas interativos e documentos verificáveis',
      details: 'Cada transação é registrada de forma imutável na blockchain, permitindo auditoria completa da cadeia de custódia. Mapas em tempo real mostram a origem, trajeto e destino de cada lote.',
    },
    {
      id: 'auditoria',
      icon: Shield,
      title: 'Auditoria Automática',
      description: 'Motor de compliance com regras customizáveis e validação em tempo real',
      details: 'Sistema inteligente de regras que valida automaticamente cada operação contra requisitos ambientais, bloqueando irregularidades antes que aconteçam.',
    },
    {
      id: 'blockchain',
      icon: LinkIcon,
      title: 'Blockchain Imutável',
      description: 'Registros criptografados e encadeados, garantindo prova de autenticidade',
      details: 'Cada evento gera um hash único conectado ao anterior, formando uma cadeia verificável que não pode ser alterada retroativamente. Prova matemática de integridade.',
    },
  ];

  const handleFeatureClick = (featureId: string) => {
    setSelectedFeature(featureId);
  };

  const currentFeature = features.find(f => f.id === selectedFeature);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Leaf className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-primary">Amazônia Digital</span>
          </div>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/explorar')}>
              Explorar
            </Button>
            <Button variant="ghost" onClick={() => navigate('/sobre')}>
              Sobre
            </Button>
            <Button onClick={() => navigate('/login')}>
              Login
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6 leading-tight">
            Gestão Sustentável com{' '}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Blockchain
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Rastreabilidade completa, compliance automático e transparência total para cadeias produtivas da Amazônia
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" onClick={() => navigate('/explorar')} className="group">
              Explorar Rastreabilidade
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/login')}>
              Acessar Sistema
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.id}
                className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary"
                onClick={() => handleFeatureClick(feature.id)}
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full">
                    Saiba mais →
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-card rounded-2xl p-8 shadow-lg">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">1.247</div>
              <div className="text-muted-foreground">Lotes Rastreados</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary mb-2">98.5%</div>
              <div className="text-muted-foreground">Taxa de Conformidade</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">15min</div>
              <div className="text-muted-foreground">Tempo Médio Auditoria</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">Monitoramento Ativo</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl mb-4">Pronto para começar?</CardTitle>
            <CardDescription className="text-primary-foreground/90 text-lg">
              Junte-se à revolução da transparência e sustentabilidade na Amazônia
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button size="lg" variant="secondary" onClick={() => navigate('/login')}>
              Criar Conta Gratuita
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 Amazônia Digital. Todos os direitos reservados.</p>
        </div>
      </footer>

      {/* Feature Detail Modal */}
      <Dialog open={!!selectedFeature} onOpenChange={() => setSelectedFeature(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {currentFeature && <currentFeature.icon className="h-6 w-6 text-primary" />}
              {currentFeature?.title}
            </DialogTitle>
            <DialogDescription className="text-base pt-4">
              {currentFeature?.details}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Landing;
