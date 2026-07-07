import type { Identifier, Timestamp } from "..";
import type { DerivativeType, DerivativeStatus } from "./types";

export interface AssetDerivative {
  id: Identifier;
  type: DerivativeType;
  sourceAssetId: Identifier;
  sourceVersion: number;
  assetId: Identifier;
  generatedAt: Timestamp;
  generatedBy: string;
  status: DerivativeStatus;
}
