
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { getIncidentDistributionByTaluk } from "@/utils/dataUtils";

const IncidentsByTaluk: React.FC = () => {
  const data = getIncidentDistributionByTaluk();
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Incidents by Taluk</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 5, right: 20, bottom: 65, left: 0 }}>
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" name="Incidents" fill="#0EA5E9" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default IncidentsByTaluk;
