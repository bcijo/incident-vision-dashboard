
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { incidentTypes } from "@/data/incidentTypes";
import { talukData } from "@/data/talukData";
import { calculateIncidentSeverity } from "@/utils/dataUtils";
import { predictSeverityScore } from "@/utils/geminiUtils";

const SeverityPrediction: React.FC = () => {
  const [incidentType, setIncidentType] = useState<string>("");
  const [taluk, setTaluk] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [severity, setSeverity] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [useGemini, setUseGemini] = useState<boolean>(true);
  
  const handlePredict = async () => {
    if (!incidentType || !taluk) return;
    
    setLoading(true);
    setError("");
    setExplanation("");
    
    try {
      if (useGemini && description) {
        // Get incident type name for better context
        const incidentTypeName = incidentTypes.find(type => type.id === incidentType)?.name || incidentType;
        const talukName = talukData.find(t => t.id === taluk)?.name || taluk;
        
        // Use Gemini for prediction
        const result = await predictSeverityScore(incidentTypeName, description, talukName);
        
        // Convert 1-5 scale to 1-10 scale for consistency with the app
        const scaledScore = Math.round(result.score * 2);
        setSeverity(scaledScore);
        setExplanation(result.explanation);
      } else {
        // Fallback to original calculation method
        const predictedSeverity = calculateIncidentSeverity(incidentType, taluk);
        setSeverity(predictedSeverity);
        setExplanation("");
      }
    } catch (err) {
      console.error("Prediction error:", err);
      setError(err instanceof Error ? err.message : "Failed to predict severity");
      
      // Fallback to original calculation method
      const predictedSeverity = calculateIncidentSeverity(incidentType, taluk);
      setSeverity(predictedSeverity);
    } finally {
      setLoading(false);
    }
  };
  
  // Get color for severity indicator
  const getSeverityColor = (score: number): string => {
    if (score <= 3) return "bg-green-500";
    if (score <= 6) return "bg-yellow-500";
    if (score <= 8) return "bg-orange-500";
    return "bg-red-500";
  };
  
  // Get severity level text
  const getSeverityText = (score: number): string => {
    if (score <= 3) return "Low";
    if (score <= 6) return "Medium";
    if (score <= 8) return "High";
    return "Critical";
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Severity Prediction</h1>
        <p className="text-muted-foreground mt-1">
          Predict incident severity based on details
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Incident Details</CardTitle>
              <CardDescription>
                Enter information about the incident to predict severity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
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
                  <Label htmlFor="image">Image Upload</Label>
                  <Input id="image" type="file" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the incident"
                    rows={4}
                  />
                  {useGemini && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Description is required for Gemini AI prediction
                    </p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="use-gemini"
                    checked={useGemini}
                    onChange={(e) => setUseGemini(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="use-gemini" className="text-sm font-normal cursor-pointer">
                    Use Gemini AI for advanced severity prediction
                  </Label>
                </div>
                
                <Button 
                  type="button" 
                  onClick={handlePredict}
                  disabled={!incidentType || !taluk || (useGemini && !description) || loading}
                >
                  {loading ? "Predicting..." : "Predict Severity"}
                </Button>
                
                {error && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Severity Prediction</CardTitle>
            <CardDescription>
              Predicted severity score and analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center h-[300px]">
            {severity ? (
              <>
                <div className="text-center mb-4">
                  <div className="text-sm font-medium text-muted-foreground mb-2">
                    Severity Score
                  </div>
                  <div className="flex items-center justify-center">
                    <div
                      className={`w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold ${getSeverityColor(
                        severity
                      )}`}
                    >
                      {severity}
                    </div>
                  </div>
                </div>
                
                <div className="text-center mt-2">
                  <h3 className="text-xl font-semibold">
                    {getSeverityText(severity)} Severity
                  </h3>
                  {explanation ? (
                    <div className="mt-4 p-3 bg-muted rounded-md">
                      <div className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <p className="text-sm">{explanation}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground mt-2">
                      This incident requires {getSeverityText(severity).toLowerCase()} priority attention.
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center text-muted-foreground">
                <p>Enter incident details and click "Predict Severity"</p>
                <p className="mt-2">to see prediction results</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SeverityPrediction;
