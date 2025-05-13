
import { Incident } from "../types";

export const mockIncidents: Incident[] = [
  {
    id: "INC-001",
    type: "water-logging",
    taluk: "surathkal",
    reportedAt: "2025-05-10T08:30:00",
    resolvedAt: "2025-05-10T14:45:00",
    severity: 7,
    resolutionTimeMinutes: 375,
    description: "Main road flooded after heavy rain",
    images: {
      before: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      after: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    }
  },
  {
    id: "INC-002",
    type: "power-outage",
    taluk: "mangalore",
    reportedAt: "2025-05-11T12:15:00",
    resolvedAt: "2025-05-11T15:30:00",
    severity: 8,
    resolutionTimeMinutes: 195,
    description: "Power outage affecting downtown area",
    images: {
      before: "https://images.unsplash.com/photo-1621188988909-fbef0a27406c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      after: "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    }
  },
  {
    id: "INC-003",
    type: "road-damage",
    taluk: "bantwal",
    reportedAt: "2025-05-12T07:45:00",
    resolvedAt: "2025-05-12T14:30:00",
    severity: 6,
    resolutionTimeMinutes: 405,
    description: "Large pothole on highway causing traffic delays",
    images: {
      before: "https://images.unsplash.com/photo-1594789020554-98211634c116?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      after: "https://images.unsplash.com/photo-1487452066049-a710f7296400?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    }
  },
  {
    id: "INC-004",
    type: "fallen-tree",
    taluk: "puttur",
    reportedAt: "2025-05-14T16:30:00",
    resolvedAt: "2025-05-14T19:15:00",
    severity: 5,
    resolutionTimeMinutes: 165,
    description: "Tree fallen across residential road blocking access",
    images: {
      before: "https://images.unsplash.com/photo-1517660029921-0cbea2f15f8f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      after: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    }
  },
  {
    id: "INC-005",
    type: "fire",
    taluk: "mulki",
    reportedAt: "2025-05-15T20:10:00",
    resolvedAt: "2025-05-15T22:45:00",
    severity: 9,
    resolutionTimeMinutes: 155,
    description: "Small fire in commercial building",
    images: {
      before: "https://images.unsplash.com/photo-1584824486516-0555a07fc511?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      after: "https://images.unsplash.com/photo-1629772244930-8cc6bd63d956?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    }
  },
  {
    id: "INC-006",
    type: "building-damage",
    taluk: "belthangady",
    reportedAt: "2025-05-16T09:20:00",
    resolvedAt: "2025-05-16T18:40:00",
    severity: 8,
    resolutionTimeMinutes: 560,
    description: "Partial building collapse after heavy rains",
    images: {
      before: "https://images.unsplash.com/photo-1610896867270-2dd569f7e46a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      after: "https://images.unsplash.com/photo-1542362567-b07e54358753?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    }
  },
  {
    id: "INC-007",
    type: "medical-emergency",
    taluk: "mangalore",
    reportedAt: "2025-05-17T14:55:00",
    resolvedAt: "2025-05-17T15:40:00",
    severity: 10,
    resolutionTimeMinutes: 45,
    description: "Medical emergency at public event",
    images: {
      before: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      after: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    }
  },
  {
    id: "INC-008",
    type: "traffic-signal-failure",
    taluk: "surathkal",
    reportedAt: "2025-05-18T10:30:00",
    resolvedAt: "2025-05-18T14:15:00",
    severity: 7,
    resolutionTimeMinutes: 225,
    description: "Traffic signals malfunctioning at major intersection",
    images: {
      before: "https://images.unsplash.com/photo-1594408052115-7e8b8a6261f9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      after: "https://images.unsplash.com/photo-1617469767053-5f035f7f6a9b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    }
  },
  {
    id: "INC-009",
    type: "water-logging",
    taluk: "bantwal",
    reportedAt: "2025-05-19T18:20:00",
    resolvedAt: "2025-05-20T08:45:00",
    severity: 7,
    resolutionTimeMinutes: 865,
    description: "Severe flooding in low-lying residential area",
    images: {
      before: "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      after: "https://images.unsplash.com/photo-1617469767053-5f035f7f6a9b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    }
  },
  {
    id: "INC-010",
    type: "power-outage",
    taluk: "puttur",
    reportedAt: "2025-05-21T15:10:00",
    resolvedAt: "2025-05-21T19:40:00",
    severity: 8,
    resolutionTimeMinutes: 270,
    description: "Power outage affecting multiple villages",
    images: {
      before: "https://images.unsplash.com/photo-1621188988909-fbef0a27406c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      after: "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    }
  },
  {
    id: "INC-011",
    type: "fallen-tree",
    taluk: "mulki",
    reportedAt: "2025-05-22T08:45:00",
    resolvedAt: "2025-05-22T11:30:00",
    severity: 5,
    resolutionTimeMinutes: 165,
    description: "Large tree fallen on power lines",
    images: {
      before: "https://images.unsplash.com/photo-1517660029921-0cbea2f15f8f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      after: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    }
  },
  {
    id: "INC-012",
    type: "road-damage",
    taluk: "belthangady",
    reportedAt: "2025-05-23T12:35:00",
    resolvedAt: "2025-05-23T18:15:00",
    severity: 6,
    resolutionTimeMinutes: 340,
    description: "Road washed out after flash flooding",
    images: {
      before: "https://images.unsplash.com/photo-1594789020554-98211634c116?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      after: "https://images.unsplash.com/photo-1487452066049-a710f7296400?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    }
  },
  {
    id: "INC-013",
    type: "medical-emergency",
    taluk: "surathkal",
    reportedAt: "2025-05-24T09:15:00",
    resolvedAt: "2025-05-24T10:00:00",
    severity: 10,
    resolutionTimeMinutes: 45,
    description: "Medical emergency at school",
    images: {
      before: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      after: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    }
  },
  {
    id: "INC-014",
    type: "fire",
    taluk: "mangalore",
    reportedAt: "2025-05-25T22:05:00",
    resolvedAt: "2025-05-26T01:30:00",
    severity: 9,
    resolutionTimeMinutes: 205,
    description: "Kitchen fire in restaurant",
    images: {
      before: "https://images.unsplash.com/photo-1584824486516-0555a07fc511?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      after: "https://images.unsplash.com/photo-1629772244930-8cc6bd63d956?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    }
  },
  {
    id: "INC-015",
    type: "traffic-signal-failure",
    taluk: "bantwal",
    reportedAt: "2025-05-27T16:40:00",
    resolvedAt: "2025-05-27T19:20:00",
    severity: 7,
    resolutionTimeMinutes: 160,
    description: "Traffic signals not working due to power outage",
    images: {
      before: "https://images.unsplash.com/photo-1594408052115-7e8b8a6261f9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      after: "https://images.unsplash.com/photo-1617469767053-5f035f7f6a9b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    }
  },
];
