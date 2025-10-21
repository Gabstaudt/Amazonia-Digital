import CryptoJS from 'crypto-js';

// Types
export type UserRole = 'admin' | 'fiscal' | 'empresa' | 'observador';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  password: string;
}

export interface Lote {
  id: string;
  codigo: string;
  cadeia: 'madeira' | 'pescado' | 'cacau' | 'outro';
  volume: number;
  unidade: string;
  origem: string;
  destino: string;
  status: 'conforme' | 'analise' | 'irregular' | 'bloqueado';
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;
  documentos: string[];
  licencas: string[];
}

export interface Evento {
  id: string;
  loteId: string;
  tipo: 'criacao' | 'transporte' | 'processamento' | 'certificacao' | 'venda';
  descricao: string;
  volume?: number;
  latitude: number;
  longitude: number;
  timestamp: string;
  usuario: string;
  hash: string;
}

export interface Regra {
  id: string;
  nome: string;
  cadeia: string;
  severidade: 'info' | 'alerta' | 'bloqueio';
  condicao: string;
  acao: string;
  ativo: boolean;
}

export interface AuditoriaLog {
  id: string;
  timestamp: string;
  usuario: string;
  acao: string;
  loteId?: string;
  detalhes: string;
  hash: string;
  hashAnterior: string;
}

// Initialize data in localStorage
const STORAGE_KEYS = {
  users: 'amazonia_users',
  lotes: 'amazonia_lotes',
  eventos: 'amazonia_eventos',
  regras: 'amazonia_regras',
  auditoria: 'amazonia_auditoria',
  session: 'amazonia_session',
};

// Default users
const defaultUsers: User[] = [
  { id: '1', email: 'admin@demo.com', name: 'Admin Sistema', role: 'admin', password: 'Admin@123' },
  { id: '2', email: 'fiscal@demo.com', name: 'Fiscal Ambiental', role: 'fiscal', password: 'Fiscal@123' },
  { id: '3', email: 'empresa@demo.com', name: 'Empresa Madeireira', role: 'empresa', password: 'Empresa@123' },
  { id: '4', email: 'observador@demo.com', name: 'Observador Público', role: 'observador', password: 'Obs@123' },
];

// Default regras
const defaultRegras: Regra[] = [
  {
    id: '1',
    nome: 'Volume Excedente Madeira',
    cadeia: 'madeira',
    severidade: 'bloqueio',
    condicao: 'volume_transporte > volume_origem',
    acao: 'Bloquear transação e notificar fiscalização',
    ativo: true,
  },
  {
    id: '2',
    nome: 'Período de Defeso Pescado',
    cadeia: 'pescado',
    severidade: 'bloqueio',
    condicao: 'mes IN [11, 12, 1, 2]',
    acao: 'Bloquear captura em período de defeso',
    ativo: true,
  },
  {
    id: '3',
    nome: 'Certificação Cacau',
    cadeia: 'cacau',
    severidade: 'alerta',
    condicao: 'certificacao_organica == false',
    acao: 'Alertar sobre ausência de certificação',
    ativo: true,
  },
];

// Blockchain simulation
export const generateHash = (data: any, previousHash = '0'): string => {
  const content = JSON.stringify(data) + previousHash + Date.now();
  return CryptoJS.SHA256(content).toString();
};

// Initialize storage
export const initStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.users)) {
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(defaultUsers));
  }
  if (!localStorage.getItem(STORAGE_KEYS.lotes)) {
    localStorage.setItem(STORAGE_KEYS.lotes, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.eventos)) {
    localStorage.setItem(STORAGE_KEYS.eventos, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.regras)) {
    localStorage.setItem(STORAGE_KEYS.regras, JSON.stringify(defaultRegras));
  }
  if (!localStorage.getItem(STORAGE_KEYS.auditoria)) {
    localStorage.setItem(STORAGE_KEYS.auditoria, JSON.stringify([]));
  }
};

// Auth API
export const authAPI = {
  login: async (email: string, password: string): Promise<{ user: User } | { error: string }> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.users) || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      const session = { ...user, password: undefined };
      localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session));
      return { user };
    }
    return { error: 'Email ou senha incorretos' };
  },
  
  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.session);
  },
  
  getSession: (): User | null => {
    const session = localStorage.getItem(STORAGE_KEYS.session);
    return session ? JSON.parse(session) : null;
  },
};

// Lotes API
export const lotesAPI = {
  getAll: (): Lote[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.lotes) || '[]');
  },
  
  getById: (id: string): Lote | undefined => {
    const lotes = lotesAPI.getAll();
    return lotes.find(l => l.id === id);
  },
  
  create: (lote: Omit<Lote, 'id' | 'createdAt' | 'updatedAt'>): Lote => {
    const lotes = lotesAPI.getAll();
    const newLote: Lote = {
      ...lote,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    lotes.push(newLote);
    localStorage.setItem(STORAGE_KEYS.lotes, JSON.stringify(lotes));
    
    // Log auditoria
    auditoriaAPI.log('create_lote', `Lote ${newLote.codigo} criado`, newLote.id);
    
    return newLote;
  },
  
  update: (id: string, updates: Partial<Lote>): Lote | undefined => {
    const lotes = lotesAPI.getAll();
    const index = lotes.findIndex(l => l.id === id);
    if (index === -1) return undefined;
    
    lotes[index] = { ...lotes[index], ...updates, updatedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEYS.lotes, JSON.stringify(lotes));
    
    // Log auditoria
    auditoriaAPI.log('update_lote', `Lote ${lotes[index].codigo} atualizado`, id);
    
    return lotes[index];
  },
  
  delete: (id: string): boolean => {
    const lotes = lotesAPI.getAll();
    const filtered = lotes.filter(l => l.id !== id);
    if (filtered.length === lotes.length) return false;
    
    localStorage.setItem(STORAGE_KEYS.lotes, JSON.stringify(filtered));
    
    // Log auditoria
    auditoriaAPI.log('delete_lote', `Lote removido`, id);
    
    return true;
  },
};

// Eventos API
export const eventosAPI = {
  getAll: (): Evento[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.eventos) || '[]');
  },
  
  getByLoteId: (loteId: string): Evento[] => {
    const eventos = eventosAPI.getAll();
    return eventos.filter(e => e.loteId === loteId);
  },
  
  create: (evento: Omit<Evento, 'id' | 'hash'>): Evento => {
    const eventos = eventosAPI.getAll();
    const lastHash = eventos.length > 0 ? eventos[eventos.length - 1].hash : '0';
    
    const newEvento: Evento = {
      ...evento,
      id: Date.now().toString(),
      hash: generateHash(evento, lastHash),
    };
    
    eventos.push(newEvento);
    localStorage.setItem(STORAGE_KEYS.eventos, JSON.stringify(eventos));
    
    // Log auditoria
    auditoriaAPI.log('create_evento', `Evento ${newEvento.tipo} registrado`, newEvento.loteId);
    
    return newEvento;
  },
};

// Regras API
export const regrasAPI = {
  getAll: (): Regra[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.regras) || '[]');
  },
  
  getById: (id: string): Regra | undefined => {
    const regras = regrasAPI.getAll();
    return regras.find(r => r.id === id);
  },
  
  create: (regra: Omit<Regra, 'id'>): Regra => {
    const regras = regrasAPI.getAll();
    const newRegra: Regra = {
      ...regra,
      id: Date.now().toString(),
    };
    regras.push(newRegra);
    localStorage.setItem(STORAGE_KEYS.regras, JSON.stringify(regras));
    
    auditoriaAPI.log('create_regra', `Regra ${newRegra.nome} criada`);
    
    return newRegra;
  },
  
  update: (id: string, updates: Partial<Regra>): Regra | undefined => {
    const regras = regrasAPI.getAll();
    const index = regras.findIndex(r => r.id === id);
    if (index === -1) return undefined;
    
    regras[index] = { ...regras[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.regras, JSON.stringify(regras));
    
    auditoriaAPI.log('update_regra', `Regra ${regras[index].nome} atualizada`);
    
    return regras[index];
  },
  
  delete: (id: string): boolean => {
    const regras = regrasAPI.getAll();
    const filtered = regras.filter(r => r.id !== id);
    if (filtered.length === regras.length) return false;
    
    localStorage.setItem(STORAGE_KEYS.regras, JSON.stringify(filtered));
    
    auditoriaAPI.log('delete_regra', `Regra removida`);
    
    return true;
  },
};

// Auditoria API
export const auditoriaAPI = {
  getAll: (): AuditoriaLog[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.auditoria) || '[]');
  },
  
  log: (acao: string, detalhes: string, loteId?: string) => {
    const logs = auditoriaAPI.getAll();
    const session = authAPI.getSession();
    const lastHash = logs.length > 0 ? logs[logs.length - 1].hash : '0';
    
    const logEntry: AuditoriaLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      usuario: session?.name || 'Sistema',
      acao,
      loteId,
      detalhes,
      hashAnterior: lastHash,
      hash: generateHash({ acao, detalhes, timestamp: Date.now() }, lastHash),
    };
    
    logs.push(logEntry);
    localStorage.setItem(STORAGE_KEYS.auditoria, JSON.stringify(logs));
  },
};

// Compliance Engine
export const complianceEngine = {
  validateLote: (lote: Lote, eventos: Evento[]): { status: 'conforme' | 'analise' | 'irregular' | 'bloqueado'; messages: string[] } => {
    const regras = regrasAPI.getAll().filter(r => r.ativo && r.cadeia === lote.cadeia);
    const messages: string[] = [];
    let worstSeverity: 'conforme' | 'analise' | 'irregular' | 'bloqueado' = 'conforme';
    
    for (const regra of regras) {
      let violated = false;
      
      // Volume excedente
      if (regra.condicao.includes('volume_transporte > volume_origem')) {
        const transporteEvento = eventos.find(e => e.tipo === 'transporte' && e.volume);
        if (transporteEvento && transporteEvento.volume && transporteEvento.volume > lote.volume) {
          violated = true;
          messages.push(`❌ ${regra.nome}: Volume transportado (${transporteEvento.volume}) excede origem (${lote.volume})`);
        }
      }
      
      // Período de defeso
      if (regra.condicao.includes('mes IN')) {
        const mes = new Date().getMonth() + 1;
        if ([11, 12, 1, 2].includes(mes)) {
          violated = true;
          messages.push(`❌ ${regra.nome}: Operação em período de defeso (mês ${mes})`);
        }
      }
      
      // Certificação
      if (regra.condicao.includes('certificacao_organica')) {
        if (!lote.licencas || lote.licencas.length === 0) {
          violated = true;
          messages.push(`⚠️ ${regra.nome}: Lote sem certificação orgânica`);
        }
      }
      
      if (violated) {
        if (regra.severidade === 'bloqueio') {
          worstSeverity = 'bloqueado';
        } else if (regra.severidade === 'alerta' && worstSeverity !== 'bloqueado') {
          worstSeverity = 'irregular';
        }
      }
    }
    
    if (worstSeverity === 'conforme') {
      messages.push('✅ Todos os requisitos de compliance atendidos');
    }
    
    // Log compliance check
    auditoriaAPI.log('validate_compliance', `Validação: ${worstSeverity} - ${messages.join('; ')}`, lote.id);
    
    return { status: worstSeverity, messages };
  },
};

// Users API
export const usersAPI = {
  getAll: (): User[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.users) || '[]');
  },
  
  updateRole: (userId: string, role: UserRole): User | undefined => {
    const users = usersAPI.getAll();
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) return undefined;
    
    users[index].role = role;
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
    
    auditoriaAPI.log('update_user_role', `Papel do usuário ${users[index].name} alterado para ${role}`);
    
    return users[index];
  },
};

// Initialize on load
initStorage();
