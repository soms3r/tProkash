export type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export interface BusinessHours {
  days: DayOfWeek[];
  start: string;
  end: string;
}

export interface Holiday {
  date: string;
  label?: string;
}

export interface OutOfOffice {
  from: string;
  to: string;
  label?: string;
}

export interface Availability {
  timezone?: string;
  businessHours?: BusinessHours[];
  holidays?: Holiday[];
  outOfOffice?: OutOfOffice[];
  responseTime?: string;
  availabilityNote?: string;
}
