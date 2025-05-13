
import { IncidentType } from "../types";

export const incidentTypes: IncidentType[] = [
  {
    id: "water-logging",
    name: "Water Logging",
    baselineSeverity: 7,
  },
  {
    id: "power-outage",
    name: "Power Outage",
    baselineSeverity: 8,
  },
  {
    id: "road-damage",
    name: "Road Damage",
    baselineSeverity: 6,
  },
  {
    id: "fallen-tree",
    name: "Fallen Tree",
    baselineSeverity: 5,
  },
  {
    id: "fire",
    name: "Fire",
    baselineSeverity: 9,
  },
  {
    id: "building-damage",
    name: "Building Damage",
    baselineSeverity: 8,
  },
  {
    id: "medical-emergency",
    name: "Medical Emergency",
    baselineSeverity: 10,
  },
  {
    id: "traffic-signal-failure",
    name: "Traffic Signal Failure",
    baselineSeverity: 7,
  }
];
