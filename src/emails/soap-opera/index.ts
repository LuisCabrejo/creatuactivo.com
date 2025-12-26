/**
 * Copyright © 2025 CreaTuActivo.com
 * Soap Opera Sequence - Exportaciones
 */

export { Email1Backstory } from './Email1-Backstory';
export { Email2Wall } from './Email2-Wall';
export { Email3Epiphany } from './Email3-Epiphany';
export { Email4HiddenPlan } from './Email4-HiddenPlan';
export { Email5Urgency } from './Email5-Urgency';

// Configuración de la secuencia
export const SOAP_OPERA_SEQUENCE = [
  {
    id: 1,
    name: 'backstory',
    subject: '{{firstName}}, tu resultado + mi historia',
    delayDays: 0, // Inmediato
    component: 'Email1Backstory',
  },
  {
    id: 2,
    name: 'wall',
    subject: 'El muro que todos enfrentamos',
    delayDays: 1,
    component: 'Email2Wall',
  },
  {
    id: 3,
    name: 'epiphany',
    subject: 'El momento que cambió todo',
    delayDays: 2,
    component: 'Email3Epiphany',
  },
  {
    id: 4,
    name: 'hidden-plan',
    subject: 'Lo que los "gurús" no te cuentan',
    delayDays: 3,
    component: 'Email4HiddenPlan',
  },
  {
    id: 5,
    name: 'urgency',
    subject: '{{firstName}}, tu invitación al Reto',
    delayDays: 4,
    component: 'Email5Urgency',
  },
];
