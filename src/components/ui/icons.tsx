import { GraduationCap, HeartPulse, Microscope, Pill, Smile, Stethoscope, type LucideIcon } from "lucide-react";
import type { Programme } from "@/types/content";

export const programmeIcons: Record<Programme["icon"], LucideIcon> = {
  stethoscope: Stethoscope,
  graduation: GraduationCap,
  smile: Smile,
  heart: HeartPulse,
  pill: Pill,
  microscope: Microscope,
};
