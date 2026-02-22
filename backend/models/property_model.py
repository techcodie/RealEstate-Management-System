from pydantic import BaseModel
from typing import List


class Property(BaseModel):
    location: str
    area: int
    bedrooms: int
    amenities: List[str] = []
