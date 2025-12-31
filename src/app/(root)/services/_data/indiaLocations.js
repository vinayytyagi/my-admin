/**
 * India Locations Data for Service Pages
 * Organized by district/region with high-intent cities for IT services SEO
 */

export const INDIA_LOCATIONS = {
  // ═══════════════════════════════════════════════════════════════
  // DELHI NCR (Primary Focus - Complete List)
  // ═══════════════════════════════════════════════════════════════
  "delhi-ncr": {
    name: "Delhi NCR",
    slug: "delhi-ncr",
    priority: 1,
    cities: [
      // NCT Delhi
      { name: "New Delhi", slug: "new-delhi" },
      { name: "Delhi", slug: "delhi" },
      // Uttar Pradesh
      { name: "Noida", slug: "noida" },
      { name: "Greater Noida", slug: "greater-noida" },
      { name: "Ghaziabad", slug: "ghaziabad" },
      { name: "Meerut", slug: "meerut" },
      { name: "Hapur", slug: "hapur" },
      { name: "Bulandshahr", slug: "bulandshahr" },
      { name: "Baghpat", slug: "baghpat" },
      { name: "Muzaffarnagar", slug: "muzaffarnagar" },
      { name: "Shamli", slug: "shamli" },
      // Haryana
      { name: "Gurugram", slug: "gurugram" },
      { name: "Faridabad", slug: "faridabad" },
      { name: "Sonipat", slug: "sonipat" },
      { name: "Panipat", slug: "panipat" },
      { name: "Rohtak", slug: "rohtak" },
      { name: "Jhajjar", slug: "jhajjar" },
      { name: "Rewari", slug: "rewari" },
      { name: "Palwal", slug: "palwal" },
      { name: "Karnal", slug: "karnal" },
      { name: "Bhiwani", slug: "bhiwani" },
      // Rajasthan (NCR part)
      { name: "Alwar", slug: "alwar" },
      { name: "Bharatpur", slug: "bharatpur" },
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // TIER 1 IT HUBS
  // ═══════════════════════════════════════════════════════════════
  "bangalore": {
    name: "Bangalore Region",
    slug: "bangalore",
    priority: 2,
    cities: [
      { name: "Bangalore", slug: "bangalore" },
      { name: "Bengaluru", slug: "bengaluru" },
      { name: "Electronic City", slug: "electronic-city" },
      { name: "Whitefield", slug: "whitefield" },
    ]
  },
  "hyderabad": {
    name: "Hyderabad Region",
    slug: "hyderabad",
    priority: 2,
    cities: [
      { name: "Hyderabad", slug: "hyderabad" },
      { name: "Cyberabad", slug: "cyberabad" },
      { name: "HITEC City", slug: "hitec-city" },
      { name: "Secunderabad", slug: "secunderabad" },
    ]
  },
  "pune": {
    name: "Pune Region",
    slug: "pune",
    priority: 2,
    cities: [
      { name: "Pune", slug: "pune" },
      { name: "Hinjewadi", slug: "hinjewadi" },
      { name: "Kharadi", slug: "kharadi" },
      { name: "Pimpri-Chinchwad", slug: "pimpri-chinchwad" },
    ]
  },
  "chennai": {
    name: "Chennai Region",
    slug: "chennai",
    priority: 2,
    cities: [
      { name: "Chennai", slug: "chennai" },
      { name: "OMR", slug: "omr" },
      { name: "Ambattur", slug: "ambattur" },
    ]
  },
  "mumbai": {
    name: "Mumbai Region",
    slug: "mumbai",
    priority: 2,
    cities: [
      { name: "Mumbai", slug: "mumbai" },
      { name: "Navi Mumbai", slug: "navi-mumbai" },
      { name: "Thane", slug: "thane" },
      { name: "Andheri", slug: "andheri" },
      { name: "Powai", slug: "powai" },
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // TIER 2 EMERGING IT HUBS
  // ═══════════════════════════════════════════════════════════════
  "other-metros": {
    name: "Other Major Cities",
    slug: "india",
    priority: 3,
    cities: [
      { name: "Kolkata", slug: "kolkata" },
      { name: "Ahmedabad", slug: "ahmedabad" },
      { name: "Chandigarh", slug: "chandigarh" },
      { name: "Jaipur", slug: "jaipur" },
      { name: "Lucknow", slug: "lucknow" },
      { name: "Kochi", slug: "kochi" },
      { name: "Indore", slug: "indore" },
      { name: "Coimbatore", slug: "coimbatore" },
      { name: "Thiruvananthapuram", slug: "thiruvananthapuram" },
      { name: "Bhubaneswar", slug: "bhubaneswar" },
      { name: "Visakhapatnam", slug: "visakhapatnam" },
      { name: "Mysore", slug: "mysore" },
      { name: "Vadodara", slug: "vadodara" },
      { name: "Nagpur", slug: "nagpur" },
      { name: "Surat", slug: "surat" },
    ]
  }
};

// Helper functions
export const getAllDistricts = () => Object.entries(INDIA_LOCATIONS)
  .map(([key, data]) => ({ key, ...data }))
  .sort((a, b) => a.priority - b.priority);

export const getCitiesForDistrict = (districtKey) => 
  INDIA_LOCATIONS[districtKey]?.cities || [];

export const getAllCities = () => Object.values(INDIA_LOCATIONS)
  .flatMap(district => district.cities.map(city => ({
    ...city,
    districtSlug: district.slug,
    districtName: district.name
  })));

export const findDistrictBySlug = (slug) => 
  Object.entries(INDIA_LOCATIONS).find(([_, data]) => data.slug === slug)?.[1];

export const findCityBySlug = (citySlug, districtKey = null) => {
  if (districtKey) {
    return INDIA_LOCATIONS[districtKey]?.cities.find(c => c.slug === citySlug);
  }
  for (const district of Object.values(INDIA_LOCATIONS)) {
    const city = district.cities.find(c => c.slug === citySlug);
    if (city) return { ...city, districtSlug: district.slug };
  }
  return null;
};
