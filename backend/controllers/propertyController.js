const Property = require("../models/Property");
const { calculatePrice } = require("../utils/pricingEngine");

// ─── POST /api/properties/calculate ──────────────────────────
// Accept property details, return calculated pricing data
const calculate = async (req, res) => {
    try {
        const { city, area, bedrooms, propertyType, amenities } = req.body;

        if (!city || !area || !bedrooms || !propertyType) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const result = calculatePrice({ city, area, bedrooms, propertyType, amenities });
        res.json(result);
    } catch (err) {
        console.error("Calculate error:", err.message);
        res.status(500).json({ error: "Failed to calculate price" });
    }
};

// ─── POST /api/properties ────────────────────────────────────
// Save a new property listing to MongoDB
const createProperty = async (req, res) => {
    try {
        const { city, area, bedrooms, propertyType, amenities } = req.body;

        if (!city || !area || !bedrooms || !propertyType) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const result = calculatePrice({ city, area, bedrooms, propertyType, amenities });

        const property = new Property({
            city,
            area,
            bedrooms,
            propertyType,
            amenities: amenities || [],
            price: propertyType === "Rent" ? result.monthlyRent : result.price,
        });

        await property.save();
        res.status(201).json(property);
    } catch (err) {
        console.error("Create error:", err.message);
        res.status(500).json({ error: "Failed to create property" });
    }
};

// ─── GET /api/properties ─────────────────────────────────────
// Return all listings with optional filters and sorting
const getProperties = async (req, res) => {
    try {
        const { city, propertyType, bedrooms, sort } = req.query;
        const filter = {};

        if (city) filter.city = city;
        if (propertyType) filter.propertyType = propertyType;
        if (bedrooms) filter.bedrooms = Number(bedrooms);

        let sortOption = { createdAt: -1 };
        if (sort === "price_asc") sortOption = { price: 1 };
        if (sort === "price_desc") sortOption = { price: -1 };

        const properties = await Property.find(filter).sort(sortOption);
        res.json(properties);
    } catch (err) {
        console.error("Fetch error:", err.message);
        res.status(500).json({ error: "Failed to fetch properties" });
    }
};

// ─── DELETE /api/properties/:id ──────────────────────────────
// Delete a property by ID (admin simulation)
const deleteProperty = async (req, res) => {
    try {
        const property = await Property.findByIdAndDelete(req.params.id);

        if (!property) {
            return res.status(404).json({ error: "Property not found" });
        }

        res.json({ message: "Property deleted successfully" });
    } catch (err) {
        console.error("Delete error:", err.message);
        res.status(500).json({ error: "Failed to delete property" });
    }
};

// ─── GET /api/properties/analytics ───────────────────────────
// Return analytics computed with simple JavaScript
// Accepts ?type=Buy or ?type=Rent to filter by property type
const getAnalytics = async (req, res) => {
    try {
        const { type } = req.query;

        // Apply filter if type is provided
        const filter = {};
        if (type) filter.propertyType = type;

        const properties = await Property.find(filter);

        // A) Average price per city
        const cityMap = {};
        for (const p of properties) {
            if (!cityMap[p.city]) cityMap[p.city] = { total: 0, count: 0 };
            cityMap[p.city].total += p.price;
            cityMap[p.city].count += 1;
        }
        const averagePricePerCity = Object.keys(cityMap).map((city) => ({
            city,
            average: Math.round(cityMap[city].total / cityMap[city].count),
        }));

        // B) Top 3 expensive areas
        const sorted = [...properties].sort((a, b) => b.price - a.price);
        const topExpensive = sorted.slice(0, 3).map((p) => ({
            city: p.city,
            area: p.area,
            price: p.price,
        }));

        // C) Top 3 affordable areas
        const topAffordable = sorted
            .slice(-3)
            .reverse()
            .map((p) => ({
                city: p.city,
                area: p.area,
                price: p.price,
            }));

        res.json({ averagePricePerCity, topExpensive, topAffordable });
    } catch (err) {
        console.error("Analytics error:", err.message);
        res.status(500).json({ error: "Failed to fetch analytics" });
    }
};

module.exports = { calculate, createProperty, getProperties, deleteProperty, getAnalytics };
