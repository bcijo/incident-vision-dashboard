import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { analyzeImagesWithGemini } from "@/utils/geminiUtils";
import { mockIncidents } from "@/data/mockIncidents";
import { CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

const ImageAnalysis: React.FC = () => {
  const [beforeImage, setBeforeImage] = useState<string>("");
  const [afterImage, setAfterImage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<{
    description: string;
    resolved: boolean;
    confidence: number;
  } | null>(null);

  // Function to validate data URL format
  const isValidDataUrl = (dataUrl: string, type: string): boolean => {
    const matches = dataUrl.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/i);
    if (!matches || matches.length !== 3) {
      console.error(`Invalid data URL format for ${type}:`, dataUrl.substring(0, 100));
      toast.error(`Invalid image format for ${type} image. Please upload a valid JPEG or PNG.`);
      return false;
    }
    const format = matches[1].toLowerCase();
    if (!["jpeg", "png", "jpg"].includes(format)) {
      console.error(`Unsupported format for ${type}:`, format);
      toast.error(`Unsupported image format for ${type}: ${format}. Use JPEG or PNG.`);
      return false;
    }
    return true;
  };

  // Function to handle image selection
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>, type: "before" | "after") => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      console.log(`Selected ${type} image:`, file.name, `Size: ${file.size} bytes`);

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size exceeds 5MB. Please upload a smaller image.");
        return;
      }

      // Validate file type
      if (!file.type.match(/image\/(jpeg|png|jpg)/i)) {
        toast.error("Please upload a JPEG or PNG image.");
        return;
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        if (e.target?.result) {
          const result = e.target.result as string;
          console.log(`Image (${type}) data:`, result.substring(0, 50));
          // Validate data URL before setting state
          if (isValidDataUrl(result, type)) {
            if (type === "before") {
              setBeforeImage(result);
            } else {
              setAfterImage(result);
            }
          }
        } else {
          toast.error(`Failed to read ${type} image.`);
        }
      };

      reader.onerror = () => {
        toast.error(`Error reading ${type} image file.`);
      };

      reader.readAsDataURL(file);
    }
  };

  // Function to use sample images
  const useSampleImages = () => {
    console.log("Loading sample images...");
    if (mockIncidents.length > 0) {
      const sample = mockIncidents[0];
      console.log("Sample images:", {
        before: sample.images.before.substring(0, 50),
        after: sample.images.after.substring(0, 50)
      });
      // Validate sample images
      if (
        isValidDataUrl(sample.images.before, "before sample") &&
        isValidDataUrl(sample.images.after, "after sample")
      ) {
        setBeforeImage(sample.images.before);
        setAfterImage(sample.images.after);
        toast.success("Sample images loaded successfully");
      }
    } else {
      toast.error("No sample images available");
    }
  };

  // Function to analyze images
  const handleAnalyze = async () => {
    console.log("Analyze button clicked", {
      beforeImage: beforeImage.substring(0, 50),
      afterImage: afterImage.substring(0, 50)
    });
    if (!beforeImage || !afterImage) {
      toast.error("Please upload both before and after images");
      return;
    }

    setLoading(true);

    try {
      const analysisResult = await analyzeImagesWithGemini(beforeImage, afterImage);
      console.log("Analysis result:", analysisResult);
      setResult(analysisResult);
      toast.success("Analysis completed successfully");
    } catch (error) {
      console.error("Error analyzing images:", error);
      toast.error(error instanceof Error ? error.message : "Failed to analyze images. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Image Difference Analysis</h1>
        <p className="text-muted-foreground mt-1">
          Compare before and after images to analyze resolution status using Gemini AI
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
                  accept="image/jpeg,image/png"
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
                  accept="image/jpeg,image/png"
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

          <div className="flex gap-4 mt-6">
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