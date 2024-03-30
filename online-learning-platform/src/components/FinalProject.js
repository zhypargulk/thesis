import { useParams } from "react-router-dom";
import { fetchCourseById } from "../controller/Courses";
import { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import MenubarCustom from "./Menubar";
import { getAllEnrolledStudents } from "../controller/Students";

const FinalProject = () => {
  const { courseId } = useParams();
  const [project, setProject] = useState();
  const [docId, setDocId] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const courseData = await fetchCourseById(courseId);
        setProject(courseData.finalProject);
        setDocId(courseData.docId);
      } catch (err) {
        console.error(err);
      }
    };

    fetchLessons();
  }, [courseId]);

  const findGroupMates = async () => {
    const studentsEnrolled = await getAllEnrolledStudents(docId);
    navigate(`/course/${courseId}/task/groups`);
  };

  return (
    <>
      <MenubarCustom />

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
