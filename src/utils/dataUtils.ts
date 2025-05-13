
import { mockIncidents } from "../data/mockIncidents";
import { incidentTypes } from "../data/incidentTypes";
import { talukData } from "../data/talukData";
import { ChartData, Incident } from "../types";

// Function to get all incidents
export const getAllIncidents = (): Incident[] => {
  return mockIncidents;
};

// Function to get incidents by taluk
export const getIncidentsByTaluk = (talukId: string): Incident[] => {
  return mockIncidents.filter(incident => incident.taluk === talukId);
};

// Function to get incidents by type
export const getIncidentsByType = (typeId: string): Incident[] => {
  return mockIncidents.filter(incident => incident.type === typeId);
};

// Function to get incident distribution by taluk
export const getIncidentDistributionByTaluk = (): ChartData[] => {
  const distribution: Record<string, number> = {};
  
  mockIncidents.forEach(incident => {
    if (!distribution[incident.taluk]) {
      distribution[incident.taluk] = 0;
    }
    distribution[incident.taluk]++;
  });
  
  return talukData.map(taluk => ({
    name: taluk.name,
    value: distribution[taluk.id] || 0
  }));
};

// Function to get incident distribution by type
export const getIncidentDistributionByType = (): ChartData[] => {
  const distribution: Record<string, number> = {};
  
  mockIncidents.forEach(incident => {
    if (!distribution[incident.type]) {
      distribution[incident.type] = 0;
    }
    distribution[incident.type]++;
  });
  
  return incidentTypes.map(type => ({
    name: type.name,
    value: distribution[type.id] || 0
  }));
};

// Function to get resolution time by incident type
export const getResolutionTimeByType = (): ChartData[] => {
  const resolutionTimes: Record<string, number[]> = {};
  
  mockIncidents.forEach(incident => {
    if (!resolutionTimes[incident.type]) {
      resolutionTimes[incident.type] = [];
    }
    resolutionTimes[incident.type].push(incident.resolutionTimeMinutes);
  });
  
  // Calculate average resolution time by type
  const averageResolutionTimes: Record<string, number> = {};
  Object.entries(resolutionTimes).forEach(([type, times]) => {
    const sum = times.reduce((acc, time) => acc + time, 0);
    averageResolutionTimes[type] = Math.round(sum / times.length);
  });
  
  return incidentTypes.map(type => ({
    name: type.name,
    value: averageResolutionTimes[type.id] || 0
  }));
};

// Function to get monthly incident counts
export const getMonthlyIncidentTrends = (): { name: string; count: number }[] => {
  const months = ["May"];
  
  return months.map(month => {
    return {
      name: month,
      count: mockIncidents.length
    };
  });
};

// Function to get severity distribution
export const getSeverityDistribution = (): number[] => {
  const distribution: number[] = Array(10).fill(0);
  
  mockIncidents.forEach(incident => {
    const severityIdx = Math.min(Math.floor(incident.severity) - 1, 9);
    distribution[severityIdx]++;
  });
  
  return distribution;
};

// Function to calculate severity based on incident type and location
export const calculateIncidentSeverity = (
  incidentTypeId: string, 
  talukId: string
): number => {
  const incidentType = incidentTypes.find(type => type.id === incidentTypeId);
  const taluk = talukData.find(t => t.id === talukId);
  
  if (!incidentType || !taluk) {
    return 5; // Default mid-severity
  }
  
  const baseSeverity = incidentType.baselineSeverity;
  const locationFactor = taluk.severityFactor;
  
  // Calculate adjusted severity (between 1-10)
  const calculatedSeverity = Math.min(
    Math.max(Math.round(baseSeverity * locationFactor), 1), 
    10
  );
  
  return calculatedSeverity;
};

// Function to predict resolution time
export const predictResolutionTime = (
  incidentTypeId: string, 
  talukId: string, 
  severity: number
): number => {
  const incidentType = incidentTypes.find(type => type.id === incidentTypeId);
  const taluk = talukData.find(t => t.id === talukId);
  
  if (!incidentType || !taluk) {
    return 240; // Default 4 hours
  }
  
  // Base resolution time from taluk data
  const baseTime = taluk.averageResolutionTime;
  
  // Severity factor (higher severity might take longer or be prioritized)
  const severityFactor = severity > 8 ? 0.8 : (severity > 5 ? 1.0 : 1.2);
  
  // Predicted resolution time in minutes
  return Math.round(baseTime * severityFactor);
};

// Simulated function for image analysis API
export const analyzeImages = async (
  beforeImage: string, 
  afterImage: string
): Promise<{
  description: string;
  resolved: boolean;
  confidence: number;
}> => {
  // This is a mock implementation - in a real app this would call Gemini API
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate API response
      resolve({
        description: "The issue appears to be resolved. The flooding water has receded and the area is now clear.",
        resolved: true,
        confidence: 0.92
      });
    }, 1500);
  });
};
