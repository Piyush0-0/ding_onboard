# Ding Partner Onboarding

A comprehensive onboarding application for restaurants to join the Ding platform. This application provides a streamlined registration process for restaurant partners to get started with online ordering.

## Features

### 🏪 Restaurant Onboarding
- **Multi-step Registration**: Guided onboarding flow with progress tracking
- **Personal Information**: Owner details and contact information
- **Restaurant Details**: Business information, cuisine type, and location
- **Menu Setup**: Initial menu configuration and bulk upload options
- **Document Upload**: Business license and verification documents

### 🔐 Authentication
- **Secure Registration**: Password hashing with bcrypt
- **JWT Authentication**: Token-based authentication system
- **Role-based Access**: Restaurant owner specific access controls

### 📊 Dashboard
- **Business Overview**: Key metrics and statistics
- **Quick Actions**: Easy access to common tasks
- **Onboarding Progress**: Track completion status
- **Order Management**: View and manage incoming orders

### 🎨 Modern UI/UX
- **Responsive Design**: Works on all devices
- **Ant Design Components**: Professional UI components
- **Tailwind CSS**: Modern styling and layouts
- **Progressive Flow**: Step-by-step guided experience

## Tech Stack

### Frontend
- **React 18**: Modern React with hooks
- **React Router**: Client-side routing
- **Ant Design**: UI component library
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API calls
- **React Toastify**: Toast notifications

### Backend Integration
- **RESTful APIs**: Integration with ding-mvp backend
- **JWT Authentication**: Secure token-based auth
- **File Upload**: Document and image upload support
- **MySQL Database**: Persistent data storage

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Running ding-mvp backend server

### Installation

1. **Clone and install dependencies**
   ```bash
   cd ding-partner-onboarding
   npm install
   ```

2. **Configure environment variables**
   ```bash
   # Create .env file
   REACT_APP_API_URL=http://localhost:3001
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Access the application**
   - Open http://localhost:3000 in your browser
   - The application will connect to the ding-mvp backend

### Backend Setup

Ensure the ding-mvp backend is running with the new endpoints:

1. **Install backend dependencies**
   ```bash
   cd ../ding-mvp
   npm install bcrypt jsonwebtoken
   ```

2. **Start the backend server**
   ```bash
   node index.js
   ```

## Application Flow

### 1. Landing Page
- Marketing page to attract restaurant partners
- Features and benefits of joining Ding
- Call-to-action buttons for registration

### 2. Registration Flow
- **Step 1**: Personal details (name, email, phone, password)
- **Step 2**: Restaurant information (name, address, cuisine type)
- **Step 3**: Menu setup (optional upload, default categories)
- **Step 4**: Final verification and account creation

### 3. Dashboard
- Welcome message and onboarding status
- Key metrics (orders, revenue, etc.)
- Quick action buttons
- Getting started checklist

### 4. Authentication
- Login page for existing partners
- Password reset functionality
- Token-based session management

## API Endpoints

### Authentication
- `POST /auth/restaurant-register` - Register new restaurant owner
- `POST /auth/restaurant-login` - Login restaurant owner
- `GET /auth/verify-token` - Verify JWT token

### Restaurant Management
- `POST /restaurants/onboard` - Create new restaurant
- `GET /restaurants/:id` - Get restaurant details
- `PUT /restaurants/:id` - Update restaurant information

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Main application pages
│   ├── LandingPage.js  # Marketing landing page
│   ├── OnboardingFlow.js # Multi-step registration
│   ├── LoginPage.js    # Authentication page
│   └── DashboardPage.js # Partner dashboard
├── contexts/           # React context providers
│   └── AuthContext.js  # Authentication state management
├── services/           # API service layer
│   └── api.js         # HTTP client and API calls
└── utils/             # Utility functions
```

## Key Features Implementation

### Multi-step Form
- Progress tracking with visual indicators
- Form validation at each step
- Data persistence across steps
- Conditional rendering based on current step

### Authentication Flow
- Registration with email/phone verification
- JWT token storage in localStorage
- Automatic token refresh
- Protected routes and components

### Responsive Design
- Mobile-first approach
- Flexible grid system
- Adaptive components
- Touch-friendly interactions

## Integration with Ding MVP

This partner onboarding app integrates seamlessly with the existing ding-mvp backend:

- **Shared Database**: Uses the same MySQL database schema
- **User Management**: Leverages existing Users table with RESTAURANT_OWNER role
- **Restaurant Data**: Creates entries in the Restaurants table
- **Menu Setup**: Integrates with Categories and Items tables

## Development Notes

### Environment Variables
- `REACT_APP_API_URL`: Backend API base URL
- Development: `http://localhost:3001`
- Production: Your production API URL

### Build and Deployment
```bash
# Build for production
npm run build

# The build folder contains the production-ready files
```

### Testing
```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## Next Steps

1. **Enhanced Menu Management**: Advanced menu builder with drag-and-drop
2. **Document Verification**: Automated document processing
3. **Payment Integration**: Stripe/Razorpay onboarding
4. **Analytics Dashboard**: Advanced reporting and insights
5. **Mobile App**: React Native version for mobile partners

## Support

For support and questions:
- Check the existing ding-mvp documentation
- Review the API endpoints in the backend
- Test the integration with the customer-facing app

## Contributing

1. Follow the existing code structure
2. Use TypeScript for new components (migration in progress)
3. Maintain responsive design principles
4. Add proper error handling and loading states
5. Include proper documentation for new features

---

**Built with ❤️ for Ding Restaurant Partners**
