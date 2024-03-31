import { useEffect, useState } from "react";
import { getAllEnrolledStudents } from "../controller/Students";
import { useParams } from "react-router-dom";
import {} from "../controller/Courses";
import { MultiSelect } from "primereact/multiselect";
import { Button } from "primereact/button";
import emailjs from "@emailjs/browser";
import { useAuth } from "../context/AuthContext";
import {
  createGroupCourse,
  createGroupWithModifications,
} from "../controller/Groups";
import MenubarCustom from "./Menubar";

const FinalProjectGroups = () => {
  const [students, setStudents] = useState();
  const { docId } = useParams();
  const [selectedStudents, setSelectedStudents] = useState(null);
  const [studentIds, setStudentIds] = useState([]);
  const [selectedStudentsEmail, setSelectedStudentsEmail] = useState([]);
  const user = useAuth();

  console.log(user);
  const fetchStudents = async () => {
    try {
      const dataStudents = await getAllEnrolledStudents(docId);

      setStudents(dataStudents);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const serviceid = "service_66qy3k7";
  const templateId = "template_qe8xnq8";
  const public_key = "RKB_HwaoKg6j68YMI";
  const sendInvitations = async () => {
    try {
      const templateParams = {
        to_email: selectedStudentsEmail.join(","),
      };

      //   await emailjs.send(serviceid, templateId, templateParams, public_key);
      // createGroup(docID, selectedStudents);
      createGroupWithModifications(docId, selectedStudents);
      createGroupCourse(studentIds, docId, user.uid);
      alert("Invitations sent successfully!");
    } catch (error) {
      console.error("Error sending invitations:", error);
      alert("Error sending invitations");
    }
  };

  return (
    <>
      <MenubarCustom />
      <div className="card">
        <h2 className="flex mt-4 ml-4 text-3xl">
          You can join to the existing groups or create a new one
        </h2>
        <div className="flex flex-column">
          {/* <div>
            <h3 className="flex ml-5 mt-5">Join to the group</h3>
            <h4 className="flex ml-5 mt-2">Choose a group to join</h4>
          </div> */}
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
                // implement it
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
    </>
  );
};

export default FinalProjectGroups;
