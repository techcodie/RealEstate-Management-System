from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.prediction import router as prediction_router

app = FastAPI(title="Real Estate Valuation API")

# CORS Middleware - Allow all origins during development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(prediction_router)


@app.get("/")
def root():
    return {"message": "Real Estate API is running"}
