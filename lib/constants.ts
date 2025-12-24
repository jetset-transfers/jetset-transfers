// Company founding year - used to calculate dynamic years of experience
// Jetset Transfers has been operating in Cancún since 2020
export const FOUNDING_YEAR = 2020;

// Calculate years of experience dynamically
export function getYearsOfExperience(): number {
  const currentYear = new Date().getFullYear();
  return currentYear - FOUNDING_YEAR;
}

// Get formatted years string (e.g., "15+")
export function getYearsOfExperienceFormatted(): string {
  return `${getYearsOfExperience()}+`;
}
