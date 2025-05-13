
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSeverityDistribution } from "@/utils/dataUtils";

const SeverityDistribution: React.FC = () => {
  const data = getSeverityDistribution();
  const maxValue = Math.max(...data);
  
  // Generate colors from green to red based on severity level
  const getSeverityColor = (index: number): string => {
    const colors = [
      "#22c55e", "#34d399", "#4ade80", "#86efac", // Greens (1-4)
      "#fbbf24", "#f59e0b", "#fcd34d", "#fef08a", // Yellows/Oranges (5-8)
      "#f97316", "#ef4444" // Oranges/Reds (9-10)
    ];
    return colors[index];
  };
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Severity Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end h-[250px] gap-1 pt-6">
          {data.map((value, index) => {
            const heightPercent = maxValue > 0 ? (value / maxValue) * 100 : 0;
            
            return (
              <div 
                key={index} 
                className="flex flex-col items-center flex-1"
              >
                <div className="relative w-full">
                  <div
                    className="w-full rounded-t"
                    style={{
                      height: `${heightPercent}%`,
                      backgroundColor: getSeverityColor(index),
                      minHeight: value > 0 ? '4px' : '0'
                    }}
                  />
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs">
                    {value > 0 && value}
                  </div>
                </div>
                <div className="mt-2 text-xs">{index + 1}</div>
              </div>
            );
          })}
        </div>
        <div className="mt-6 flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Low Severity</span>
          <div className="h-2 flex-1 mx-4 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded"></div>
          <span className="text-xs text-muted-foreground">High Severity</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default SeverityDistribution;
