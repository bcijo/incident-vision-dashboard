
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { analyzeImages } from "@/utils/dataUtils";
import { mockIncidents } from "@/data/mockIncidents";
import { CheckCircle, XCircle } from "lucide-react";

const ImageAnalysis: React.FC = () => {
  const [beforeImage, setBeforeImage] = useState<string>("");
  const [afterImage, setAfterImage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<{
    description: string;
    resolved: boolean;
    confidence: number;
  } | null>(null);
  
  // Function to handle image selection
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>, type: "before" | "after") => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        if (e.target?.result) {
          if (type === "before") {
            setBeforeImage(e.target.result as string);
          } else {
            setAfterImage(e.target.result as string);
          }
        }
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  // Function to use sample images
  const useSampleImages = () => {
    if (mockIncidents.length > 0) {
      const sample = mockIncidents[0];
      setBeforeImage(sample.images.before);
      setAfterImage(sample.images.after);
    }
  };
  
  const handleAnalyze = async () => {
    if (!beforeImage || !afterImage) return;
    
    setLoading(true);
    
    try {
      // Call the analysis function from dataUtils
      const analysisResult = await analyzeImages(beforeImage, afterImage);
      setResult(analysisResult);
    } catch (error) {
      console.error("Error analyzing images:", error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Image Difference Analysis</h1>
        <p className="text-muted-foreground mt-1">
          Compare before and after images to analyze resolution status
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Upload Images</CardTitle>
          <CardDescription>
            Upload before and after images to analyze differences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="before-image">Before Image</Label>
                <Input 
                  id="before-image" 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => handleImageSelect(e, "before")}
                />
              </div>
              
              {beforeImage && (
                <div className="border rounded-md overflow-hidden h-48 flex items-center justify-center bg-muted">
                  <img 
                    src={beforeImage} 
                    alt="Before" 
                    className="max-w-full max-h-full object-contain" 
                  />
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="after-image">After Image</Label>
                <Input 
                  id="after-image" 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => handleImageSelect(e, "after")}
                />
              </div>
              
              {afterImage && (
                <div className="border rounded-md overflow-hidden h-48 flex items-center justify-center bg-muted">
                  <img 
                    src={afterImage} 
                    alt="After" 
                    className="max-w-full max-h-full object-contain" 
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              type="button"
              onClick={useSampleImages}
            >
              Use Sample Images
            </Button>
            
            <Button
              type="button"
              onClick={handleAnalyze}
              disabled={!beforeImage || !afterImage || loading}
            >
              {loading ? "Analyzing..." : "Analyze Images"}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>
              AI-powered analysis of image differences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-center p-4">
                <div
                  className={`rounded-full p-3 ${
                    result.resolved
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {result.resolved ? (
                    <CheckCircle className="h-8 w-8" />
                  ) : (
                    <XCircle className="h-8 w-8" />
                  )}
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium">
                    {result.resolved ? "Issue Resolved" : "Issue Not Resolved"}
                  </h3>
                  <div className="flex items-center mt-1">
                    <div className="text-sm text-muted-foreground mr-2">
                      Confidence:
                    </div>
                    <div className="flex items-center">
                      <Progress
                        value={result.confidence * 100}
                        className="h-2 w-24"
                      />
                      <span className="text-sm ml-2">
                        {Math.round(result.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-muted p-4 rounded-md">
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-sm">{result.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ImageAnalysis;
