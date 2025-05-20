import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getRandomId = () => {
  return Math.random().toString(36).substring(2, 9);
};

export const formatMessageTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const COUNTRIES = [
  { value: "any", label: "Worldwide (Any Country)" },
  { value: "us", label: "United States" },
  { value: "ca", label: "Canada" },
  { value: "uk", label: "United Kingdom" },
  { value: "au", label: "Australia" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "jp", label: "Japan" },
  { value: "br", label: "Brazil" },
  { value: "mx", label: "Mexico" },
];

export const GENDER_OPTIONS = [
  { id: "male", label: "Male" },
  { id: "female", label: "Female" },
  { id: "both", label: "Both" },
];

export type Gender = "male" | "female" | "both";
export type Country = string;

export interface UserPreferences {
  gender: Gender;
  country: Country;
}

export interface Message {
  id: string;
  text: string;
  sender: "user" | "stranger";
  timestamp: Date;
}
