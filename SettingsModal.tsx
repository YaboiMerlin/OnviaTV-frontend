import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { COUNTRIES, GENDER_OPTIONS, type Gender, type Country, type UserPreferences } from "@/lib/utils";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onSave: (preferences: UserPreferences) => void;
  isCameraOn: boolean;
  isMicrophoneOn: boolean;
  onToggleCamera: () => void;
  onToggleMicrophone: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onSave,
  isCameraOn,
  isMicrophoneOn,
  onToggleCamera,
  onToggleMicrophone
}) => {
  const [gender, setGender] = React.useState<Gender>(preferences.gender);
  const [country, setCountry] = React.useState<Country>(preferences.country);
  
  React.useEffect(() => {
    setGender(preferences.gender);
    setCountry(preferences.country);
  }, [preferences, isOpen]);
  
  const handleSave = () => {
    onSave({ gender, country });
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#0A1525] text-white border border-white max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium">Settings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Camera Settings */}
          <div>
            <h4 className="text-white font-medium mb-3">Camera</h4>
            <div className="flex items-center justify-between">
              <Label htmlFor="camera-toggle">Enable Camera</Label>
              <Switch
                id="camera-toggle"
                checked={isCameraOn}
                onCheckedChange={onToggleCamera}
                className="data-[state=checked]:bg-[#40E0D0]"
              />
            </div>
          </div>
          
          {/* Microphone Settings */}
          <div>
            <h4 className="text-white font-medium mb-3">Microphone</h4>
            <div className="flex items-center justify-between">
              <Label htmlFor="mic-toggle">Enable Microphone</Label>
              <Switch
                id="mic-toggle"
                checked={isMicrophoneOn}
                onCheckedChange={onToggleMicrophone}
                className="data-[state=checked]:bg-[#40E0D0]"
              />
            </div>
          </div>
          
          {/* Filters */}
          <div>
            <h4 className="text-white font-medium mb-3">Filters</h4>
            
            <div className="mb-4">
              <Label className="block mb-2">Gender Preference</Label>
              <div className="flex justify-between items-center gap-2">
                {GENDER_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setGender(option.id as Gender)}
                    className={`flex-1 py-2 px-3 ${
                      gender === option.id
                        ? "border border-[#40E0D0] text-[#40E0D0] shadow-[0_0_8px_rgba(64,224,208,0.4)]"
                        : "bg-transparent border border-white text-white"
                    } text-center text-sm font-medium transition-all`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <Label className="block mb-2">Country</Label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger className="bg-transparent border border-white text-white py-2 px-4 appearance-none w-full focus:outline-none focus:border-[#40E0D0] h-10">
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent className="bg-[#0A1525] text-white border border-white">
                  {COUNTRIES.map((country) => (
                    <SelectItem key={country.value} value={country.value} className="text-white hover:bg-[#152238] focus:bg-[#152238]">
                      {country.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <DialogFooter className="border-t border-white border-opacity-30 pt-4">
          <Button
            onClick={handleSave}
            className="bg-transparent border border-white text-white hover:border-[#40E0D0] hover:text-[#40E0D0] font-medium py-2 px-6"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
