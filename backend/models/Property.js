const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
    {
        city: {
            type: String,
            required: true,
        },
        area: {
            type: String,
            required: true,
        },
        bedrooms: {
            type: Number,
            required: true,
        },
        propertyType: {
            type: String,
            enum: ["Buy", "Rent"],
            required: true,
        },
        amenities: {
            type: [String],
            default: [],
        },
        price: {
            type: Number,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { collection: "properties" }
);

module.exports = mongoose.model("Property", propertySchema);
