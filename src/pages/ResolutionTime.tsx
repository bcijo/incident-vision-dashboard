
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { incidentTypes } from "@/data/incidentTypes";
import { talukData } from "@/data/talukData";
import { predictResolutionTime } from "@/utils/dataUtils";

const ResolutionTimePrediction: React.FC = () => {
  const [incidentType, setIncidentType] = useState<string>("");
  const [taluk, setTaluk] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [severity, setSeverity] = useState<number>(5);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<{
    minutes: number;
    confidence: number;
  } | null>(null);
  
  // List of months
  const months = [
    { id: "01", name: "January" },
    { id: "02", name: "February" },
    { id: "03", name: "March" },
    { id: "04", name: "April" },
    { id: "05", name: "May" },
    { id: "06", name: "June" },
    { id: "07", name: "July" },
    { id: "08", name: "August" },
    { id: "09", name: "September" },
    { id: "10", name: "October" },
    { id: "11", name: "November" },
    { id: "12", name: "December" }
  ];
  
  const handlePredict = () => {
    if (!incidentType || !taluk || !month) return;
    
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Use user-selected severity
      const minutes = predictResolutionTime(incidentType, taluk, severity);
      
      // Apply seasonal adjustment based on month
      let seasonalFactor = 1.0;
      const monthNum = parseInt(month);
      
      // Monsoon months (June to September) may have longer resolution times
      if (monthNum >= 6 && monthNum <= 9) {
        seasonalFactor = 1.3; // 30% longer during monsoon
      }
      // Winter months (December to February) may have slightly longer times
      else if (monthNum === 12 || monthNum <= 2) {
        seasonalFactor = 1.1; // 10% longer during winter
      }
      
      const adjustedMinutes = Math.round(minutes * seasonalFactor);
      
      setPrediction({
        minutes: adjustedMinutes,
        confidence: Math.round(70 + Math.random() * 20)
      });
      
      setLoading(false);
    }, 1000);
  };
  
  // Format resolution time
  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    return hours > 0 
      ? `${hours} hour${hours !== 1 ? 's' : ''} ${mins > 0 ? `${mins} min${mins !== 1 ? 's' : ''}` : ''}`
      : `${mins} minute${mins !== 1 ? 's' : ''}`;
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Resolution Time Prediction</h1>
        <p className="text-muted-foreground mt-1">
          Predict incident resolution time based on details
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Incident Details</CardTitle>
              <CardDescription>
                Enter information to predict resolution time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="incident-type">Incident Type</Label>
                    <Select
                      value={incidentType}
                      onValueChange={setIncidentType}
                    >
                      <SelectTrigger id="incident-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {incidentTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="taluk">Location (Taluk)</Label>
                    <Select
                      value={taluk}
                      onValueChange={setTaluk}
                    >
                      <SelectTrigger id="taluk">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {talukData.map((t) => (
                          <SelectItem key={t.id} value={t.id}>
                            {t.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="month">Month of Year</Label>
                    <Select
                      value={month}
                      onValueChange={setMonth}
                    >
                      <SelectTrigger id="month">
                        <SelectValue placeholder="Select month" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            {m.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2 mt-4">
                  <div className="flex justify-between">
                    <Label htmlFor="severity">Severity ({severity})</Label>
                    <span className="text-sm text-muted-foreground">
                      1 (Minor) to 10 (Critical)
                    </span>
                  </div>
                  <input
                    type="range"
                    id="severity"
                    min="1"
                    max="10"
                    step="1"
                    value={severity}
                    onChange={(e) => setSeverity(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Minor</span>
                    <span>Moderate</span>
                    <span>Critical</span>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button 
                    type="button" 
                    onClick={handlePredict}
                    disabled={!incidentType || !taluk || !month || loading}
                  >
                    {loading ? "Predicting..." : "Predict Resolution Time"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Time Prediction</CardTitle>
            <CardDescription>
              Estimated resolution time and confidence
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center h-[300px]">
            {prediction ? (
              <>
                <div className="text-center mb-6">
                  <div className="text-sm font-medium text-muted-foreground mb-1">
                    Estimated Resolution Time
                  </div>
                  <h3 className="text-3xl font-bold">
                    {formatTime(prediction.minutes)}
                  </h3>
                </div>
                
                <div className="w-full space-y-4 mt-2">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Confidence</span>
                      <span>{prediction.confidence}%</span>
                    </div>
                    <Progress value={prediction.confidence} className="h-2" />
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <p className="text-center">
                      This prediction is based on historical data for similar incidents
                      in this location.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center text-muted-foreground">
                <p>Enter incident details and click</p>
                <p>"Predict Resolution Time"</p>
                <p className="mt-2">to see prediction results</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResolutionTimePrediction;
