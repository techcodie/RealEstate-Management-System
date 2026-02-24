// ─── City-wise base price per sqft ───────────────────────────
const CITY_BASE_PRICES = {
    Mumbai: 15000,
    Pune: 8000,
    Bangalore: 10000,
};

// ─── Area data with multiplier and tier ──────────────────────
const CITY_AREAS = {
    Mumbai: {
        Bandra: { multiplier: 1.3, tier: "Premium" },
        Andheri: { multiplier: 1.0, tier: "Mid" },
        Powai: { multiplier: 1.3, tier: "Premium" },
        Malad: { multiplier: 1.0, tier: "Mid" },
        Borivali: { multiplier: 0.8, tier: "Affordable" },
    },
    Pune: {
        "Koregaon Park": { multiplier: 1.3, tier: "Premium" },
        Baner: { multiplier: 1.3, tier: "Premium" },
        Hinjewadi: { multiplier: 1.0, tier: "Mid" },
        Kharadi: { multiplier: 1.0, tier: "Mid" },
        Wakad: { multiplier: 0.8, tier: "Affordable" },
    },
    Bangalore: {
        Koramangala: { multiplier: 1.3, tier: "Premium" },
        Indiranagar: { multiplier: 1.3, tier: "Premium" },
        "HSR Layout": { multiplier: 1.0, tier: "Mid" },
        Whitefield: { multiplier: 1.0, tier: "Mid" },
        "Electronic City": { multiplier: 0.8, tier: "Affordable" },
    },
};

// ─── Estimated property size (sqft) based on bedrooms ────────
const BEDROOM_SIZES = {
    1: 500,
    2: 850,
    3: 1200,
    4: 1800,
    5: 2500,
};

// ─── Main pricing function ───────────────────────────────────
function calculatePrice(data) {
    const { city, area, bedrooms, propertyType, amenities } = data;

    // Lookup values (with safe fallbacks)
    const cityBasePrice = CITY_BASE_PRICES[city] || 10000;
    const areaInfo = CITY_AREAS[city]?.[area] || { multiplier: 1.0, tier: "Mid" };
    const areaSize = BEDROOM_SIZES[bedrooms] || bedrooms * 400;

    // Core formula
    const base = areaSize * cityBasePrice;
    const adjusted = base * areaInfo.multiplier;
    const bedroomAdjustment = bedrooms * 300000;
    const amenityBonus = (amenities?.length || 0) * 100000;

    const finalPrice = Math.round(adjusted + bedroomAdjustment + amenityBonus);

    // Monthly rent (only for Rent type)
    let monthlyRent = null;
    if (propertyType === "Rent") {
        monthlyRent = Math.round((finalPrice * 0.03) / 12);
    }

    // Investment score based on area multiplier
    let investmentScore;
    let appreciationRate;

    if (areaInfo.multiplier >= 1.2) {
        investmentScore = "High";
        appreciationRate = 0.08;
    } else if (areaInfo.multiplier >= 1.0) {
        investmentScore = "Medium";
        appreciationRate = 0.05;
    } else {
        investmentScore = "Low";
        appreciationRate = 0.03;
    }

    // 5-year appreciation (only for Buy type)
    const fiveYearValue = Math.round(finalPrice * Math.pow(1 + appreciationRate, 5));
    const fiveYearAppreciation = fiveYearValue - finalPrice;

    return {
        price: finalPrice,
        monthlyRent,
        investmentScore,
        areaTier: areaInfo.tier,
        fiveYearAppreciation: propertyType === "Buy" ? fiveYearAppreciation : null,
        futureValue: propertyType === "Buy" ? fiveYearValue : null,
    };
}

module.exports = { calculatePrice, CITY_AREAS };
