
#  Welcome to the Event Budget Planner!

Planning an event can be stressful, especially when it comes to managing the budget. This application helps you stay on top of your expenses so you can focus on making your event amazing.

---

## What is this project about?

The Event Budget Planner is a full-stack web application designed to make budgeting for events easy and organized. Whether you're planning a wedding, a corporate meetup, or a birthday bash, this tool has got your back.

You can create events, assign budgets to different categories, and keep track of your actual spending. Plus, the app includes a clean interface and a powerful backend to support user management, media uploads, and more.

---

##  What can you do with it?

Here’s a quick look at the features:

-  Create and manage event budgets with ease
-  Compare your planned vs actual expenses
-  Sign up and log in securely
-  Send messages to the admin and get assistance
-  Use a REST API to connect with other services or a frontend
-  Upload and manage media files like package brochures or invoices

---

##  Tech Stack Breakdown

### Backend
- **Django**: The core framework powering the backend
- **Django REST Framework**: For building robust APIs
- **SQLite / PostgreSQL**: Handles your data smoothly

### Frontend
- **React (assumed)**: Interactive and dynamic user experience
- **Node.js & npm**: Dependency management and build tools

### Others
- Python 3.x
- HTML, CSS, JavaScript
- Virtual environment for Python dependencies

---

##  How to run the project

Let’s get you started quickly!

###  Backend Setup

1. Create a virtual environment:
   ```bash
   python -m venv env
   source env/Scripts/activate  # or `source env/bin/activate` on Mac/Linux
   ```

2. Install the required packages:
   ```bash
   pip install -r requirements.txt
   ```

3. Apply the database migrations:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

4. Run the development server:
   ```bash
   python manage.py runserver
   ```

###  Frontend Setup

1. Open the frontend directory:
   ```bash
   cd frontend
   ```

2. Install all dependencies:
   ```bash
   npm install
   ```

3. Fire up the frontend:
   ```bash
   npm start
   ```

Now you should have both frontend and backend up and running! 🚀

---

##  What’s next?

We’re constantly thinking about how to make this app better. Here are a few ideas we might add in the future:

- Export budgets as PDF reports
- Get reminders or alerts for deadlines
- Add payment gateway integration
- Role-based access control

---

##  Who made this?

This project was built with care of web developer,Naveenraj J. Feel free to connect or suggest improvements!



