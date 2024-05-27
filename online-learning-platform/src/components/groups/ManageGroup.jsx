import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  addLeaderToGroup,
  getCourseByRef,
  fetchStudentsInGroup,
  getLeaderByRef,
} from "../../controller/Groups";
import { createTask } from "../../controller/Tasks";
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
  const [data, setData] = useState([]);
  const [selectedLeader, setSelectedLeader] = useState(null);
  const [tasks, setTasks] = useState([]);
  const { groupId } = useParams();
  const user = useAuth();
  const navigate = useNavigate();
  // eslint-disable-next-line
  const [isLeaderExist, setIsLeaderExist] = useState(false);
  const [leader, setLeader] = useState();
  const [disableAction, setDisableAction] = useState(true);
  const toast = useRef(null);
  const [userId, setUserId] = useState();

  useEffect(() => {
    if (user) {
      setUserId(user.uid);
    }
  }, [user]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if (user && user.uid) {
          const groupData = await getDocumentById("groups", groupId);
          const courseData = await getCourseByRef(groupData.courseDocRef);
          const fetchstudents = await fetchStudentsInGroup(groupId);

          setTasks([
            {
              studentId: null,
              description: "",
              title: "",
            },
          ]);
          setStudents(fetchstudents);
          setData(courseData);

          if (!groupData.leaderGroup) {
            setIsLeaderExist(false);
          } else {
            setIsLeaderExist(true);
            const lead = await getLeaderByRef(groupData.leaderGroup);
            setLeader(lead);
          }
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
    // eslint-disable-next-line
  }, [userId]);

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

  const showSuccessCreatedTask = () => {
    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: "New tasks were created",
      life: 3000,
    });
  };

  useEffect(() => {
    if (user) {
      setUserId(user.uid);
    }
  }, [user]);

  useEffect(() => {
    if (leader && leader.id === userId) {
      setDisableAction(false);
    } else {
      setDisableAction(true);
    }
    // eslint-disable-next-line
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
      if (user.uid && data) {
        for (const task of tasks) {
          await createTask(
            task.studentId,
            groupId,
            "new",
            task.description,
            task.title,
            data.docId
          );
        }
      }
      showSuccessCreatedTask();
      setTasks([{ studentId: null, title: "", description: "" }]);
    } catch (error) {
      console.error("Error creating tasks:", error);
    }
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
        return { ...task, studentId: e.value.id };
      }
      return task;
    });

    setTasks(updatedTasks);
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
  };

  return (
    <>
      <MenubarCustom />
      <Toast ref={toast} />
      {data ? (
        <div className="containers">
          <h2 className="text-6xl text-white">Group details</h2>
          <div className="m-2 bg-panel1">
            {" "}
            <div className="grid m-3">
              <div>
                <h3 className="ml-2">{data.title} course</h3>
                <Image src={data.imageUrl} alt="Image" width="500" />
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
          </div>
          <img src={img} width="100" alt="Raketa" className="mt-8" />
          <p className="project-question">
            If you are a leader, please distribute tasks among students.
          </p>
          <h1 className="text-white">Assign tasks:</h1>
          <div className=" bg-panel ">
            <div>
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
                      <Button
                        icon="pi pi-trash"
                        className="p-button-rounded p-button-success mt-4"
                        onClick={() => handleDeleteTask(index)}
                        label="Delete the task"
                      />
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
