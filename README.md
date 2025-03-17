# Welcome to Viona's Todo App

A simple **to-do application** built with **React and Firebase**, featuring authentication and Firestore integration. You can manage your tasks effortlessly, update your profile, and store data securely.  

---

## 💡Features
- User authentication via email and password, as well as Google Sign In
- Create, View, Update, and Delete (CRUD) tasks
- Profile management with the ability to update profile details, such as profile picture and name
- Responsive and interactive UI with React
- Firestore as a real-time database

## 🔧 Setup with Git Clone
❶ Clone the GitHub Repository
```
git clone https://github.com/<your-username>/todo-app.git
cd todo-app
```
❷ Install Dependencies
```
npm install
```
❸ Run the App
```
npm run dev
```
The app will be running on http://localhost:5173/

## 🔧 Setup with Docker
❶ Pull the Docker image
```
docker pull viondjunaidy/to-do-list
```
❷ Run the Docker container
```
docker run -p 5173:5173 -e HOST=0.0.0.0 viondjunaidy/to-do-list
```
The app can be accessed at http://localhost:5173
