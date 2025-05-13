
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { incidentTypes } from "@/data/incidentTypes";
import { talukData } from "@/data/talukData";
import { calculateIncidentSeverity, predictResolutionTime } from "@/utils/dataUtils";

const ResolutionTimePrediction: React.FC = () => {
  const [incidentType, setIncidentType] = useState<string>("");
  const [taluk, setTaluk] = useState<string>("");
  const [severity, setSeverity] = useState<number>(5);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<{
    minutes: number;
    confidence: number;
  } | null>(null);
  
  // Automatically calculate severity when incident type and taluk change
  React.useEffect(() => {
    if (incidentType && taluk) {
      const calculatedSeverity = calculateIncidentSeverity(incidentType, taluk);
      setSeverity(calculatedSeverity);
    }
  }, [incidentType, taluk]);
  
  const handlePredict = () => {
    if (!incidentType || !taluk) return;
    
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const minutes = predictResolutionTime(incidentType, taluk, severity);
      
      setPrediction({
        minutes,
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
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="severity">Severity ({severity})</Label>
                    <span className="text-sm text-muted-foreground">
                      Auto-calculated
                    </span>
                  </div>
                  <div className="pt-2">
                    <Progress value={severity * 10} className="h-2" />
                  </div>
                </div>
                
                <div className="pt-2">
                  <Button 
                    type="button" 
                    onClick={handlePredict}
                    disabled={!incidentType || !taluk || loading}
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
