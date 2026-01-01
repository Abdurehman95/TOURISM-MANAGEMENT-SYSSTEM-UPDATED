# Tourism Management System - Complete Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Technology Stack](#technology-stack)
4. [Database Schema](#database-schema)
5. [User Roles & Permissions](#user-roles--permissions)
6. [API Documentation](#api-documentation)
7. [Frontend Components](#frontend-components)
8. [Backend Structure](#backend-structure)
9. [Setup Instructions](#setup-instructions)
10. [User Workflows](#user-workflows)
11. [Code Structure](#code-structure)

---

## Project Overview

### Purpose
A comprehensive tourism management system for managing historical sites, visitor requests, site agents (guides), payments, and administrative operations in Ethiopia.

### Key Features
- **Multi-role User Management**: Admin, Visitor, Researcher, Site Agent
- **Site Management**: Create, approve, and manage historical sites
- **Booking System**: Request site agents for guided tours
- **Payment Integration**: Chapa payment gateway integration
- **Reporting System**: Site agents submit tour reports
- **Notification System**: Real-time notifications for all users
- **Map Integration**: Google Maps for site locations
- **Multi-language Support**: English and Amharic

---

## System Architecture

### High-Level Architecture
```
┌─────────────────┐
│   React SPA     │ (Frontend - Port 3000)
│   (Visitor UI)  │
└────────┬────────┘
         │
         │ HTTP/REST API
         │
┌────────▼────────┐
│  PHP Backend    │ (API Server - Port 8000)
│  (MVC Pattern)  │
└────────┬────────┘
         │
         │ PDO
         │
┌────────▼────────┐
│   MySQL DB      │ (Database - Port 3306)
│   (tourism)     │
└─────────────────┘

External Services:
- Chapa Payment Gateway (ETB payments)
- Google Maps API (Location services)
```

### Design Patterns
- **MVC (Model-View-Controller)**: Backend structure
- **Component-Based Architecture**: React frontend
- **RESTful API**: Communication protocol
- **Service Layer Pattern**: Business logic separation
- **Repository Pattern**: Data access abstraction

---

## Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.0 | UI Framework |
| React Router DOM | 7.9.6 | Client-side routing |
| Chart.js | 4.5.1 | Data visualization |
| React Chartjs 2 | 5.3.1 | React wrapper for Chart.js |
| Google Maps API | 2.20.8 | Map integration |
| Bootstrap | 5.3.8 | UI components |
| Chapa Inline JS | 1.0.1 | Payment integration |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| PHP | 8.x | Server-side language |
| MySQL | 8.x | Database |
| PDO | - | Database abstraction |
| JWT | - | Authentication |

### Development Tools
- XAMPP (Development environment)
- Node.js (Build tools)
- Git (Version control)

---

## Database Schema

### Core Tables

#### 1. Users
```sql
CREATE TABLE Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    profile_picture VARCHAR(255),
    user_type ENUM('visitor', 'researcher', 'admin', 'guide', 'site_agent') NOT NULL,
    password_changed TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
)
```

**Purpose**: Central user authentication and profile management

**User Types**:
- `visitor`: Regular tourists who book tours
- `researcher`: Submit and manage historical site information
- `admin`: System administrators with full access
- `guide`/`site_agent`: Tour guides (used interchangeably)

#### 2. Sites
```sql
CREATE TABLE Sites (
    site_id INT PRIMARY KEY AUTO_INCREMENT,
    site_name VARCHAR(200) NOT NULL,
    short_description TEXT,
    full_description LONGTEXT,
    location_address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    map_url TEXT,
    visit_price DECIMAL(10, 2),
    entrance_fee DECIMAL(10, 2),
    guide_fee DECIMAL(10, 2),
    estimated_duration VARCHAR(50),
    category_id INT,
    region_id INT,
    created_by INT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    is_approved BOOLEAN DEFAULT FALSE,
    approved_by INT,
    approved_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
```

**Purpose**: Historical sites repository

**Key Fields**:
- `map_url`: Google Maps link for the site
- `created_by`: Researcher who submitted the site
- `is_approved`: Admin approval status

#### 3. GuideRequests
```sql
CREATE TABLE GuideRequests (
    request_id INT PRIMARY KEY AUTO_INCREMENT,
    visitor_id INT,
    visitor_name VARCHAR(255),
    visitor_contact VARCHAR(255),
    site_id INT,
    guide_type_id INT,
    preferred_date DATE NOT NULL,
    preferred_time TIME NOT NULL,
    number_of_visitors INT NOT NULL,
    special_requirements TEXT,
    request_status ENUM('pending', 'approved', 'rejected', 'completed', 'cancelled') DEFAULT 'pending',
    assigned_guide_id INT,
    meeting_point TEXT,
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
```

**Purpose**: Tour booking requests

**Status Flow**:
1. `pending`: Initial submission
2. `approved`: Admin approved (awaiting payment)
3. `accepted_by_guide`: Site agent accepted
4. `completed`: Tour finished
5. `rejected`/`cancelled`: Declined

#### 4. Payments
```sql
CREATE TABLE Payments (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    request_id INT UNIQUE,
    payment_method_id INT,
    total_amount DECIMAL(10, 2) NOT NULL,
    reference_code VARCHAR(100) UNIQUE,
    payment_status ENUM('waiting', 'paid', 'confirmed', 'failed', 'cancelled', 'refunded') DEFAULT 'waiting',
    paid_at TIMESTAMP NULL,
    confirmed_by INT,
    confirmed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

**Purpose**: Payment tracking

**Status Flow**:
1. `waiting`: Payment initiated
2. `paid`: User completed payment
3. `confirmed`: Admin verified
4. `failed`/`cancelled`: Unsuccessful

#### 5. Reports
```sql
CREATE TABLE Reports (
    report_id INT PRIMARY KEY AUTO_INCREMENT,
    request_id INT,
    guide_id INT,
    report_text TEXT,
    report_date DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

**Purpose**: Site agent tour reports

#### 6. Notifications
```sql
CREATE TABLE Notifications (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    notification_type ENUM('guide_request', 'payment', 'reminder', 'system', 'account') NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    related_request_id INT NULL,
    related_payment_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

**Purpose**: User notifications

### Supporting Tables
- **Categories**: Site categories (historical, cultural, etc.)
- **Regions**: Geographic regions in Ethiopia
- **SiteImages**: Multiple images per site
- **GuideTypes**: Types of guides (standard, expert, etc.)
- **PaymentMethods**: Payment options
- **PaymentProofs**: Upload payment receipts
- **Visits**: Scheduled visit records
- **Reviews**: Visitor reviews
- **SiteSubmissions**: Researcher submissions queue
- **ResearcherActivities**: Activity logs

---

## User Roles & Permissions

### 1. Visitor
**Capabilities**:
- Browse and search historical sites
- Request site agents for tours
- Make payments via Chapa
- View booking history
- Submit reviews
- Manage profile

**Dashboard Stats**:
- Pending requests
- Completed visits
- Upcoming tours

### 2. Researcher
**Capabilities**:
- Submit new historical sites
- Update existing sites (pending re-approval)
- Upload site images and descriptions
- Add map locations
- View submission status

**Dashboard Stats**:
- Submitted sites
- Approved sites
- Pending sites

### 3. Site Agent (Guide)
**Capabilities**:
- View assigned tour requests
- Accept/reject tour requests
- View schedule
- Submit tour reports
- Manage availability

**Dashboard Stats**:
- Pending requests (waiting for acceptance)
- Scheduled tours (upcoming accepted tours)
- Completed tours

### 4. Admin
**Capabilities**:
- Full system control
- Approve/reject sites
- Approve/reject tour requests
- Verify payments
- Assign guides to requests
- Manage users (Create, activate, deactivate)
- View system analytics
- Export reports (CSV/PDF)

**Dashboard Stats**:
- Total users
- Total sites
- Active requests (excluding rejected/cancelled)
- Total revenue (sum of confirmed payments)

---

## API Documentation

### Base URL
```
http://localhost:8000/api
```

### Authentication
All protected endpoints require JWT token in header:
```
Authorization: Bearer <token>
```

### Core Endpoints

#### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | User login | No |
| GET | `/users/me` | Get current user profile | Yes |
| PATCH | `/users/me` | Update profile | Yes |

**Login Request**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Login Response**:
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "user_id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "user@example.com",
    "user_type": "visitor"
  }
}
```

#### Sites Management
| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/sites` | List all approved sites | No | All |
| GET | `/sites/{id}` | Get site details | No | All |
| POST | `/sites` | Create new site | Yes | Researcher/Admin |
| PATCH | `/sites/{id}` | Update site | Yes | Researcher/Admin |
| DELETE | `/sites/{id}` | Delete site | Yes | Researcher/Admin |
| PATCH | `/sites/{id}/approve` | Approve site | Yes | Admin |

**Create Site Request**:
```json
{
  "site_name": "Lalibela Rock Churches",
  "description": "Famous rock-hewn churches",
  "location": "Lalibela, Ethiopia",
  "latitude": 12.0317,
  "longitude": 39.0476,
  "map_url": "https://maps.google.com/...",
  "price": 500,
  "category": "Historical",
  "region": "Amhara"
}
```

#### Requests (Tour Bookings)
| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/requests` | List requests | Yes | All |
| POST | `/requests` | Create booking | Yes | Visitor |
| PATCH | `/requests/{id}/approve` | Approve request | Yes | Admin |
| PATCH | `/requests/{id}/reject` | Reject request | Yes | Admin |
| PATCH | `/requests/{id}/assign-guide` | Assign guide | Yes | Admin |
| PATCH | `/requests/{id}/status` | Update status | Yes | Guide/Admin |
| DELETE | `/requests/{id}` | Delete request | Yes | Admin/Guide |

**Create Request**:
```json
{
  "site_id": 1,
  "preferred_date": "2026-01-15",
  "preferred_time": "10:00:00",
  "number_of_visitors": 4,
  "special_requirements": "English speaking guide"
}
```

#### Payments
| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/payments/chapa/create` | Initiate payment | Yes | Visitor |
| GET | `/payments/chapa/verify/{ref}` | Verify payment | Yes | Visitor |
| GET | `/payments` | List payments | Yes | Admin/Visitor |
| PATCH | `/payments/{id}/verify` | Admin verify payment | Yes | Admin |
| POST | `/payments/proof` | Upload proof | Yes | Visitor |

**Payment Request**:
```json
{
  "request_id": 123,
  "amount": 1500,
  "email": "visitor@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "phone_number": "+251911234567"
}
```

#### Reports
| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/reports` | Submit tour report | Yes | Guide |
| GET | `/admin/reports` | List all reports | Yes | Admin |

**Submit Report**:
```json
{
  "request_id": 123,
  "report_text": "Tour completed successfully. Visitors enjoyed...",
  "date": "2026-01-15"
}
```

#### Admin
| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/admin/users` | List all users | Yes | Admin |
| POST | `/admin/users` | Create user | Yes | Admin |
| PUT | `/admin/users/{id}/status` | Toggle user status | Yes | Admin |
| DELETE | `/admin/users/{id}` | Delete user | Yes | Admin |

#### Notifications
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/notifications` | Get user notifications | Yes |
| PATCH | `/notifications/{id}/read` | Mark as read | Yes |
| DELETE | `/notifications/{id}` | Delete notification | Yes |

---

## Frontend Components

### Directory Structure
```
frontend/src/
├── components/
│   ├── admin/          # Admin panel components
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminSites.jsx
│   │   ├── AdminUsers.jsx
│   │   ├── AdminRequests.jsx
│   │   ├── AdminReports.jsx
│   │   ├── AdminPayments.jsx
│   │   └── adminApi.js
│   ├── visitor/        # Visitor components
│   │   ├── VisitorDashboard.jsx
│   │   ├── ExploreSites.jsx
│   │   ├── RequestGuide.jsx
│   │   ├── VisitorHistory.jsx
│   │   └── VisitorPayments.jsx
│   ├── researcher/     # Researcher components
│   │   ├── ResearcherDashboard.jsx
│   │   ├── ResearcherSites.jsx
│   │   └── ManageSiteModal.jsx
│   ├── guide/          # Site agent components
│   │   ├── GuideDashboard.jsx
│   │   ├── GuideRequests.jsx
│   │   ├── GuideSchedule.jsx
│   │   └── GuideReports.jsx
│   └── common/         # Shared components
│       ├── GoogleMapComponent.jsx
│       ├── NotificationDropdown.jsx
│       ├── UserProfileMenu.jsx
│       ├── ThemeToggle.jsx
│       └── LoadingSpinner.jsx
├── context/
│   ├── LanguageContext.js  # i18n context
│   └── ThemeContext.js     # Dark/light mode
├── services/
│   ├── api.js              # API client
│   ├── visitorService.js
│   └── guideService.js
└── App.js
```

### Key Components

#### 1. AdminDashboard.jsx
**Purpose**: Central admin control panel

**Features**:
- Real-time statistics charts (Bar & Doughnut charts)
- Quick actions (Add Site Agent, Add Researcher)
- System performance metrics

**Data Displayed**:
- Total Users
- Total Sites
- Active Visits (filtered)
- Total Revenue (sum of confirmed payments)

#### 2. ExploreSites.jsx
**Purpose**: Public site browsing for visitors

**Features**:
- List/Map view toggle
- Search functionality
- Site cards with images
- Hover overlay showing site info
- Click to view map location
- Navigate to booking page

**Map Integration**:
```jsx
<GoogleMapComponent sites={filteredSites} />
```

#### 3. GuideSchedule.jsx
**Purpose**: Site agent's tour calendar

**Features**:
- Calendar view of upcoming tours
- Filter by status
- Dynamic status badges
- Sorted by date

**Status Displayed**:
- `accepted_by_guide`: Confirmed tours
- `assigned`: Admin assigned
- `approved`: Awaiting acceptance
- `completed`: Finished tours

#### 4. ManageSiteModal.jsx
**Purpose**: Researcher site submission form

**Features**:
- Add/Edit site information
- Image URL upload
- Map URL integration
- Category and region selection
- Rich text description

**Fields**:
- Site name, description
- Location (address, lat/long, map URL)
- Pricing (entrance, guide fees)
- Duration estimate
- Category, Region

---

## Backend Structure

### Directory Structure
```
backend/
├── public/
│   └── index.php          # Entry point
├── src/
│   ├── Config/
│   │   ├── Database.php   # DB connection
│   │   └── Env.php        # Environment config
│   ├── Controllers/
│   │   ├── AuthController.php
│   │   ├── SitesController.php
│   │   ├── RequestsController.php
│   │   ├── PaymentsController.php
│   │   ├── AdminUsersController.php
│   │   ├── NotificationsController.php
│   │   ├── ReportsController.php
│   │   └── StatsController.php
│   ├── Services/
│   │   ├── AuthService.php
│   │   ├── PaymentService.php
│   │   ├── NotificationService.php
│   │   └── FileService.php
│   ├── Middleware/
│   │   └── AuthMiddleware.php
│   └── Utils/
│       └── Response.php
├── routes.php             # API routing
├── .env                   # Environment variables
└── schema.sql            # Database schema
```

### Key Chttps://maps.app.goo.gl/Rs6Ugd35n7RrMYbBAontrollers

#### 1. AuthController.php
**Methods**:
- `register($input)`: User registration
- `login($input)`: Authentication with JWT

**Flow**:
1. Validate credentials
2. Hash password (bcrypt)
3. Generate JWT token
4. Return user + token

#### 2. SitesController.php
**Methods**:
- `index()`: List all sites
- `show($id)`: Get site details
- `store($context, $input)`: Create site
- `update($context, $id, $input)`: Update site
- `approve($id, $context)`: Approve site
- `delete($id)`: Delete site

**Features**:
- Auto-approval for researchers
- Researcher name joining from Users table
- Category/Region auto-creation
- SiteImages table integration

#### 3. RequestsController.php
**Methods**:
- `create($context, $input)`: Create booking
- `listAll($context)`: Get filtered requests
- `listForVisitor($visitorId)`: Visitor's bookings
- `approve($requestId)`: Admin approval
- `reject($requestId)`: Rejection
- `assignGuide($requestId, $guideId)`: Assign guide
- `updateStatus($requestId, $status, $context)`: Status update
- `delete($requestId)`: Delete request

**Filtering Logic**:
- Visitors see their own requests
- Guides see assigned + available requests
- Admins see all requests

#### 4. PaymentsController.php
**Methods**:
- `createChapa($input)`: Initialize Chapa payment
- `verifyByTxRef($txRef)`: Verify transaction
- `uploadProof($files, $input)`: Handle proof upload
- `list($requestId, $visitorId)`: Get payments
- `verify($paymentId, $context)`: Admin verification

**Chapa Integration**:
```php
$chapa->initialize([
    'amount' => $amount,
    'currency' => 'ETB',
    'email' => $email,
    'first_name' => $firstName,
    'last_name' => $lastName,
    'callback_url' => $callbackUrl,
    'return_url' => $returnUrl,
    'tx_ref' => $txRef
]);
```

#### 5. NotificationService.php
**Methods**:
- `create($userId, $title, $message, $type, $relatedId)`: Create notification
- `notifyAdmins($title, $message, $type, $relatedId)`: Broadcast to admins

**Notification Triggers**:
- New site submission → Admins
- New tour request → Admins
- Payment confirmation → Visitor
- Request approval → Visitor
- Guide assignment → Guide
- Site approval → Researcher

---

## Setup Instructions

### Prerequisites
- XAMPP (Apache + MySQL + PHP 8.x)
- Node.js (v14+)
- Composer (optional)
- Git

### Backend Setup

1. **Database Configuration**
```bash
cd c:\xampp\htdocs\tourism-management-updated-system-main\tourism-management-updated-system-main\backend
```

2. **Create Database**
```sql
mysql -u root -p
CREATE DATABASE tourism;
USE tourism;
SOURCE schema.sql;
```

3. **Configure Environment**
Create `.env` file:
```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=tourism
DB_USER=root
DB_PASS=

JWT_SECRET=your-secret-key-here
JWT_EXPIRY=86400

CHAPA_SECRET_KEY=your-chapa-secret-key
UPLOAD_DIR=public/uploads
MAX_UPLOAD_SIZE=5000000
```

4. **Create Admin User**
```sql
INSERT INTO Users (first_name, last_name, email, password_hash, user_type, password_changed)
VALUES ('Admin', 'User', 'admin@tourism.com', '$2y$10$...', 'admin', 1);
```

5. **Start Backend Server**
```bash
cd public
php -S localhost:8000
```

### Frontend Setup

1. **Install Dependencies**
```bash
cd frontend
npm install
```

2. **Configure Environment**
Create `.env` file:
```env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-key
```

3. **Start Development Server**
```bash
npm start
```

Application runs on: `http://localhost:3000`

### Google Maps Setup
1. Get API key from Google Cloud Console
2. Enable Maps JavaScript API
3. Add to frontend `.env`

### Chapa Payment Setup
1. Register at chapa.co
2. Get API keys (Test/Production)
3. Add to backend `.env`

---

## User Workflows

### 1. Visitor Journey

**Step 1: Browse Sites**
- Visit homepage
- View site list/map
- Search by name/location
- Click site for details

**Step 2: Request Tour**
- Select "Request Site Agent"
- Fill booking form:
  - Preferred date/time
  - Number of visitors
  - Special requirements
- Submit request

**Step 3: Make Payment**
- Receive payment notification
- Click "Pay Now"
- Redirected to Chapa
- Complete payment
- Return to system

**Step 4: Admin Approval**
- Wait for admin verification
- Receive approval notification

**Step 5: Tour Day**
- Meet assigned guide
- Complete tour
- Submit review (optional)

### 2. Researcher Workflow

**Step 1: Submit Site**
- Login as researcher
- Navigate to "My Sites"
- Click "Add New Site"
- Fill comprehensive form:
  - Site details
  - Images
  - Map location
  - Pricing
  - Description
- Submit

**Step 2: Wait for Approval**
- Site marked "Pending"
- Admin reviews submission
- Receive approval/rejection notification

**Step 3: Update Sites**
- Edit approved sites
- Requires re-approval

### 3. Site Agent (Guide) Workflow

**Step 1: View Requests**
- Login to dashboard
- See available tour requests
- Review details

**Step 2: Accept Request**
- Click "Accept"
- System assigns guide
- Visitor notified

**Step 3: Tour Day**
- Meet visitor at site
- Complete tour

**Step 4: Submit Report**
- Navigate to "Reports"
- Select completed tour
- Write report
- Submit

### 4. Admin Operations

**Approve Sites**
- Navigate to "Sites"
- Review pending submissions
- Approve/Reject

**Manage Tour Requests**
- View all bookings
- Approve/Reject
- Assign guides manually

**Verify Payments**
- Check payment proofs
- Verify transactions
- Update status

**User Management**
- Create site agents/researchers
- Activate/Deactivate users
- Reset passwords

**System Analytics**
- View dashboard charts
- Export reports (CSV/PDF)
- Monitor system health

---

## Code Structure

### Frontend Code Organization

#### Component Pattern
```jsx
export default function ComponentName() {
  const [state, setState] = useState(initialValue);
  
  useEffect(() => {
  }, [dependencies]);
  
  const handleAction = () => {
  };
  
  return (
    <div className="layout">
      <Sidebar />
      <main className="main">
        <header className="header">
          <h1>Title</h1>
          <ThemeToggle />
        </header>
        <section className="panel">
        </section>
      </main>
    </div>
  );
}
```

#### API Service Pattern
```javascript
export const serviceName = {
  getItems: async () => {
    const response = await api.get('/endpoint');
    return response.data || response;
  },
  
  createItem: async (data) => {
    return await api.post('/endpoint', data);
  },
  
  updateItem: async (id, data) => {
    return await api.patch(`/endpoint/${id}`, data);
  }
};
```

### Backend Code Organization

#### Controller Pattern
```php
class ExampleController {
    private PDO $db;
    private Service $service;
    
    public function __construct(PDO $db, Service $service) {
        $this->db = $db;
        $this->service = $service;
    }
    
    public function index(): array {
        try {
            $stmt = $this->db->query("SELECT * FROM table");
            return $stmt->fetchAll();
        } catch (Throwable $e) {
            return ['_status' => 500, 'error' => $e->getMessage()];
        }
    }
}
```

#### Route Pattern
```php
case $method === 'GET' && $path === '/api/endpoint':
    $context = AuthMiddleware::requireToken();
    $respond($controller->method($context));
    break;
```

#### Service Pattern
```php
class ExampleService {
    private PDO $db;
    
    public function processLogic($data): array {
        return ['success' => true, 'data' => $result];
    }
}
```

### State Management

#### Frontend State
- **Local State**: `useState` for component-specific data
- **Context**: `LanguageContext`, `ThemeContext` for global state
- **localStorage**: User session, preferences

#### Backend State
- **Session**: JWT tokens
- **Database**: Persistent application state

### Error Handling

#### Frontend
```javascript
try {
  const data = await api.get('/endpoint');
  setData(data);
} catch (error) {
  setError(error.message);
  alert('Operation failed: ' + error.message);
}
```

#### Backend
```php
try {
    $stmt = $this->db->prepare($sql);
    $stmt->execute($params);
    return ['success' => true];
} catch (Throwable $e) {
    error_log($e->getMessage());
    return ['_status' => 500, 'error' => 'Operation failed'];
}
```

---

## Security Features

### Authentication
- JWT-based authentication
- Password hashing with bcrypt
- Token expiry (24 hours default)

### Authorization
- Role-based access control (RBAC)
- Endpoint-level permission checks
- Context-aware filtering

### Data Protection
- Prepared statements (SQL injection prevention)
- Input validation
- XSS protection
- CORS configuration

### Password Policy
- Minimum length enforcement
- Hash storage only
- Password change tracking

---

## Performance Optimizations

### Frontend
- Code splitting by route
- Lazy loading components
- Memoization for expensive calculations
- Debounced search inputs

### Backend
- Database indexing on foreign keys
- Query optimization (JOINs)
- Connection pooling (PDO persistent)

### Caching Strategy
- Browser cache for static assets
- API response caching (future enhancement)

---

## Deployment Checklist

### Production Preparation
- [ ] Update JWT secret key
- [ ] Configure production database
- [ ] Set Chapa production keys
- [ ] Build frontend (`npm run build`)
- [ ] Configure Apache virtual host
- [ ] Enable HTTPS
- [ ] Set file upload limits
- [ ] Configure error logging
- [ ] Database backup strategy
- [ ] Monitor server resources

### Environment Variables
**Backend** (`.env`):
- Database credentials
- JWT secret
- Chapa API keys
- Upload directory

**Frontend** (`.env`):
- API URL
- Google Maps API key

---

## Troubleshooting

### Common Issues

**Issue**: CORS errors
**Solution**: Configure `header()` in `public/index.php`

**Issue**: Database connection failed
**Solution**: Check `.env` credentials, verify MySQL running

**Issue**: 404 on API routes
**Solution**: Ensure Apache mod_rewrite enabled, check `.htaccess`

**Issue**: Payment verification fails
**Solution**: Verify Chapa API keys, check callback URL

**Issue**: Maps not displaying
**Solution**: Verify Google Maps API key, check browser console

---

## Future Enhancements

### Planned Features
1. **Mobile App**: React Native version
2. **Real-time Chat**: Guide-Visitor messaging
3. **Advanced Analytics**: Business intelligence dashboard
4. **Email Notifications**: Automated email system
5. **Review System**: Enhanced rating/review features
6. **Multi-currency**: Support for USD, EUR
7. **Booking Calendar**: Availability management
8. **API Documentation**: Swagger/OpenAPI integration

### Technical Debt
- Add comprehensive unit tests
- Implement API rate limiting
- Add request logging middleware
- Optimize database queries
- Add frontend error boundary
- Implement service workers (PWA)

---

## Support & Maintenance

### Contact
- **Technical Support**: dev@tourism.et
- **Admin Support**: admin@tourism.et

### Version
- **Current Version**: 1.0.0
- **Last Updated**: January 2026

### License
Proprietary - All Rights Reserved

---

## Appendix

### Database Relationships Diagram
```
Users (1) ─────► (N) Sites [created_by]
Users (1) ─────► (N) GuideRequests [visitor_id, assigned_guide_id]
Users (1) ─────► (N) Reports [guide_id]
Sites (1) ─────► (N) GuideRequests [site_id]
Sites (1) ─────► (N) SiteImages [site_id]
GuideRequests (1) ─────► (1) Payments [request_id]
GuideRequests (1) ─────► (1) Reports [request_id]
Categories (1) ─────► (N) Sites [category_id]
Regions (1) ─────► (N) Sites [region_id]
```

### API Response Format
**Success**:
```json
{
  "data": [...],
  "message": "Operation successful"
}
```

**Error**:
```json
{
  "_status": 400,
  "error": "Error message",
  "detail": "Detailed info"
}
```

### HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Server Error

---

**END OF DOCUMENTATION**
