import { useParams } from "react-router-dom";
import { getDocumentById } from "../../controller/Courses";
import { useState, useEffect, useRef } from "react"; // Combined useState and useEffect

import MenubarCustom from "../menu/Menubar";
import { getAllEnrolledStudents } from "../../controller/Students";
import img from "./images/raketa.png";
import { MultiSelect } from "primereact/multiselect";
import { Button } from "primereact/button";
import emailjs from "@emailjs/browser";
import { useAuth } from "../../context/AuthContext";
import { Toast } from "primereact/toast";
import { createGroupWithModifications } from "../../controller/Groups";
import { Message } from "primereact/message";

import "./Project.css";

const FinalProject = () => {
  const { docId } = useParams();
  const [project, setProject] = useState();
  const [students, setStudents] = useState();
  const [selectedStudents, setSelectedStudents] = useState(null);
  const [studentIds, setStudentIds] = useState([]);
  const [selectedStudentsEmail, setSelectedStudentsEmail] = useState([]);
  const user = useAuth();
  const toast = useRef(null);
  const [invitationsSent, setInvitationsSent] = useState(false);

  const showSuccess = () => {
    toast.current.show({
      severity: "success",
      summary: "Invitations were sent",
      detail: "Each user gets an email about it!",
      life: 3000,
    });

    setInvitationsSent(true);
  };

  const fetchStudents = async () => {
    try {
      if (user && user.uid) {
        const dataStudents = await getAllEnrolledStudents(docId);

        setStudents(dataStudents.filter((st) => st.id !== user.uid));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line
  }, [user]);

  useEffect(() => {
    if (selectedStudents) {
      setSelectedStudentsEmail(
        selectedStudents.map((student) => student.email)
      );
      setStudentIds(selectedStudents.map((student) => student.id));
    }
  }, [selectedStudents]);

  const serviceid = "service_66qy3k7";
  const templateId = "template_qe8xnq8";
  const public_key = "RKB_HwaoKg6j68YMI";
  const sendInvitations = async () => {
    try {
      const templateParams = {
        to_email: selectedStudentsEmail.join(","),
      };

      await emailjs.send(serviceid, templateId, templateParams, public_key);
      createGroupWithModifications(
        docId,
        selectedStudents,
        studentIds,
        user.uid
      );
      showSuccess();
    } catch (error) {
      console.error("Error sending invitations:", error);
      alert("Error sending invitations");
    }
  };

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

  return (
    <>
      <MenubarCustom />
      {students && (
        <div className="container">
          <Toast ref={toast} />
          <h1 className="text-white">Final Project Description</h1>
          <p className="m-2 bg-panel">{project}</p>
          <img src={img} width="100" alt="Raketa" className="mt-8" />
          <p className="project-question">
            Are you ready to complete the project? Then let's create a new group
            for it.
          </p>
          <h1 className="text-white">Create a new group:</h1>
          <div className=" bg-panel ">
            <div className="=">
              <div>
                <h4
                  className="ml-5 mt-2"
                  style={{ fontFamily: "Circular, Helvetica Neue, sans-serif" }}
                >
                  Select students enrolled to the course
                </h4>
{/**fix */}
                <MultiSelect
                  value={selectedStudents}
                  options={students}
                  optionLabel="name"
                  onChange={(e) => {
                    setSelectedStudents(e.value);
                  }}
                  placeholder="Select Students"
                  maxSelectedLabels={3}
                  className="w-full md:w-20rem ml-4"
                />
                <Button
                  className="ml-4 mt-4"
                  label="Send invitations to the group for these users"
                  onClick={sendInvitations}
                />
              </div>
            </div>
            {invitationsSent && (
              <div className=" justify-content-start mt-3 ml-4">
                <Message
                  severity="info"
                  text="Group was created go to Group section"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
export default FinalProject;
