import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <NavLink to="/" className="navbar-logo">
                    <span className="logo-icon">🏙️</span>
                    <span className="logo-text">Metro<span className="logo-accent">Estate</span></span>
                </NavLink>

                <div className="navbar-links">
                    <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} end>
                        Home
                    </NavLink>
                    <NavLink to="/search" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                        Search
                    </NavLink>
                    <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                        Dashboard
                    </NavLink>
                    <NavLink to="/add" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                        Add Property
                    </NavLink>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
