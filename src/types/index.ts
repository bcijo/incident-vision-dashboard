
export type IncidentType = {
  id: string;
  name: string;
  baselineSeverity: number;
  icon?: string;
};

export type Taluk = {
  id: string;
  name: string;
  averageResolutionTime: number;
  severityFactor: number;
};

export type Incident = {
  id: string;
  type: string;
  taluk: string;
  reportedAt: string;
  resolvedAt: string;
  severity: number;
  resolutionTimeMinutes: number;
  description: string;
  images: {
    before: string;
    after: string;
  };
};

export type ChartData = {
  name: string;
  value: number;
};
