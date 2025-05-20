import React, { useState, useEffect } from 'react';
import { COUNTRIES, Gender, GENDER_OPTIONS, Country } from '@/lib/utils';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

// Define the user profile interface
export interface UserProfile {
  username: string;
  preferredGender: Gender;
  preferredCountry: Country;
  microphoneEnabled: boolean;
  isDarkMode: boolean;
}

// Default profile settings
const defaultProfile: UserProfile = {
  username: '',
  preferredGender: 'both',
  preferredCountry: 'any',
  microphoneEnabled: true,
  isDarkMode: true
};

interface UserProfileProps {
  onSave: (profile: UserProfile) => void;
  isOpen: boolean;
  onClose: () => void;
  initialProfile?: Partial<UserProfile>;
}

export const UserProfileComponent: React.FC<UserProfileProps> = ({
  onSave,
  isOpen,
  onClose,
  initialProfile = {}
}) => {
  // Merge initial profile with defaults
  const [profile, setProfile] = useState<UserProfile>({
    ...defaultProfile,
    ...initialProfile
  });

  // Effect to update profile when initialProfile changes
  useEffect(() => {
    if (initialProfile) {
      setProfile(prev => ({
        ...prev,
        ...initialProfile
      }));
    }
  }, [initialProfile]);

  // Handle changes to profile fields
  const handleChange = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(profile);
    onClose();
  };

  // Return null if the modal is not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#121212] border border-[#FF7F2A]/30 rounded-lg max-w-md w-full p-6 shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF7F2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          Your Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-white/80 text-sm font-medium mb-1">
              Display Name
            </label>
            <input
              type="text"
              id="username"
              value={profile.username}
              onChange={(e) => handleChange('username', e.target.value)}
              placeholder="How others will see you"
              className="w-full bg-black/50 border border-[#FF7F2A]/30 text-white rounded-md p-2 focus:outline-none focus:border-[#FF7F2A]"
            />
          </div>

          {/* Preferred Gender */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-1">
              I want to chat with
            </label>
            <Select 
              value={profile.preferredGender} 
              onValueChange={(value: Gender) => handleChange('preferredGender', value)}
            >
              <SelectTrigger className="bg-black/50 border border-[#FF7F2A]/30 text-white focus:ring-0 focus:ring-offset-0 rounded-md w-full">
                <SelectValue placeholder="Select gender preference" />
              </SelectTrigger>
              <SelectContent className="bg-[#0A1525] text-white border border-[#FF7F2A]/30">
                {GENDER_OPTIONS.map((option) => (
                  <SelectItem key={option.id} value={option.id} className="text-white hover:bg-[#FF7F2A]/20">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Preferred Country */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-1">
              Preferred Country
            </label>
            <Select 
              value={profile.preferredCountry} 
              onValueChange={(value: Country) => handleChange('preferredCountry', value)}
            >
              <SelectTrigger className="bg-black/50 border border-[#FF7F2A]/30 text-white focus:ring-0 focus:ring-offset-0 rounded-md w-full">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent className="bg-[#0A1525] text-white border border-[#FF7F2A]/30 max-h-60 overflow-y-auto">
                {COUNTRIES.map((country) => (
                  <SelectItem key={country.value} value={country.value} className="text-white hover:bg-[#FF7F2A]/20">
                    {country.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Microphone Enabled */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="microphoneEnabled"
              checked={profile.microphoneEnabled}
              onChange={(e) => handleChange('microphoneEnabled', e.target.checked)}
              className="mr-2 h-4 w-4 rounded border-gray-300 text-[#FF7F2A] focus:ring-[#FF7F2A]"
            />
            <label htmlFor="microphoneEnabled" className="text-white/80 text-sm font-medium">
              Enable microphone by default
            </label>
          </div>

          {/* Dark Mode */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isDarkMode"
              checked={profile.isDarkMode}
              onChange={(e) => handleChange('isDarkMode', e.target.checked)}
              className="mr-2 h-4 w-4 rounded border-gray-300 text-[#FF7F2A] focus:ring-[#FF7F2A]"
            />
            <label htmlFor="isDarkMode" className="text-white/80 text-sm font-medium">
              Dark mode
            </label>
          </div>

          {/* Button group */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-black/50 border border-white/30 text-white rounded-md hover:bg-black/70"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#FF7F2A] text-white rounded-md hover:bg-[#FF7F2A]/80"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Hook to manage user profile with local storage persistence
export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile>(() => {
    // Try to load from localStorage
    const savedProfile = localStorage.getItem('onviaUserProfile');
    return savedProfile ? JSON.parse(savedProfile) : defaultProfile;
  });

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Save to localStorage when profile changes
  useEffect(() => {
    localStorage.setItem('onviaUserProfile', JSON.stringify(profile));
  }, [profile]);

  return {
    profile,
    updateProfile: (newProfile: Partial<UserProfile>) => {
      setProfile(prev => ({
        ...prev,
        ...newProfile
      }));
    },
    isProfileOpen,
    openProfile: () => setIsProfileOpen(true),
    closeProfile: () => setIsProfileOpen(false)
  };
}