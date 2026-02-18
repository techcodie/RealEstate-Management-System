# EstateEase - Real Estate Listing & Property Management System

EstateEase is a professional MERN stack application designed for managing real estate listings, property inquiries, and user management.

## Project Structure

### Backend (server/)
- **Models**: Mongoose schemas for Users, Properties, and Inquiries.
- **Controllers**: Express controllers for handling business logic.
- **Routes**: API route definitions.
- **Middleware**: Authentication and error handling.
- **Config**: Database and third-party service configurations.

### Frontend (client/)
- **Pages**: Main application views (Home, Listings, etc.).
- **Components**: Reusable UI components styled with Tailwind CSS.
- **Context**: State management for Authentication.
- **Services**: API interaction layer.

## Getting Started

### Prerequisites
- Node.js
- MongoDB
- Cloudinary Account (for image uploads)

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   # Root
   npm install
   # Backend
   cd server && npm install
   # Frontend
   cd ../client && npm install
   ```
3. Set up environment variables (see `.env.example` in both folders).
4. Start the development servers.
