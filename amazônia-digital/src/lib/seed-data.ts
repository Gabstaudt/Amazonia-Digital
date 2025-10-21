import { lotesAPI, eventosAPI } from './mock-api';

export const seedDemoData = () => {
  const existing = lotesAPI.getAll();
  if (existing.length > 0) return; // Already seeded

  // Create demo lotes
  const lote1 = lotesAPI.create({
    codigo: 'MAD-2025-001',
    cadeia: 'madeira',
    volume: 20,
    unidade: 'm³',
    origem: 'Manaus, AM',
    destino: 'São Paulo, SP',
    latitude: -3.1190,
    longitude: -60.0217,
    status: 'conforme',
    documentos: ['Licenca_Ambiental.pdf', 'Nota_Fiscal.pdf'],
    licencas: ['IBAMA-2025-001'],
  });

  eventosAPI.create({
    loteId: lote1.id,
    tipo: 'criacao',
    descricao: 'Lote criado e registrado no sistema',
    latitude: -3.1190,
    longitude: -60.0217,
    timestamp: new Date().toISOString(),
    usuario: 'Sistema',
  });

  const lote2 = lotesAPI.create({
    codigo: 'PES-2025-002',
    cadeia: 'pescado',
    volume: 150,
    unidade: 'kg',
    origem: 'Santarém, PA',
    destino: 'Belém, PA',
    latitude: -2.4394,
    longitude: -54.7079,
    status: 'analise',
    documentos: [],
    licencas: [],
  });

  const lote3 = lotesAPI.create({
    codigo: 'CAC-2025-003',
    cadeia: 'cacau',
    volume: 500,
    unidade: 'kg',
    origem: 'Ilhéus, BA',
    destino: 'Salvador, BA',
    latitude: -14.7888,
    longitude: -39.0339,
    status: 'conforme',
    documentos: ['Certificacao_Organica.pdf'],
    licencas: ['CERT-ORG-2025'],
  });
};
