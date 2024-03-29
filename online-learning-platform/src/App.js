import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";

import "./index.css";
import "./flag.css";

import Auth from "./components/auth";
import LogIn from "./components/LogIn";
// import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import OnlineIDE from "./components/OnlineIDE";
import Home from "./components/Home";
import CreateCourse from "./components/CreateCourse";
import CourseDashboard from "./components/CourseDashboard";
import CourseDetails from "./components/CourseDetails";
import Lesson from "./components/Lesson";
import FinalProject from "./components/FinalProject";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/register" element={<Auth />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/" element={<Home />} />
        <Route path="/ide" element={<OnlineIDE />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/courses" element={<CourseDashboard />} />
        <Route path="/create" element={<CreateCourse />} />
        <Route path="/course/:courseId/task" element={<FinalProject />} />
        <Route path="/courses/:courseId" element={<CourseDetails />} />
        <Route
          path="/course/:courseId/lessons/:lessonNumber"
          element={<Lesson />}
        />
      </Routes>
    </Router>
  );
};

export default App;
