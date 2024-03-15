// CourseDetails.js
import React from "react";
import { useParams } from "react-router-dom";

const CourseDetails = ({ courses }) => {
  const { id } = useParams(); // Get the course id from the URL params
  const course = courses.find((course) => course.id === parseInt(id)); // Find the course with the matching id

  if (!course) {
    return <div>Course not found</div>; // Handle case where course is not found
  }

  return (
    <div className="course-details">
      <h2>{course.title}</h2>
      <img src={course.image} alt={course.title} />
      <p>Description: {course.description}</p>
      <p>Price: ${course.price}</p>
      <p>Author: {course.author}</p>
    </div>
  );
};

export default CourseDetails;
