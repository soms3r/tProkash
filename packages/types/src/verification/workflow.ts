import type { Identifier } from "..";
import type { AuditMetadata } from "../domain";
import type {
  VerificationLevel,
  VerificationMethodType,
  WorkflowType,
  AutomatedStage,
  HumanReviewStage,
} from "./types";

export interface AutomatedWorkflow {
  stage: AutomatedStage;
  triggeredAt: string;
  completedAt?: string;
  escalatedAt?: string;
  escalationReason?: string;
}

export interface ReviewAssignment {
  assignedTo?: Identifier;
  assignedAt?: string;
  completedAt?: string;
  note?: string;
}

export interface HumanReviewWorkflow {
  stage: HumanReviewStage;
  assignment?: ReviewAssignment;
  submittedAt?: string;
  assignedAt?: string;
  reviewedAt?: string;
  reviewerNote?: string;
  slaDeadline?: string;
}

export interface BatchVerification {
  id: Identifier;
  purpose: string;
  level: VerificationLevel;
  methods: VerificationMethodType[];
  workflow: WorkflowType;
  status: "IN_PROGRESS" | "COMPLETED" | "FAILED";
  progress: {
    total: number;
    completed: number;
    failed: number;
  };
  createdAt: string;
  completedAt?: string;
  audit: AuditMetadata;
}
