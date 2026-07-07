import type { LifecycleActor } from "./actor";
import type { TransitionReason } from "./reason";
import type { LifecycleState } from "./state";
import type { Timestamp } from "..";

export interface LifecycleTransition<TState extends LifecycleState = LifecycleState> {
  from: TState;
  to: TState;
  actor: LifecycleActor;
  reason: TransitionReason;
  timestamp: Timestamp;
  source?: string;
  metadata?: Record<string, unknown>;
}
