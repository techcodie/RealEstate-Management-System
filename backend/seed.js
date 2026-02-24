const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Property = require("./models/Property");
const { calculatePrice, CITY_AREAS } = require("./utils/pricingEngine");

dotenv.config();

// ─── Sample property data covering all cities & areas ────────
const sampleProperties = [];

const bedroomOptions = [1, 2, 3, 4, 5];
const typeOptions = ["Buy", "Rent"];
const amenityPool = ["pool", "gym", "parking", "garden", "security", "lift", "clubhouse"];

// Pick random amenities
function randomAmenities() {
    const count = Math.floor(Math.random() * 4); // 0 to 3 amenities
    const shuffled = amenityPool.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Generate diverse listings across every city/area
for (const city of Object.keys(CITY_AREAS)) {
    for (const area of Object.keys(CITY_AREAS[city])) {
        // Create 2-3 listings per area for variety
        const count = 2 + Math.floor(Math.random() * 2);
        for (let i = 0; i < count; i++) {
            const bedrooms = bedroomOptions[Math.floor(Math.random() * bedroomOptions.length)];
            const propertyType = typeOptions[Math.floor(Math.random() * typeOptions.length)];
            const amenities = randomAmenities();

            const result = calculatePrice({ city, area, bedrooms, propertyType, amenities });

            sampleProperties.push({
                city,
                area,
                bedrooms,
                propertyType,
                amenities,
                price: propertyType === "Rent" ? result.monthlyRent : result.price,
            });
        }
    }
}

// ─── Seed the database ───────────────────────────────────────
async function seedDB() {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            serverSelectionTimeoutMS: 10000,
            tls: true,
            tlsInsecure: true,
        });
        console.log("✅ Connected to MongoDB Atlas");

        // Clear existing properties
        await Property.deleteMany({});
        console.log("🗑️  Cleared existing properties");

        // Insert new data
        const inserted = await Property.insertMany(sampleProperties);
        console.log(`🏠 Inserted ${inserted.length} properties`);

        // Show a summary
        const cities = [...new Set(inserted.map((p) => p.city))];
        for (const city of cities) {
            const cityProps = inserted.filter((p) => p.city === city);
            console.log(`   ${city}: ${cityProps.length} listings`);
        }

        await mongoose.disconnect();
        console.log("\n✅ Database seeded successfully!");
    } catch (err) {
        console.error("❌ Seed failed:", err.message);
        process.exit(1);
    }
}

seedDB();
