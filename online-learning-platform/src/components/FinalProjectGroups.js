import { useEffect, useState, useRef } from "react";
import { getAllEnrolledStudents } from "../controller/Students";
import { useParams } from "react-router-dom";
import { MultiSelect } from "primereact/multiselect";
import { Button } from "primereact/button";
import emailjs from "@emailjs/browser";
import { useAuth } from "../context/AuthContext";
import { Toast } from "primereact/toast";
import { createGroupWithModifications } from "../controller/Groups";
import MenubarCustom from "./Menubar";
import { useMountEffect } from "primereact/hooks";
import { Message } from "primereact/message";

const FinalProjectGroups = () => {
  const [students, setStudents] = useState();
  const { docId } = useParams();
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
        console.log(dataStudents);

        setStudents(dataStudents.filter((st) => st.id !== user.uid));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [user]);

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

  return (
    <>
      <MenubarCustom />
      <div className="card">
        <Toast ref={toast} />

        <h3 className="flex mt-4 ml-4 text-3xl">You can create a new group</h3>
        <div className="flex flex-column">
          <div>
            <h3 className="flex ml-5 mt-5">Create a new group </h3>
            <h4 className="flex ml-5 mt-2">
              Select students enrolled to the course
            </h4>
            <MultiSelect
              value={selectedStudents}
              options={students}
              optionLabel="name"
              onChange={(e) => {
                setSelectedStudents(e.value);
                setSelectedStudentsEmail(
                  e.value.map((student) => student.email)
                );
                setStudentIds(e.value.map((student) => student.id));
              }}
              placeholder="Select Students"
              maxSelectedLabels={3}
              className="w-full md:w-20rem ml-4"
            />
            <Button
              className="flex ml-4 mt-4"
              label="Send invitations to the group for these users"
              onClick={sendInvitations}
            />
          </div>
        </div>
      </div>
      {invitationsSent && (
        <div className="flex justify-content-start mt-3 ml-4">
          <Message
            severity="info"
            text="Group was created go to Group section"
          />
        </div>
      )}
    </>
  );
};

export default FinalProjectGroups;
