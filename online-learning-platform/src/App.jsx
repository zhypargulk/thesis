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

import Auth from "./components/register/Register";
import LogIn from "./components/login/LogIn";
import Profile from "./components/profile/Profile";
import OnlineIDE from "./components/ide/OnlineIDE";
import Home from "./components/home/Home";
import CreateCourse from "./components/courses/CreateCourse";
import CourseDashboard from "./components/courses/CourseDashboard";
import CourseDetails from "./components/course-details/CourseDetails";
import Lesson from "./components/lesson/Lesson";
import FinalProject from "./components/project/FinalProject";
import GroupsComponent from "./components/groups/GroupsComponent";
import GroupBoard from "./components/groups/GroupBoard";
import ManageGroup from "./components/groups/ManageGroup";
import Kanban from "./components/groups/Kanban";
import EnrolledCourses from "./components/mycourses/EnrolledCourses";
import MyCreatedCourses from "./components/created-courses/MyCreatedCourses";
import EditCourse from "./components/created-courses/EditCourse";
import ResetPassword from "./components/login/ResetPassword";

if (process.env.NODE_ENV !== "test") {
  require("./index.css");
}

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/register" element={<Auth />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/" element={<Home />} />
        <Route path="/ide" element={<OnlineIDE />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/courses" element={<CourseDashboard />} />
        <Route path="/mycourses" element={<EnrolledCourses />} />
        <Route path="/create" element={<CreateCourse />} />
        <Route path="/course/:docId/task" element={<FinalProject />} />
        <Route path="/courses/:docId" element={<CourseDetails />} />
        <Route path="/groups/:groupId" element={<ManageGroup />} />
        <Route path="/groups" element={<GroupsComponent />} />
        <Route path="/kanban" element={<Kanban />} />
        <Route path="/createdcourses" element={<MyCreatedCourses />} />
        <Route path="/edit/:courseId" element={<EditCourse />} />
        <Route path="/groups/:docId/board" element={<GroupBoard />} />
        <Route path="/groups/:docId/ide" element={<OnlineIDE />} />
        <Route
          path="/course/:docId/lessons/:lessonNumber"
          element={<Lesson />}
        />
      </Routes>
    </Router>
  );
};

export default App;
