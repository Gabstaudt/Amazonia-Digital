import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';

type Status = 'conforme' | 'analise' | 'irregular' | 'bloqueado';

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export const StatusBadge = ({ status, className = '' }: StatusBadgeProps) => {
  const config = {
    conforme: {
      label: 'Conforme',
      icon: CheckCircle,
      className: 'bg-green-100 text-green-800 border-green-300',
    },
    analise: {
      label: 'Em Análise',
      icon: Clock,
      className: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    },
    irregular: {
      label: 'Irregular',
      icon: AlertTriangle,
      className: 'bg-orange-100 text-orange-800 border-orange-300',
    },
    bloqueado: {
      label: 'Bloqueado',
      icon: XCircle,
      className: 'bg-red-100 text-red-800 border-red-300',
    },
  };

  const { label, icon: Icon, className: statusClass } = config[status];

  return (
    <Badge variant="outline" className={`${statusClass} ${className} flex items-center gap-1`}>
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
};
