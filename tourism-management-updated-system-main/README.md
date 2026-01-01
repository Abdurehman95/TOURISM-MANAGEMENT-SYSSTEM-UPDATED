# Tourism Management System

A comprehensive web-based platform designed to modernize tourism interactions in Ethiopia. This system connects visitors with historical sites, professional guides, and researchers, facilitating seamless booking, payments, and site management.

## 🚀 Key Features

### 👥 User Roles & Capabilities
*   **Visitor**: Explore sites, book guides, make payments (Chapa/Bank), leave reviews, and manage visit history.
*   **Tour Guide / Site Agent**: Manage schedules, view assigned requests, and track visit completions.
*   **Researcher**: Submit new heritage sites and update existing site information.
*   **Administrator**: Full system control—approve sites/researchers, manage users, view financial reports, and oversee system health.

### 🌟 Core Functionality
*   **Site Management**: Detailed site listings with descriptions, images, location data, and pricing.
*   **Booking System**: Streamlined process for visitors to request guides and schedule visits.
*   **Payment Integration**: Secure online payments via **Chapa** and manual bank transfer verification.
*   **Interactive Dashboard**: Analytics and charts for admins to track revenue and user growth.
*   **Multi-Language Support**: Built-in support for **English** and **Amharic**.
*   **Themes**: Toggle between **Light** and **Dark** modes for better user experience.
*   **Responsive Design**: Optimized for desktop and mobile devices.

---

## 🛠️ Technology Stack

### Frontend
*   **React** (v19) - Component-based UI library.
*   **Bootstrap 5** - Responsive styling framework.
*   **React Router** - Navigation and routing.
*   **Chart.js** - Data visualization for admin dashboards.
*   **Context API** - State management (Auth, Language, Theme).

### Backend
*   **PHP** (8.0+) - Server-side logic.
*   **MySQL** - Relational database management.
*   **PDO** - Secure database interactions.
*   **JWT** (JSON Web Tokens) - Secure authentication.
*   **Composer** - Dependency management.

---

## ⚙️ Installation & Setup

### Prerequisites
*   **Node.js** & **npm** (for Frontend)
*   **PHP** & **Composer** (for Backend)
*   **MySQL Server** (e.g., XAMPP, WAMP, or standalone)

### 1. Database Setup
1.  Open your MySQL tool (e.g., phpMyAdmin).
2.  Create a new database named **`tourism`**.
3.  Import the schema and seed files located in the `backend` folder:
    *   First, import `backend/schema.sql` (Creates tables).
    *   (Optional) Import `backend/seeds.sql` (Inserts initial testing data).

### 2. Backend Configuration
1.  Navigate to the `backend` directory.
    ```bash
    cd backend
    ```
2.  Install PHP dependencies.
    ```bash
    composer install
    ```
3.  Configure Environment Variables:
    *   Copy `.env.example` to a new file named `.env`.
    *   Update database credentials (`DB_NAME`, `DB_USER`, `DB_PASS`) inside `.env` to match your local setup.
4.  Start the Backend Server:
    *   **Windows (PowerShell)**:
        ```powershell
        .\start_server.ps1
        ```
    *   **Manual**:
        ```bash
        php -S localhost:8000 -t public
        ```

### 3. Frontend Configuration
1.  Open a new terminal and navigate to the `frontend` directory.
    ```bash
    cd frontend
    ```
2.  Install JavaScript dependencies.
    ```bash
    npm install
    ```
3.  Start the React Application.
    ```bash
    npm start
    ```
4.  The application should now be running at `http://localhost:3000`.

---

## 🔐 Default Credentials

To access the admin panel immediately:

*   **Email**: `admin@example.com`
*   **Password**: `password123`

---

## 📂 Project Structure

```
tourism-management-system/
├── backend/                # PHP API
│   ├── public/             # Entry point (index.php) & Uploads
│   ├── src/                # Controllers, Models, Services
│   ├── schema.sql          # Database structure
│   ├── seeds.sql           # Mock data
│   └── .env                # Configuration
│
├── frontend/               # React Client
│   ├── src/
│   │   ├── components/     # UI Components (Admin, Visitor, etc.)
│   │   ├── services/       # API integration files
│   │   ├── context/        # Global Providers
│   │   └── App.jsx         # Main Component
│   └── package.json        # Dependencies
│
└── README.md               # Project Documentation
```

## 🤝 Contributing
1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/NewFeature`).
3.  Commit your changes (`git commit -m 'Add some NewFeature'`).
4.  Push to the branch (`git push origin feature/NewFeature`).
5.  Open a Pull Request.

## 📝 License
This project is open-source and available for educational and commercial use.
