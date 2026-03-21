# 🏙️ Residential Management System (RMS)

**ER-Diagram:** https://supabase.com/dashboard/project/fyuoewrpkebvtvkdmxsw/database/schemas

### 📝 Project Overview
The Residential Management System (RMS) is a full-stack web application developed to simplify apartment administration and improve communication between the building manager and residents.

### 🛠️ Technology Stack
- **Frontend**: React.js
- **Backend**: Spring Boot (REST APIs)
- **Database**: PostgreSQL (Supabase)
- **Security**: Environment Variables (`.env`) & Role-Based Access Control (RBAC)

### 🔑 User Roles
The application follow role-based access control with two main users:
*   **Manager**: Manages resident details, creates and updates notices, views complaints raised by residents, and updates the complaint resolution status.
*   **Resident**: Logs in, views notices, raises complaints related to maintenance or service issues, tracks complaint status, and submits vacation intimations.

### 🏗️ Architecture
The system follows a REST architecture where the React frontend communicates with the Spring Boot backend through defined API endpoints such as authentication, resident management, notice management, and complaint management.

### 🏁 Final Outcome
A deployable web application that provides separate dashboards for the Manager and Residents, enabling structured communication through notices and complaint tracking within a residential community.
