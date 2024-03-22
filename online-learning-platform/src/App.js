import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import ReactDOM from "react-dom/client";
import "primeicons/primeicons.css";
import { PrimeReactProvider } from "primereact/api";
import "primeflex/primeflex.css";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";

import "./index.css";
import "./flag.css";

import axios from "axios";
import Auth from "./components/auth";
import LogIn from "./components/LogIn";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import CourseDetails from "./components/CourseDetails";
import OnlineIDE from "./components/OnlineIDE";
import Home from "./components/Home";
import CreateCourse from "./components/CreateCourse";
import AllCourses from "./components/AllCourses";
import CreateLesson from "./components/CreateLessons";

const App = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    // Fetch course data from JSONPlaceholder API
    axios
      .get("https://jsonplaceholder.typicode.com/posts")
      .then((response) => {
        // Transforming fetched data to match our course structure
        const transformedData = response.data.map((course) => ({
          id: course.id,
          title: course.title,
          description: course.body,
          price: Math.floor(Math.random() * 100) + 50, // Generating random price
          image: `https://via.placeholder.com/150?text=${course.id}`, // Placeholder image
          author: "Anonymous Author", // Dummy author name
        }));
        setCourses(transformedData);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
      });
  }, []);

  return (
    <Router>
      <Routes>
        <Route exact path="/register" element={<Auth />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/" element={<Home />} />
        <Route path="/ide" element={<OnlineIDE />} />
        <Route path="/dashboard" element={<Dashboard courses={courses} />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/courses" element={<AllCourses />} />
        <Route path="/create" element={<CreateCourse />} />
        <Route path="/test" element={<CreateCourse />} />
        <Route
          path="/create-course/:courseId/:numberOfClasses"
          element={<CreateLesson />}
        />
        <Route
          path="/course/:id"
          element={<CourseDetails courses={courses} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
