import { useState } from "react";
import { calculateProperty } from "../services/api";
import "./Search.css";

// City → Areas mapping (mirrors backend pricingEngine.js)
const CITY_AREAS = {
    Mumbai: [
        { name: "Bandra", tier: "Premium" },
        { name: "Powai", tier: "Premium" },
        { name: "Andheri", tier: "Mid" },
        { name: "Malad", tier: "Mid" },
        { name: "Borivali", tier: "Affordable" },
    ],
    Pune: [
        { name: "Koregaon Park", tier: "Premium" },
        { name: "Baner", tier: "Premium" },
        { name: "Hinjewadi", tier: "Mid" },
        { name: "Kharadi", tier: "Mid" },
        { name: "Wakad", tier: "Affordable" },
    ],
    Bangalore: [
        { name: "Koramangala", tier: "Premium" },
        { name: "Indiranagar", tier: "Premium" },
        { name: "HSR Layout", tier: "Mid" },
        { name: "Whitefield", tier: "Mid" },
        { name: "Electronic City", tier: "Affordable" },
    ],
};

const CITIES = Object.keys(CITY_AREAS);

function Search() {
    const [city, setCity] = useState("");
    const [area, setArea] = useState("");
    const [bedrooms, setBedrooms] = useState("");
    const [propertyType, setPropertyType] = useState("Buy");
    const [amenities, setAmenities] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const areas = city ? CITY_AREAS[city] : [];

    const handleCityChange = (e) => {
        setCity(e.target.value);
        setArea(""); // Reset area when city changes
        setResult(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setResult(null);
        setLoading(true);

        try {
            const data = {
                city,
                area,
                bedrooms: Number(bedrooms),
                propertyType,
                amenities: amenities
                    ? amenities.split(",").map((a) => a.trim()).filter(Boolean)
                    : [],
            };

            const response = await calculateProperty(data);
            setResult(response);
        } catch (err) {
            setError("Failed to calculate price. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
        if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
        return `₹${price.toLocaleString("en-IN")}`;
    };

    return (
        <div className="search-page">
            <div className="search-container">
                <div className="search-header">
                    <h1>Property Price Search</h1>
                    <p>Get instant price estimates and investment insights</p>
                </div>

                <div className="search-layout">
                    {/* ─── Form Panel ─────────────────────────────── */}
                    <form className="search-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>City</label>
                            <select value={city} onChange={handleCityChange} required>
                                <option value="">Select City</option>
                                {CITIES.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Area</label>
                            <select value={area} onChange={(e) => setArea(e.target.value)} required disabled={!city}>
                                <option value="">Select Area</option>
                                {areas.map((a) => (
                                    <option key={a.name} value={a.name}>
                                        {a.name} ({a.tier})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Bedrooms</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    placeholder="e.g. 3"
                                    value={bedrooms}
                                    onChange={(e) => setBedrooms(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Property Type</label>
                                <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
                                    <option value="Buy">Buy</option>
                                    <option value="Rent">Rent</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Amenities <span className="label-hint">(comma-separated)</span></label>
                            <input
                                type="text"
                                placeholder="e.g. pool, gym, parking"
                                value={amenities}
                                onChange={(e) => setAmenities(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? "Calculating..." : "Get Estimate"}
                        </button>
                    </form>

                    {/* ─── Results Panel ──────────────────────────── */}
                    <div className="results-panel">
                        {!result && !error && (
                            <div className="results-empty">
                                <div className="empty-icon">🔍</div>
                                <p>Fill the form and click <strong>Get Estimate</strong> to see pricing insights.</p>
                            </div>
                        )}

                        {error && <div className="error-msg">{error}</div>}

                        {result && (
                            <div className="results-content">
                                <div className="result-main">
                                    <span className="result-label">
                                        {propertyType === "Buy" ? "Estimated Price" : "Monthly Rent"}
                                    </span>
                                    <span className="result-price">
                                        {formatPrice(propertyType === "Buy" ? result.price : result.monthlyRent)}
                                    </span>
                                </div>

                                <div className="result-grid">
                                    <div className="result-card">
                                        <span className="rc-label">Investment Score</span>
                                        <span className={`rc-value score-${result.investmentScore.toLowerCase()}`}>
                                            {result.investmentScore}
                                        </span>
                                    </div>

                                    <div className="result-card">
                                        <span className="rc-label">Area Tier</span>
                                        <span className="rc-value">{result.areaTier}</span>
                                    </div>

                                    {propertyType === "Buy" && result.fiveYearAppreciation && (
                                        <>
                                            <div className="result-card">
                                                <span className="rc-label">5-Year Appreciation</span>
                                                <span className="rc-value appreciation">
                                                    +{formatPrice(result.fiveYearAppreciation)}
                                                </span>
                                            </div>

                                            <div className="result-card">
                                                <span className="rc-label">Future Value (5Y)</span>
                                                <span className="rc-value">
                                                    {formatPrice(result.futureValue)}
                                                </span>
                                            </div>
                                        </>
                                    )}

                                    {propertyType === "Rent" && (
                                        <div className="result-card">
                                            <span className="rc-label">Property Value</span>
                                            <span className="rc-value">{formatPrice(result.price)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Search;
