export type ActorType =
  | "USER"
  | "SYSTEM"
  | "SERVICE"
  | "API"
  | "AUTOMATION";

export interface LifecycleActor {
  type: ActorType;
  id?: string;
  label?: string;
}
