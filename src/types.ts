export interface TargetPart {
  name: string;
  estValue: number;
  toolsNeeded: string[];
  failureMode: string;
  interchangeability: string;
  extractionGuide: string;
  difficulty: "Easy" | "Medium" | "Hard"; // Pull time <10 min, 10-20 min, or >20 min
  rarityModifier?: string; // e.g. "Facelift versions with premium sound or active spoilers"
  perfModImpact?: string; // e.g. "Upgraded replacement increases value; aftermarket clones slash valuation."
  category?: string; // e.g. "Electronics", "Sensors", "Hydraulics", "Interior Accessories", etc.
}

export interface Chassis {
  id: string;
  make: string;
  model: string;
  chassisCode: string;
  years: number[];
  origin: string;
  difficultyRating: number; // 1-5 scale for layout
  notes: string;
  targetParts: TargetPart[]; // Exactly top 3 parts
}

export interface YardPlanItem {
  id: string; // chassisId_partName
  chassisId: string;
  chassisMake: string;
  chassisModel: string;
  chassisCode: string;
  part: TargetPart;
  status?: "target" | "pulled" | "listed" | "sold";
  salePrice?: number;
}

export interface AISearchResult {
  Make?: string[];
  Model?: string[];
  Years?: number[];
  Target_Parts?: string[];
  Est_Value?: number[];
  Required_Tools?: string[];
  failure_reasons?: string[];
  interchangeability?: string[];
  extraction_guides?: string[];
  notes?: string;
  // Fallbacks
  make?: string;
  model?: string;
  years?: number[];
  target_parts?: Array<{
    name: string;
    est_value: number;
    required_tools: string[];
    failure_reason: string;
    interchange: string;
  }>;
}

export interface GeneratedListing {
  title: string;
  suggestedPrice: number;
  anchorAskingPrice: number;
  bottomCashPrice: number;
  ebayTitle: string;
  ebayDescription: string;
  facebookTitle: string;
  facebookDescription: string;
  craigslistDescription: string;
  bulletFeatures: string[];
  interchangeText: string;
  itemSpecifics: Record<string, string>;
  tags: string[];
  shippingAdvice: string;
  photoChecklist: string[];
  antiLowballClause: string;
}

export interface ListingRequestParams {
  partName: string;
  make: string;
  model: string;
  chassisCode?: string;
  years?: number[] | string;
  estValue: number;
  condition?: "OEM Tested Good" | "Used Clean Working" | "Salvage Core Pull" | "Grade A Clean";
  category?: string;
  partNumber?: string;
  failureMode?: string;
  interchangeability?: string;
  customNotes?: string;
}

export interface TrendingPartInsight {
  rank: number;
  partName: string;
  vehicleChassis: string;
  category: string;
  forumsDiscussing: string[];
  demandDriver: string;
  estResaleValue: number;
  priceTrendPct: number; // e.g. +28%
  daysToSell: string; // e.g. "1-3 days", "Within 1 week"
  searchKeywords: string[];
  sources?: Array<{ title: string; url: string }>;
}

export interface QuickExtractionGuide {
  partName: string;
  vehicle: string;
  estimatedTimeMin: number;
  difficultyRating: string;
  stepByStepInstructions: Array<{
    stepNumber: number;
    title: string;
    description: string;
    toolUsed?: string;
  }>;
  toolSpecificTips: Array<{
    toolName: string;
    usageAdvice: string;
  }>;
  safetyWarnings: Array<{
    severity: "CRITICAL" | "CAUTION" | "TIP";
    warning: string;
  }>;
  yardSpeedHacks: string[];
}

export interface YardInventoryAlert {
  id: string;
  planItemId: string;
  partName: string;
  vehicle: string;
  originalValue: number;
  currentValue: number;
  shiftPct: number;
  shiftDirection: "SURGE" | "DROP";
  reason: string;
  marketTrigger: string;
  timestamp: string;
  isRead?: boolean;
}

