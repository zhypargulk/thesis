// App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import Auth from "./components/auth";
import LogIn from "./components/LogIn";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import CourseDetails from "./components/CourseDetails";
import OnlineIDE from "./components/OnlineIDE";

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
        <Route path="/ide" element={<OnlineIDE />} />
        <Route path="/dashboard" element={<Dashboard courses={courses} />} />
        <Route path="/profile" element={<Profile />} />
        <Route
          path="/course/:id"
          element={<CourseDetails courses={courses} />}
        />
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
