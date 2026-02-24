import { useState, useEffect } from "react";
import { getProperties, deleteProperty, getAnalytics } from "../services/api";
import PropertyCard from "../components/PropertyCard";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";
import "./Dashboard.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function Dashboard() {
    const [properties, setProperties] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [analyticsType, setAnalyticsType] = useState("Buy");
    const [loading, setLoading] = useState(true);
    const [city, setCity] = useState("");
    const [propertyType, setPropertyType] = useState("");
    const [bedrooms, setBedrooms] = useState("");
    const [sort, setSort] = useState("");

    const fetchListings = async () => {
        setLoading(true);
        try {
            const filters = {};
            if (city) filters.city = city;
            if (propertyType) filters.propertyType = propertyType;
            if (bedrooms) filters.bedrooms = bedrooms;
            if (sort) filters.sort = sort;
            const data = await getProperties(filters);
            setProperties(data);
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAnalytics = async () => {
        try {
            const data = await getAnalytics(analyticsType);
            setAnalytics(data);
        } catch (err) {
            console.error("Analytics error:", err);
        }
    };

    useEffect(() => { fetchListings(); }, [city, propertyType, bedrooms, sort]);
    useEffect(() => { fetchAnalytics(); }, [analyticsType]);

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this property?")) return;
        try {
            await deleteProperty(id);
            setProperties((prev) => prev.filter((p) => p._id !== id));
            fetchAnalytics();
        } catch (err) {
            console.error("Delete failed:", err);
        }
    };

    const clearFilters = () => { setCity(""); setPropertyType(""); setBedrooms(""); setSort(""); };
    const hasFilters = city || propertyType || bedrooms || sort;

    const formatPrice = (price) => {
        if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
        if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
        return `₹${price.toLocaleString("en-IN")}`;
    };

    const barData = analytics ? {
        labels: analytics.averagePricePerCity.map((d) => d.city),
        datasets: [{
            label: analyticsType === "Buy" ? "Avg Buy Price (₹)" : "Avg Monthly Rent (₹)",
            data: analytics.averagePricePerCity.map((d) => d.average),
            backgroundColor: analyticsType === "Buy" ? "#14b8a6" : "#3b82f6",
            borderRadius: 6,
        }],
    } : null;

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: "#94a3b8", font: { size: 13 } } } },
        scales: {
            x: { ticks: { color: "#94a3b8" }, grid: { color: "rgba(148,163,184,0.08)" } },
            y: { ticks: { color: "#94a3b8" }, grid: { color: "rgba(148,163,184,0.08)" } },
        },
    };

    return (
        <div className="dashboard-page">
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h1>Dashboard</h1>
                    <p>{properties.length} {properties.length === 1 ? "property" : "properties"} found</p>
                </div>

                {/* ─── Analytics Section ────────────────────────── */}
                {analytics && (
                    <div className="analytics-section">
                        <div className="analytics-type-bar">
                            <span className="analytics-label">Analytics for:</span>
                            <select value={analyticsType} onChange={(e) => setAnalyticsType(e.target.value)}>
                                <option value="Buy">Buy</option>
                                <option value="Rent">Rent</option>
                            </select>
                        </div>

                        <div className="chart-card">
                            <h3>Average {analyticsType === "Buy" ? "Price" : "Rent"} Per City</h3>
                            <div className="chart-wrapper"><Bar data={barData} options={chartOptions} /></div>
                        </div>

                        <div className="top-areas-row">
                            <div className="top-card">
                                <h3>🔥 Top 3 Expensive</h3>
                                {analytics.topExpensive.map((item, i) => (
                                    <div key={i} className="top-item">
                                        <div>
                                            <span className="top-area">{item.area}</span>
                                            <span className="top-city">{item.city}</span>
                                        </div>
                                        <span className="top-price expensive">{formatPrice(item.price)}</span>
                                    </div>
                                ))}
                                {analytics.topExpensive.length === 0 && <p className="no-data">No data</p>}
                            </div>
                            <div className="top-card">
                                <h3>💰 Top 3 Affordable</h3>
                                {analytics.topAffordable.map((item, i) => (
                                    <div key={i} className="top-item">
                                        <div>
                                            <span className="top-area">{item.area}</span>
                                            <span className="top-city">{item.city}</span>
                                        </div>
                                        <span className="top-price affordable">{formatPrice(item.price)}</span>
                                    </div>
                                ))}
                                {analytics.topAffordable.length === 0 && <p className="no-data">No data</p>}
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── Listings ─────────────────────────────────── */}
                <h2 className="listings-title">Property Listings</h2>
                <div className="filter-bar">
                    <select value={city} onChange={(e) => setCity(e.target.value)}>
                        <option value="">All Cities</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Pune">Pune</option>
                        <option value="Bangalore">Bangalore</option>
                    </select>
                    <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
                        <option value="">Buy & Rent</option>
                        <option value="Buy">Buy</option>
                        <option value="Rent">Rent</option>
                    </select>
                    <select value={bedrooms} onChange={(e) => setBedrooms(e.target.value)}>
                        <option value="">All Bedrooms</option>
                        {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} BHK</option>)}
                    </select>
                    <select value={sort} onChange={(e) => setSort(e.target.value)}>
                        <option value="">Sort: Latest</option>
                        <option value="price_asc">Price: Low → High</option>
                        <option value="price_desc">Price: High → Low</option>
                    </select>
                    {hasFilters && <button className="clear-btn" onClick={clearFilters}>Clear</button>}
                </div>

                {loading ? (
                    <div className="dashboard-empty"><p>Loading...</p></div>
                ) : properties.length === 0 ? (
                    <div className="dashboard-empty">
                        <div className="empty-icon">🏠</div>
                        <h3>No properties found</h3>
                        <p>Try adjusting filters or add a new property.</p>
                    </div>
                ) : (
                    <div className="property-grid">
                        {properties.map((p) => <PropertyCard key={p._id} property={p} onDelete={handleDelete} />)}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
