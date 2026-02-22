def calculate_price(property_data):
    base_price_per_sqft = 8000
    base_price = property_data.area * base_price_per_sqft
    bedroom_adjustment = property_data.bedrooms * 500000
    amenity_adjustment = len(property_data.amenities) * 200000

    final_price = base_price + bedroom_adjustment + amenity_adjustment

    if final_price > 8000000:
        investment_score = "High"
    else:
        investment_score = "Medium"

    return {
        "predicted_price": final_price,
        "investment_score": investment_score
    }
