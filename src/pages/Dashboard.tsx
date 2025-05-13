
import React from "react";
import { BarChart, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import StatCard from "@/components/charts/StatCard";
import IncidentsByTaluk from "@/components/charts/IncidentsByTaluk";
import IncidentTypeDistribution from "@/components/charts/IncidentTypeDistribution";
import ResolutionTimeByType from "@/components/charts/ResolutionTimeByType";
import SeverityDistribution from "@/components/charts/SeverityDistribution";
import { mockIncidents } from "@/data/mockIncidents";

const Dashboard: React.FC = () => {
  const totalIncidents = mockIncidents.length;
  
  // Calculate average resolution time
  const avgResolutionTime = Math.round(
    mockIncidents.reduce((acc, incident) => acc + incident.resolutionTimeMinutes, 0) / 
    totalIncidents
  );
  
  // Format resolution time as hours and minutes
  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  
  // Count high severity incidents (7 or higher)
  const highSeverityCount = mockIncidents.filter(
    incident => incident.severity >= 7
  ).length;
  
  // Calculate resolution rate
  const resolvedIncidents = mockIncidents.filter(
    incident => incident.resolvedAt
  ).length;
  const resolutionRate = Math.round((resolvedIncidents / totalIncidents) * 100);
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Monitor incident trends and resolution analytics
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Incidents"
          value={totalIncidents}
          icon={<BarChart className="h-5 w-5" />}
          trend={12}
        />
        <StatCard
          title="Avg. Resolution Time"
          value={formatTime(avgResolutionTime)}
          icon={<Clock className="h-5 w-5" />}
          trend={-8}
        />
        <StatCard
          title="High Severity"
          value={highSeverityCount}
          description={`${Math.round((highSeverityCount / totalIncidents) * 100)}% of total`}
          icon={<AlertTriangle className="h-5 w-5" />}
          trend={5}
        />
        <StatCard
          title="Resolution Rate"
          value={`${resolutionRate}%`}
          icon={<CheckCircle className="h-5 w-5" />}
          trend={3}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IncidentsByTaluk />
        <IncidentTypeDistribution />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ResolutionTimeByType />
        <SeverityDistribution />
      </div>
    </div>
  );
};

export default Dashboard;
