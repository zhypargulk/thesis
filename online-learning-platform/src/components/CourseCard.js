// CourseCard.js
import React from "react";
import { Link } from "react-router-dom";

const CourseCard = ({ course }) => {
  return (
    <div className="course-card">
      <img src={course.image} alt={course.title} />
      <h3>
        <Link to={`/course/${course.id}`}>{course.title}</Link>
      </h3>
      <p>{course.description}</p>
      <p>Price: ${course.price}</p>
    </div>
  );
};

export default CourseCard;
