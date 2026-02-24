import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProperty } from "../services/api";
import "./AddProperty.css";

const CITY_AREAS = {
    Mumbai: ["Bandra", "Powai", "Andheri", "Malad", "Borivali"],
    Pune: ["Koregaon Park", "Baner", "Hinjewadi", "Kharadi", "Wakad"],
    Bangalore: ["Koramangala", "Indiranagar", "HSR Layout", "Whitefield", "Electronic City"],
};

const CITIES = Object.keys(CITY_AREAS);

function AddProperty() {
    const navigate = useNavigate();
    const [city, setCity] = useState("");
    const [area, setArea] = useState("");
    const [bedrooms, setBedrooms] = useState("");
    const [propertyType, setPropertyType] = useState("Buy");
    const [amenities, setAmenities] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const areas = city ? CITY_AREAS[city] : [];

    const handleCityChange = (e) => {
        setCity(e.target.value);
        setArea("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess(false);
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

            await createProperty(data);
            setSuccess(true);

            // Reset form
            setCity("");
            setArea("");
            setBedrooms("");
            setPropertyType("Buy");
            setAmenities("");

            // Navigate to dashboard after short delay
            setTimeout(() => navigate("/dashboard"), 1500);
        } catch (err) {
            setError("Failed to create property. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-page">
            <div className="add-container">
                <div className="add-header">
                    <h1>Add New Property</h1>
                    <p>Create a new listing with auto-calculated pricing</p>
                </div>

                <form className="add-form" onSubmit={handleSubmit}>
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
                                <option key={a} value={a}>{a}</option>
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
                                placeholder="e.g. 2"
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
                        <label>Amenities <span className="label-hint">(comma-separated, optional)</span></label>
                        <input
                            type="text"
                            placeholder="e.g. pool, gym, parking, garden"
                            value={amenities}
                            onChange={(e) => setAmenities(e.target.value)}
                        />
                    </div>

                    {error && <div className="form-error">{error}</div>}
                    {success && <div className="form-success">✅ Property created! Redirecting to dashboard...</div>}

                    <button type="submit" className="submit-btn" disabled={loading || success}>
                        {loading ? "Creating..." : "Add Property"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddProperty;
