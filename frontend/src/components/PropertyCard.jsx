import "./PropertyCard.css";

function PropertyCard({ property, onDelete }) {
    const isBuy = property.propertyType === "Buy";

    const formatPrice = (price) => {
        if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
        if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
        return `₹${price.toLocaleString("en-IN")}`;
    };

    return (
        <div className="property-card">
            <div className="card-header">
                <span className={`card-badge ${isBuy ? "badge-buy" : "badge-rent"}`}>
                    {property.propertyType}
                </span>
                {onDelete && (
                    <button
                        className="card-delete"
                        onClick={() => onDelete(property._id)}
                        title="Delete property"
                    >
                        ✕
                    </button>
                )}
            </div>

            <div className="card-body">
                <h3 className="card-area">{property.area}</h3>
                <p className="card-city">{property.city}</p>

                <div className="card-details">
                    <div className="detail-item">
                        <span className="detail-label">Bedrooms</span>
                        <span className="detail-value">{property.bedrooms} BHK</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">{isBuy ? "Price" : "Rent/mo"}</span>
                        <span className="detail-value price-value">
                            {formatPrice(property.price)}
                        </span>
                    </div>
                </div>

                {property.amenities?.length > 0 && (
                    <div className="card-amenities">
                        {property.amenities.map((a, i) => (
                            <span key={i} className="amenity-tag">{a}</span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default PropertyCard;
