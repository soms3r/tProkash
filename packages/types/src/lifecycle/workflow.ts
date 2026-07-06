import type { AllowedTransition } from "./history";
import type { LifecycleState } from "./state";

export interface WorkflowDefinition<TState extends LifecycleState = LifecycleState> {
  initialState: TState;
  allowedTransitions: AllowedTransition<TState>[];
  terminalStates: TState[];
  customStates?: TState[];
  config?: WorkflowConfig;
}

export interface WorkflowConfig {
  allowRollback?: boolean;
  requireAudit?: boolean;
  maxHistoryLength?: number;
}
