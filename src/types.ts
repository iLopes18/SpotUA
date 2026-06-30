export enum EventCategory {
  ACADEMICOS = 'Académicos',
  DESPORTO = 'Desporto',
  FESTAS = 'Festas',
  WORKSHOPS = 'Workshops',
  CULTURA = 'Cultura',
  CIENCIA = 'Ciência',
}

export enum Campus {
  SANTIAGO = 'Santiago',
  CRASTO = 'Crasto',
  ESTGA = 'ESTGA',
  ESAN = 'ESAN',
}

export interface UAEvent {
  id: string;
  title: string;
  category: EventCategory;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime?: string; // HH:MM
  location: string;
  campus: Campus;
  organizer: string;
  logoText: string; // 2-3 characters
  description: string;
  link?: string;
  isUserSubmitted?: boolean;
}
