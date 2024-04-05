import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getStudentsByGroupId, addLeaderToGroup } from "../controller/Groups";
import { createTask, getAllTasks } from "../controller/Tasks";
import { Dropdown } from "primereact/dropdown";
import { Panel } from "primereact/panel";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputTextarea } from "primereact/inputtextarea";
import { Divider } from "primereact/divider";
import { useAuth } from "../context/AuthContext";

const ManageGroup = () => {
  const [students, setStudents] = useState([]);
  const [selectedLeader, setSelectedLeader] = useState(null);
  const [tasks, setTasks] = useState([]);
  const { groupId } = useParams();
  const user = useAuth();
  const [userId, setUserId] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setUserId(user.uid);
    }
  }, [user]);
  const fetchStudents = async () => {
    const students = await getStudentsByGroupId(groupId);
    setStudents(students);
    setTasks(
      students.map((student) => ({ studentId: student.id, description: "" }))
    );
  };

  useEffect(() => {
    fetchStudents();
  }, [groupId]);

  const handleLeaderChange = (e) => {
    setSelectedLeader(e.value);
  };

  const handlePromoteLeader = async () => {
    await addLeaderToGroup(groupId, selectedLeader.id);
  };

  const handleTaskDescriptionChange = (e, index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].description = e.target.value;
    setTasks(updatedTasks);
  };

  const handleCreateTasks = async () => {
    try {
      if (userId) {
        for (const task of tasks) {
          await createTask(userId, groupId, "new", task.description);
        }
      }
      getTasks();
    } catch (error) {
      console.error("Error creating tasks:", error);
    }
  };

  const getTasks = async () => {
    const task = await getAllTasks(groupId);
  };

  const onClickToBoardHandler = () => {
    navigate("board");
  };

  return (
    <div className="p-grid">
      <div className="p-col-12 ml-3 mt-4">
        <Panel header="Students in the Group">
          <ul>
            {students.map((student) => (
              <li key={student.id}>{student.name}</li>
            ))}
          </ul>
        </Panel>
      </div>
      <div className="p-col-12 flex flex-column ml-3 mt-4">
        <Panel header="Promote Leader">
          <Dropdown
            value={selectedLeader}
            options={students}
            onChange={handleLeaderChange}
            placeholder="Select a Leader"
            optionLabel="name"
          />
          <Button
            label="Promote Leader"
            onClick={handlePromoteLeader}
            className="flex w-10rem h-3rem mt-3 ml-3"
          />
        </Panel>
        <Divider />
        {tasks.map((task, index) => (
          <Panel key={index} header={`Task Form ${index + 1}`} className="m-3">
            <Card className="mt-3">
              <div className="p-fluid p-formgrid p-grid">
                <div className="p-field p-col-12 p-md-4 mt-4">
                  <label htmlFor={`studentDropdown${index}`}>
                    Choose a student:
                  </label>
                  <Dropdown
                    id={`studentDropdown${index}`}
                    value={students.find(
                      (student) => student.id === task.studentId
                    )}
                    options={students}
                    onChange={handleLeaderChange} // Handle student change here if needed
                    placeholder="Select a student"
                    optionLabel="name"
                  />
                </div>
                <div className="p-field p-col-12 p-md-8 mt-4">
                  <label htmlFor={`taskDescription${index}`}>
                    Task Description:
                  </label>
                  <InputTextarea
                    id={`taskDescription${index}`}
                    value={task.description}
                    onChange={(e) => handleTaskDescriptionChange(e, index)}
                    rows={5}
                    cols={30}
                  />
                </div>
              </div>
            </Card>
          </Panel>
        ))}
        <Button
          label="Create Tasks"
          onClick={handleCreateTasks}
          className="flex w-30rem h-3rem mt-3 ml-3"
        />
        <Button
          label="Go to the board"
          onClick={onClickToBoardHandler}
          className="flex w-30rem h-3rem mt-3 ml-3"
        />
      </div>
    </div>
  );
};

export default ManageGroup;
