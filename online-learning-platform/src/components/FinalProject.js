import { useParams } from "react-router-dom";
import { getDocumentById } from "../controller/Courses";
import { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import MenubarCustom from "./Menubar";
import { getAllEnrolledStudents } from "../controller/Students";
import { Panel } from "primereact/panel";
import FinalProjectGroups from "./FinalProjectGroups";

const FinalProject = () => {
  const { docId } = useParams();
  const [project, setProject] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const courseData = await getDocumentById("courses", docId);

        setProject(courseData.finalProject);
      } catch (err) {
        console.error(err);
      }
    };

    fetchLessons();
  }, [docId]);

  const findGroupMates = async () => {
    const studentsEnrolled = await getAllEnrolledStudents(docId);
    navigate(`/course/${docId}/task/groups`);
  };

  return (
    <>
      <MenubarCustom />
      <Panel header="Final Project Description" className="mt-5">
        <p>{project}</p>
      </Panel>
      <Button
        className="flex m-3 w-9"
        label="Find a group to complete the project"
        onClick={findGroupMates}
      />
    </>
  );
};
export default FinalProject;
