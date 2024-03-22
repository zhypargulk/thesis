import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

const AllCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "courses"));
        const coursesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCourses(coursesData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching courses: ", error);
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div>
      <h2>All Courses</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="p-grid p-align-stretch">
          {courses.map((course) => (
            <div className="p-col-12 p-md-6 p-lg-4" key={course.id}>
              <Card title={course.title} subTitle={course.description}>
                <img src={course.imageUrl} alt={course.title} />
                <div>
                  <Link to={`/course/${course.id}`}>
                    <Button label="View Details" />
                  </Link>
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllCourses;
