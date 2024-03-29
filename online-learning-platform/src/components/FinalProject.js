import { useParams } from "react-router-dom";
import { fetchCourseById } from "../controller/Courses";
import { useState, useEffect } from "react";

import { Card } from "primereact/card";
import { Button } from "primereact/button";

const FinalProject = () => {
  const { courseId } = useParams();
  const [project, setProject] = useState();

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const courseData = await fetchCourseById(courseId);
        setProject(courseData.finalProject);
      } catch (err) {
        console.error(err);
      }
    };

    fetchLessons();
  }, [courseId]);

  const findGroupMates = () => {};

  return (
    <>
      <Card>
        <p>{project}</p>
      </Card>
      <Button
        className="flex m-3"
        label="Find a group to complete the project"
        onClick={findGroupMates}
      />
    </>
  );
};
export default FinalProject;
