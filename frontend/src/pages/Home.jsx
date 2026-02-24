import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
    return (
        <div className="home">
            {/* ─── Hero Section ─────────────────────────────────── */}
            <section className="hero">
                <div className="hero-glow"></div>
                <div className="hero-content">
                    <p className="hero-tag">Smart Real Estate Platform</p>
                    <h1 className="hero-title">
                        Metro<span className="accent">Estate</span>
                    </h1>
                    <p className="hero-subtitle">
                        Discover property prices across India's top metro cities. Get instant
                        valuations, investment insights, and 5-year appreciation forecasts —
                        all powered by smart data.
                    </p>
                    <div className="hero-actions">
                        <Link to="/search" className="btn btn-primary">
                            Search Properties
                        </Link>
                        <Link to="/dashboard" className="btn btn-secondary">
                            View Listings
                        </Link>
                    </div>
                </div>
            </section>

            {/* ─── Features Section ─────────────────────────────── */}
            <section className="features">
                <div className="features-container">
                    <h2 className="section-title">Why Metro Estate?</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">📊</div>
                            <h3>Smart Pricing</h3>
                            <p>
                                Dynamic price calculation based on city, area tier, bedrooms,
                                and amenities — tailored to each metro market.
                            </p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">📈</div>
                            <h3>Investment Score</h3>
                            <p>
                                Instant High / Medium / Low investment scoring based on area
                                demand and growth potential.
                            </p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🏙️</div>
                            <h3>Metro Coverage</h3>
                            <p>
                                Covering Mumbai, Pune, and Bangalore with 15+ premium, mid-range,
                                and affordable neighborhoods.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── CTA Section ──────────────────────────────────── */}
            <section className="cta">
                <div className="cta-container">
                    <h2>Ready to explore?</h2>
                    <p>Start by adding a property or searching for price estimates.</p>
                    <div className="cta-actions">
                        <Link to="/add" className="btn btn-primary">Add Property</Link>
                        <Link to="/search" className="btn btn-outline">Get Estimate</Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;
