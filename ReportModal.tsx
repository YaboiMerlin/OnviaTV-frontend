import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReport: (reason: string, details: string) => void;
}

const REPORT_REASONS = [
  { id: "inappropriate", label: "Inappropriate behavior" },
  { id: "nudity", label: "Nudity or sexual content" },
  { id: "harassment", label: "Harassment or bullying" },
  { id: "spam", label: "Spam or scam" },
  { id: "underage", label: "Underage user" },
  { id: "other", label: "Other" }
];

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  onReport
}) => {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  
  const handleSubmit = () => {
    if (reason) {
      onReport(reason, details);
      setReason("");
      setDetails("");
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#0A1525] text-white border border-white max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium">Report User</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-gray-300 mb-4">Please select the reason for reporting this user:</p>
          
          <RadioGroup value={reason} onValueChange={setReason} className="space-y-3">
            {REPORT_REASONS.map((item) => (
              <div key={item.id} className="flex items-center">
                <RadioGroupItem
                  value={item.id}
                  id={`reason-${item.id}`}
                  className="text-[#40E0D0] border-white"
                />
                <Label htmlFor={`reason-${item.id}`} className="ml-2">
                  {item.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
          
          <div className="pt-4">
            <Textarea
              placeholder="Additional details (optional)"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full bg-transparent border border-white p-3 text-white focus:outline-none focus:border-[#40E0D0] resize-none h-24"
            />
          </div>
        </div>
        
        <DialogFooter className="border-t border-white border-opacity-30 pt-4 flex justify-between">
          <Button
            onClick={onClose}
            className="bg-transparent text-white font-medium py-2 px-6 border border-white hover:border-[#40E0D0] hover:text-[#40E0D0]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!reason}
            className="bg-transparent border border-white text-white font-medium py-2 px-6 hover:border-[#40E0D0] hover:text-[#40E0D0]"
          >
            Report & Block
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
