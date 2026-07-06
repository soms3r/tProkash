import type { LifecycleTransition } from "./transition";

export interface AllowedTransition<TState = string> {
  from: TState;
  to: TState;
  label?: string;
  requireReason?: boolean;
  requireVerification?: boolean;
  allowedActorTypes?: string[];
}

export interface LifecycleHistory<TState extends string = string> extends LifecycleTransition<TState> {
  id: string;
  sequenceNumber: number;
  rollbackOf?: string;
  rollbackTarget?: TState;
}
