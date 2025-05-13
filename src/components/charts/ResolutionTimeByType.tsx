
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { getResolutionTimeByType } from "@/utils/dataUtils";

const ResolutionTimeByType: React.FC = () => {
  const data = getResolutionTimeByType();
  
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Avg. Resolution Time by Type</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart 
              data={data} 
              layout="vertical"
              margin={{ top: 5, right: 20, bottom: 5, left: 100 }}
            >
              <XAxis type="number" />
              <YAxis 
                dataKey="name" 
                type="category" 
                scale="band"
                width={100}
                tick={{ fontSize: 12 }}
              />
              <Tooltip formatter={(value) => [`${formatTime(value)}`, "Avg. Resolution Time"]} />
              <Bar dataKey="value" name="Minutes" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResolutionTimeByType;
