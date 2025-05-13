
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { getIncidentDistributionByType } from "@/utils/dataUtils";

const COLORS = [
  "#0EA5E9", "#6366F1", "#8B5CF6", "#F43F5E", 
  "#F97316", "#10B981", "#A3E635", "#FBBF24"
];

const IncidentTypeDistribution: React.FC = () => {
  const data = getIncidentDistributionByType();
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Incident Types</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value} incidents`, name]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {data.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-sm" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }} 
                />
                <span className="text-xs text-muted-foreground truncate">
                  {entry.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IncidentTypeDistribution;
