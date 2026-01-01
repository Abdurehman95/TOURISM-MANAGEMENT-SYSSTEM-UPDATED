# Tourism Management System - Quick Reference

## 🚀 Quick Start

### Start Backend
```bash
cd backend/public
php -S localhost:8000
```

### Start Frontend
```bash
cd frontend
npm start
```

Access: **http://localhost:3000**

---

## 👥 Default Users

| Role | Email | Password | Dashboard |
|------|-------|----------|-----------|
| Admin | admin@tourism.com | password123 | Full system control |
| Visitor | visitor@tourism.com | password123 | Browse & book tours |
| Researcher | researcher@tourism.com | password123 | Submit sites |
| Site Agent | guide@tourism.com | password123 | Manage tours |

---

## 📊 Key Features at a Glance

### For Visitors
✅ Browse historical sites (List/Map view)  
✅ Request site agents  
✅ Make payments via Chapa  
✅ View booking history  
✅ Submit reviews  

### For Researchers
✅ Submit new sites  
✅ Add images & map locations  
✅ Update existing sites  
✅ Track submission status  

### For Site Agents (Guides)
✅ Accept/reject tour requests  
✅ View schedule  
✅ Submit tour reports  
✅ Track earnings  

### For Admins
✅ Approve sites & requests  
✅ Verify payments  
✅ Manage users  
✅ View analytics  
✅ Export reports (PDF/CSV)  

---

## 🗺️ Project Structure

```
tourism-management/
├── frontend/           # React SPA
│   ├── src/
│   │   ├── components/ # All UI components
│   │   ├── services/   # API calls
│   │   └── context/    # Global state
│   └── package.json
├── backend/            # PHP API
│   ├── src/
│   │   ├── Controllers/
│   │   ├── Services/
│   │   └── Middleware/
│   ├── routes.php
│   └── schema.sql      # Database schema
└── PROJECT_DOCUMENTATION.md  # Full documentation
```

---

## 🔌 API Endpoints Quick Reference

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Sites
- `GET /api/sites` - List all sites
- `POST /api/sites` - Create site (Researcher)
- `PATCH /api/sites/{id}/approve` - Approve site (Admin)

### Requests (Bookings)
- `GET /api/requests` - List requests
- `POST /api/requests` - Create booking
- `PATCH /api/requests/{id}/approve` - Approve (Admin)
- `PATCH /api/requests/{id}/status` - Update status

### Payments
- `POST /api/payments/chapa/create` - Initiate payment
- `PATCH /api/payments/{id}/verify` - Verify payment

### Reports
- `POST /api/reports` - Submit report (Guide)
- `GET /api/admin/reports` - View all reports (Admin)

---

## 🎨 Dashboard Stats Explained

### Admin Dashboard
- **Total Users**: All registered users
- **Total Sites**: Approved historical sites
- **Active Visits**: Requests excluding rejected/cancelled
- **Total Revenue**: Sum of confirmed payment amounts (ETB)

### Site Agent Dashboard
- **Pending Requests**: Waiting for guide acceptance
- **Scheduled Tours**: All upcoming accepted tours
- **Completed Tours**: Finished tours

### Visitor Dashboard
- **Pending Requests**: Awaiting approval
- **Completed Visits**: Finished tours
- **Upcoming Tours**: Approved future tours

---

## 🔄 Request Status Flow

```
1. pending → Initial submission by visitor
2. approved → Admin approved (payment required)
3. accepted_by_guide → Guide accepted the tour
4. completed → Tour finished
5. rejected/cancelled → Declined
```

---

## 💳 Payment Flow

```
1. waiting → Payment initiated
2. paid → User completed Chapa payment
3. confirmed → Admin verified payment
4. failed/cancelled → Unsuccessful transaction
```

---

## 🛠️ Common Tasks

### Create New Admin User (SQL)
```sql
INSERT INTO Users (first_name, last_name, email, password_hash, user_type, password_changed)
VALUES ('Admin', 'Name', 'admin@example.com', 
        '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
        'admin', 1);
```

### Reset User Password
```sql
UPDATE Users 
SET password_hash = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    password_changed = 0
WHERE email = 'user@example.com';
```

### Check System Health
```bash
GET http://localhost:8000/api/health
```

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| CORS errors | Check `Access-Control-Allow-Origin` headers |
| 404 on /api/* | Verify Apache mod_rewrite, check .htaccess |
| Login fails | Check database connection, verify credentials |
| Maps not showing | Verify Google Maps API key in .env |
| Payment fails | Check Chapa API keys, verify callback URL |

---

## 📱 Key Technologies

- **Frontend**: React 19, React Router, Chart.js, Google Maps
- **Backend**: PHP 8, MySQL, PDO, JWT
- **Payment**: Chapa (Ethiopian payment gateway)
- **Maps**: Google Maps JavaScript API

---

## 🔐 Environment Variables

### Backend (.env)
```env
DB_HOST=127.0.0.1
DB_NAME=tourism
DB_USER=root
DB_PASS=
JWT_SECRET=your-secret-key
CHAPA_SECRET_KEY=your-chapa-key
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_GOOGLE_MAPS_API_KEY=your-maps-key
```

---

## 📞 Support

For detailed information, refer to **PROJECT_DOCUMENTATION.md**

**Version**: 1.0.0  
**Last Updated**: January 2026
