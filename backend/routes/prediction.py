from fastapi import APIRouter
from datetime import datetime
from models.property_model import Property
from services.pricing_engine import calculate_price
from database.mongo import properties_collection

router = APIRouter()


@router.post("/predict")
def predict_price(property_data: Property):
    result = calculate_price(property_data)

    document = {
        "location": property_data.location,
        "area": property_data.area,
        "bedrooms": property_data.bedrooms,
        "amenities": property_data.amenities,
        "predicted_price": result["predicted_price"],
        "investment_score": result["investment_score"],
        "created_at": datetime.now()
    }

    properties_collection.insert_one(document)

    return {
        "predicted_price": result["predicted_price"],
        "investment_score": result["investment_score"]
    }
