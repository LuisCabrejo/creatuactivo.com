// NodeX Components - Motor empresarial CreaTuActivo.com
// Sistema de gestión y analytics para constructores de activos

// Componente principal de métricas
export { default as NodeXMetrics } from './Metrics';

// Dashboard (será recreado)
export { default as NodeXLayout } from './layout'

// Types y interfaces NodeX
export interface NodeXData {
  period: string;
  iniciar: number;
  acoger: number;
  activar: number;
}

export interface NodeXAnalytics {
  totalVolume: number;
  growth: number;
  activeUsers: number;
}

/*
ARQUITECTURA NODEX:
NodeX representa el motor empresarial y sistema de analytics
para constructores de activos usando Framework "INICIAR, ACOGER, ACTIVAR".

Especializado en métricas, dashboard y gestión de performance
con visualizaciones premium y datos en tiempo real.

DIFERENCIACIÓN:
- 📊 Analytics empresariales nivel C-Suite
- 🎯 Métricas Framework IAA específicas
- 💎 Visualizaciones premium anti-FOUC
- ⚡ Performance datos tiempo real
*/
