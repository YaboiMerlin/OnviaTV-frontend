import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AnimatedBackground } from "./AnimatedBackground";
import { COUNTRIES, GENDER_OPTIONS, type Gender, type Country, type UserPreferences } from "@/lib/utils";

interface LandingPageProps {
  onStartChat: (preferences: UserPreferences) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartChat }) => {
  const [gender, setGender] = useState<Gender>("both");
  const [country, setCountry] = useState<Country>("any");

  const handleStartChat = () => {
    onStartChat({ gender, country });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between py-12 px-6">
      <AnimatedBackground />
      
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md">
        {/* Logo */}
        <div className="mb-10 text-center">
          <svg viewBox="0 0 300 250" className="w-56 h-44 mx-auto fill-[#00BCD4]">
            <path d="M256,68.34H43.53c-5.23,0-9.47,4.24-9.47,9.47V202c0,5.23,4.24,9.47,9.47,9.47H256
                  c5.23,0,9.47-4.24,9.47-9.47V77.81C265.47,72.58,261.23,68.34,256,68.34z M238.39,183.07H61.14V96.74h177.25V183.07z
                  M220.23,211.74c0,3.99-3.23,7.22-7.22,7.22s-7.22-3.23-7.22-7.22s3.23-7.22,7.22-7.22S220.23,207.75,220.23,211.74z
                  M244.06,211.74c0,3.99-3.23,7.22-7.22,7.22s-7.22-3.23-7.22-7.22s3.23-7.22,7.22-7.22S244.06,207.75,244.06,211.74z
                  M113.01,46.79l36.51,21.55h-73.02L113.01,46.79z M186.52,46.79l36.51,21.55h-73.02L186.52,46.79z" />
            
            {/* LOOM TV Text */}
            <text x="150" y="150" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold" fontSize="36">LOOM</text>
            <text x="150" y="195" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold" fontSize="32">TV</text>
          </svg>
        </div>
        
        {/* User Count (Optional) */}
        <div className="mb-10 flex items-center">
          <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
          <p className="text-white text-sm">12,345 users online</p>
        </div>
        
        {/* Main Action Button */}
        <Button 
          onClick={handleStartChat}
          className="bg-[#00BCD4] text-white font-medium py-6 px-8 rounded-md text-xl hover:bg-[#00ACC1] transition-all duration-300 mb-12 w-64 flex items-center justify-center h-14 shadow-lg"
        >
          <i className="ri-vidicon-line mr-2"></i> Start Chatting
        </Button>
        
        {/* Filters Section */}
        <div className="w-full mb-10">
          <h3 className="font-medium text-lg mb-6 text-center text-white">Chat Preferences</h3>
          
          {/* Gender and Country Filters in horizontal layout */}
          <div className="flex space-x-4">
            {/* Gender Filter */}
            <div className="flex-1">
              <p className="text-sm text-gray-300 mb-3">Gender</p>
              <div className="flex flex-col space-y-2">
                {GENDER_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setGender(option.id as Gender)}
                    className={`py-2 px-3 rounded-md ${
                      gender === option.id
                        ? "bg-[#00BCD4] text-white shadow-md"
                        : "bg-transparent border border-white text-white hover:border-[#00BCD4]"
                    } text-center text-sm font-medium transition-all`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Country Selection */}
            <div className="flex-1">
              <p className="text-sm text-gray-300 mb-3">Country</p>
              <div className="relative">
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger className="bg-transparent border border-white text-white rounded-md py-6 px-4 appearance-none w-full focus:outline-none focus:border-[#00BCD4] h-12">
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1F1F1F] text-white border border-white rounded-md">
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country.value} value={country.value} className="text-white hover:bg-[#2D2D2D] focus:bg-[#2D2D2D]">
                        {country.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Menu */}
      <div className="flex justify-center items-center gap-8 text-sm text-white py-4">
        <a href="#" className="hover:text-[#00BCD4] transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-[#00BCD4] transition-colors">Terms of Use</a>
        <a href="#" className="hover:text-[#00BCD4] transition-colors">Contact</a>
      </div>
    </div>
  );
};
