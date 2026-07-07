import type { LifecycleActor } from "./actor";
import type { LifecycleHistory } from "./history";
import type { TransitionReason } from "./reason";
import type { LifecycleState } from "./state";
import type { WorkflowDefinition } from "./workflow";
import type { Timestamp } from "..";

export interface StatusInfo<TState extends LifecycleState = LifecycleState> {
  currentState: TState;
  enteredAt: Timestamp;
  actor?: LifecycleActor;
  reason?: TransitionReason;
  metadata?: Record<string, unknown>;
}

export interface WorkflowStatus<TState extends LifecycleState = LifecycleState> {
  definition: WorkflowDefinition<TState>;
  current: StatusInfo<TState>;
  lastTransition?: LifecycleHistory<TState>;
  availableTransitions: TState[];
  totalTransitions: number;
  isTerminal: boolean;
}
