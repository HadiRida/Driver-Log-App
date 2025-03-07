#### Driver Logs - Full-Stack Application

### Key Features:
- **Trip Logs**: Users can add and view logs for each trip, including stop location, driving hours, and rest hours.
- **Route Visualization**: A map is integrated to display the pickup and drop-off locations, along with the trip details.
- **RESTful API**: The backend is built using Django REST Framework, exposing an API to manage trips and logs.
- **Responsive UI**: The frontend is built with React and styled using Material-UI for a modern, clean, and responsive interface.
- **Full-Stack Integration**: The app combines Django for the backend and React for the frontend, allowing seamless interaction between the two.
- **Hosted on Vercel and Heroku**: The app is deployed live, with the backend hosted on **Heroku** and the frontend on **Vercel**.

### Technologies Used:
- **Backend**: Django, Django REST Framework, Gunicorn
- **Frontend**: React, Axios, Material-UI
- **Database**: SQLite (for local development), PostgreSQL (for production)
- **Hosting**: Vercel (Frontend), Heroku (Backend)

### How to Run Locally:
1. Clone the repository.
2. Set up the backend:
   - Navigate to `driver_logs_backend/`.
   - Create a virtual environment: `python -m venv venv`.
   - Install dependencies: `pip install -r requirements.txt`.
   - Run the development server: `python manage.py runserver`.
3. Set up the frontend:
   - Navigate to `driver_logs_frontend/`.
   - Install dependencies: `npm install`.
   - Start the React development server: `npm start`.
4. Open `http://localhost:3000` in your browser to view the app.
