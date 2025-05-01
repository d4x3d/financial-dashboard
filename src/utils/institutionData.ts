// This file contains financial institution data for the transfer page
// Format: { id: number, name: string, type: string, swift: string }
// Types: HO = Head Office, BR = Branch, SU = Subsidiary, NB = Non-Financial

// Define the Institution interface
export interface Institution {
  id: number;
  name: string;
  type: string;
  swift?: string; // Using string to store SWIFT or 'N' as per original list structure
}

/**
 * INSTITUTION DATA FORMAT EXAMPLE:
 *
 * To add more institutions, follow this format:
 *
 * { id: 1, name: "INSTITUTION NAME", type: "TYPE", swift: "SWIFT_CODE" }
 *
 * Where:
 * - id: A unique number (use the number from your institution list - corresponds to the FIRST occurrence)
 * - name: The full name of the institution in UPPERCASE
 * - type: One of "HO" (Head Office), "BR" (Branch), "SU" (Subsidiary), or "NB" (Non-Financial)
 * - swift: The SWIFT/BIC code if available, or "N" if not available
 */

// Institution data derived from the provided list, ensuring each unique name appears only once.
const institutionData: Institution[] = [
  { id: 1, name: "ABBEY NAT TREASURY SVC CT BR", type: "BR", swift: "ANTSUS31XXX" },
  { id: 2, name: "ABBEY NATIONAL SECURITIES INC", type: "NB", swift: "ANSSUS33XXX" },
  { id: 3, name: "ABN AMRO BK NV NY FIFTH AVE BR", type: "BR", swift: "N" },
  { id: 4, name: "ABN AMRO INCORPORATED", type: "NB", swift: "N" },
  { id: 5, name: "ABN-AMRO BK NV CHICAGO BR", type: "BR", swift: "ABNAUS4CXXX" },
  { id: 6, name: "ABN-AMRO BK NV NY BR", type: "BR", swift: "ABNAUS33XXX" },
  { id: 7, name: "ALLIANZ GLOBAL INVESTORS DISTRIBUTORS LLC", type: "NB", swift: "N" },
  { id: 8, name: "ALLIANZ LIFE FINANCIAL SERVICES LLC", type: "NB", swift: "N" },
  { id: 9, name: "ALLIED IRISH NORTH AMERICA INC", type: "NB", swift: "N" },
  { id: 10, name: "ALLIED IRISH BKS NY BR", type: "BR", swift: "N" },
  { id: 11, name: "AMEGY NATIONAL ASSOCIATION", type: "HO", swift: "SWBKUS44" },
  { id: 12, name: "AMEGY INVESTMENTS INC", type: "NB", swift: "N" },
  { id: 13, name: "AMERICAN EXPRESS CENTURION", type: "HO", swift: "N" },
  { id: 14, name: "AMERICAN EXPRESS COMPANY", type: "HO", swift: "N" },
  { id: 15, name: "AMERIKA SAMOA", type: "SU", swift: "ANZBASPAXXX" },
  { id: 16, name: "ANZ GUAM INC", type: "SU", swift: "N" },
  { id: 17, name: "ANZ SECURITIES INC", type: "NB", swift: "N" },
  { id: 18, name: "ARAB BKG CORP NY BR", type: "BR", swift: "ABCOUS33XXX" },
  { id: 19, name: "ASSET BACKED SECURITIES CORPORATION", type: "NB", swift: "N" },
  { id: 20, name: "AUSTRALIA & NEW ZEALAND NY BR", type: "BR", swift: "ANZBUS33XXX" },
  // Many more institutions...
  { id: 165, name: "CITIBANK NA", type: "HO", swift: "CITIUS33" },
  { id: 336, name: "JPMORGAN CHASE NATIONAL ASSOCIATION", type: "HO", swift: "CHASUS33" },
  { id: 500, name: "STATE STREET AND TRUST COMPANY", type: "HO", swift: "SBOSUS33" },
  { id: 588, name: "WELLS FARGO NATIONAL ASSOCIATION", type: "HO", swift: "WFBIUS6S" }
];

// Function to search institutions by name
export const searchInstitutions = (query: string): Institution[] => {
  if (!query || query.trim() === '') {
    // Return some major institutions or first few alphabetically if no query
    const majorIds = [58, 336, 588, 165, 500]; // Example major IDs
    const majorInstitutions = institutionData.filter(institution => majorIds.includes(institution.id));
    const otherInstitutions = institutionData.filter(institution => !majorIds.includes(institution.id)).slice(0, 10 - majorInstitutions.length);
    return [...majorInstitutions, ...otherInstitutions];
  }

  const normalizedQuery = query.toLowerCase().trim();
  
  // First find institutions that start with the query
  const startsWith = institutionData.filter(institution =>
    institution.name.toLowerCase().startsWith(normalizedQuery)
  );
  
  // Then find institutions that contain the query but don't start with it
  const contains = institutionData.filter(institution =>
    institution.name.toLowerCase().includes(normalizedQuery) &&
    !startsWith.some(swInstitution => swInstitution.id === institution.id) // Exclude those already found
  );
  
  // Return combined results, prioritizing exact matches, then starts with, then contains
  // Limit to 10 results for performance
  return [...startsWith, ...contains].slice(0, 10);
};

// Function to get an institution by ID
export const getInstitutionById = (id: number): Institution | undefined => {
  return institutionData.find(institution => institution.id === id);
};

// Function to get all institutions (paginated)
export const getAllInstitutions = (page: number = 1, pageSize: number = 100): Institution[] => {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return institutionData.slice(start, end); // Currently returns in original (ID-based) order
};

// Export the institutions data
export default institutionData;
