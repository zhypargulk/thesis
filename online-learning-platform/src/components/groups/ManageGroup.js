import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getStudentsByGroupId,
  addLeaderToGroup,
} from "../../controller/Groups";
import { createTask, getAllTasks } from "../../controller/Tasks";
import { Dropdown } from "primereact/dropdown";
import { Panel } from "primereact/panel";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputTextarea } from "primereact/inputtextarea";
import { useAuth } from "../../context/AuthContext";
import img from "../project/images/raketa.png";
import MenubarCustom from "../menu/Menubar";
import { getDocumentById } from "../../controller/Courses";
import { Image } from "primereact/image";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";

import "./ManageGroup.css";

const ManageGroup = () => {
  const [students, setStudents] = useState([]);
  const [course, setCourse] = useState();
  const [selectedLeader, setSelectedLeader] = useState(null);
  const [tasks, setTasks] = useState([]);
  const { groupId } = useParams();
  const user = useAuth();
  const [userId, setUserId] = useState();
  const navigate = useNavigate();
  const [isLeaderExist, setIsLeaderExist] = useState(false);
  const [leader, setLeader] = useState();
  const [disableAction, setDisableAction] = useState(true);
  const toast = useRef(null);

  const showError = () => {
    toast.current.show({
      severity: "error",
      summary: "Error!",
      detail: "The leader is not promoted",
      life: 3000,
    });
  };

  const showSuccess = () => {
    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: "The user is a leader now",
      life: 3000,
    });
  };

  useEffect(() => {
    if (user) {
      setUserId(user.uid);
    }
  }, [user]);

  const fetchStudents = async () => {
    const students = await getStudentsByGroupId(groupId);
    setStudents(students);

    setTasks([
      {
        studentId: null,
        description: "",
        title: "",
      },
    ]);
  };

  const fetchCourse = async () => {
    const groupData = await getDocumentById("groups", groupId);
    const courseData = await getDocumentById("courses", groupData.courseDocId);
    setCourse(courseData);
    if (!groupData.leaderGroup) {
      setIsLeaderExist(false);
    } else {
      setIsLeaderExist(true);
      const lead = await getDocumentById("user", groupData.leaderGroup);
      setLeader(lead);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchCourse();
  }, [groupId]);

  useEffect(() => {
    if (leader && leader.id === userId) {
      setDisableAction(false);
    } else {
      setDisableAction(true);
    }
  }, [leader]);

  const handleLeaderChange = (e) => {
    setSelectedLeader(e.value);
  };

  const handlePromoteLeader = async () => {
    try {
      await addLeaderToGroup(groupId, selectedLeader.id);
      setLeader(selectedLeader);
      showSuccess();
    } catch (err) {
      console.error(err);
      showError();
    }
  };

  const handleTaskDescriptionChange = (e, index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].description = e.target.value;
    setTasks(updatedTasks);
  };

  const handleTitleChange = (e, index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].title = e.target.value;
    setTasks(updatedTasks);
  };

  const handleCreateTasks = async () => {
    try {
      if (userId && course) {
        for (const task of tasks) {
          await createTask(
            userId,
            groupId,
            "new",
            task.description,
            task.title,
            course.courseId
          );
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

  const addNewTask = () => {
    setTasks([...tasks, { studentId: null, title: "", description: "" }]);
  };

  const handleStudentChange = (e, taskIndex) => {
    const updatedTasks = tasks.map((task, index) => {
      if (index === taskIndex) {
        // Update the studentId for the task that changed
        return { ...task, studentId: e.value.id };
      }
      return task;
    });

    setTasks(updatedTasks);
  };

  return (
    <>
      <MenubarCustom />
      <Toast ref={toast} />
      {course ? (
        <div className="containers">
          <h2 className="project-title">Group details</h2>
          <p className="m-2 bg-panel1">
            {" "}
            <div className="grid m-3">
              <div>
                <h3 className="ml-2">{course.title} course</h3>
                <Image src={course.imageUrl} alt="Image" width="600" />
              </div>
              <div className="mt-6 ml-8">
                <h4>Members of the group:</h4>
                {students.map((student) => (
                  <li className="mb-3" key={student.id}>
                    {student.name}
                  </li>
                ))}
                <h4>Leader of the group: </h4>{" "}
                <li>
                  {leader
                    ? leader.name
                    : "There is no leader yet. Promote first please!"}
                </li>
                <div className="mt-4">
                  <div>
                    {leader ? (
                      <h3>Change a leader</h3>
                    ) : (
                      <h3>Promote a leader</h3>
                    )}
                    <div className="flex flex-row">
                      <Dropdown
                        value={selectedLeader}
                        options={students}
                        onChange={handleLeaderChange}
                        placeholder="Select a Leader"
                        optionLabel="name"
                        className="w-18rem h-3rem"
                      />
                      <Button
                        label="Promote Leader"
                        onClick={handlePromoteLeader}
                        className="flex w-20rem h-3rem ml-8"
                      />
                    </div>
                  </div>
                  <Button
                    label="Go to the board"
                    onClick={onClickToBoardHandler}
                    className="flex w-full h-3rem mt-5"
                  />
                </div>
              </div>
            </div>
          </p>
          <img src={img} width="100" alt="Raketa" className="mt-8" />
          <p className="project-question">
            If you are a leader, please distribute tasks among students.
          </p>
          <h1 className="text-white">Assign tasks:</h1>
          <div className=" bg-panel ">
            <div className="=">
              <div>
                {tasks.map((task, index) => (
                  <Panel
                    key={index}
                    header={`Task Form ${index + 1}`}
                    className="mt-3"
                  >
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
                            onChange={(e) => handleStudentChange(e, index)}
                            placeholder="Select a student"
                            optionLabel="name"
                            className="mt-4"
                          />
                        </div>
                        <div className="p-field p-col-12 p-md-8 mt-4">
                          <label htmlFor={`taskTitle${index}`}>
                            Task Title:
                          </label>
                          <InputTextarea
                            id={`tasTitle${index}`}
                            value={task.title}
                            onChange={(e) => handleTitleChange(e, index)}
                            rows={1}
                            className="mt-4"
                            cols={30}
                          />
                        </div>
                        <div className="p-field p-col-12 p-md-8 mt-4">
                          <label htmlFor={`taskDescription${index}`}>
                            Task Description:
                          </label>
                          <InputTextarea
                            id={`taskDescription${index}`}
                            value={task.description}
                            onChange={(e) =>
                              handleTaskDescriptionChange(e, index)
                            }
                            rows={5}
                            cols={30}
                            className="mt-4"
                          />
                        </div>
                      </div>
                    </Card>
                  </Panel>
                ))}
                <Button
                  icon="pi pi-plus"
                  className="p-button-rounded p-button-success"
                  onClick={addNewTask}
                  label="Add New Task"
                  style={{ margin: "10px" }}
                />
                <Button
                  label="Create Tasks"
                  onClick={handleCreateTasks}
                  className="flex w-full h-3rem mt-3 ml-3 mb-4"
                  disabled={disableAction}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <ProgressSpinner />
      )}
    </>
  );
};

export default ManageGroup;
