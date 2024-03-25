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

import "primeicons/primeicons.css";
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
import OnlineIDE from "./components/OnlineIDE";
import Home from "./components/Home";
import CreateCourse from "./components/CreateCourse";
import CourseDashboard from "./components/CourseDashboard";
import CourseDetails from "./components/CourseDetails";
import Classes from "./components/Classes";
import Lesson from "./components/Lesson";

const App = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/posts")
      .then((response) => {
        const transformedData = response.data.map((course) => ({
          id: course.id,
          title: course.title,
          description: course.body,
          price: Math.floor(Math.random() * 100) + 50, // Generating random price
          image: `https://via.placeholder.com/150?text=${course.id}`,
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
        {/* <Route path="/dashboard" element={<Dashboard courses={courses} />} /> */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/courses" element={<CourseDashboard />} />
        <Route path="/create" element={<CreateCourse />} />
        <Route path="/test" element={<CreateCourse />} />
        <Route path="/courses/:courseId" element={<CourseDetails />} />
        {/* <Route path="/course/:courseId/lessons" element={<Classes />} /> */}
        <Route
          path="/course/:courseId/lessons/:lessonNumber"
          element={<Classes />}
        />
      </Routes>
    </Router>
  );
};

export default App;
