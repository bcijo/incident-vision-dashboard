
import React from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "lucide-react";

const AppHeader: React.FC = () => {
  const { toast } = useToast();
  
  const handleExport = () => {
    toast({
      title: "Data Exported",
      description: "Your data has been exported to CSV format.",
    });
  };

  return (
    <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
          <span className="text-white font-semibold text-lg">IR</span>
        </div>
        <h1 className="text-xl font-semibold">Incident Resolution Analytics</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center px-3 py-1.5 bg-secondary rounded-md text-sm">
          <Calendar className="h-4 w-4 mr-2" />
          <span>May 1 - May 31, 2025</span>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport}>
          Export Data
        </Button>
      </div>
    </header>
  );
};

export default AppHeader;
