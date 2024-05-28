import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Kanban from "./Kanban";
import { getAllTasks } from "../../controller/Tasks";
import { getCourseByGroupId } from "../../controller/Groups";
import MenubarCustom from "../menu/Menubar";
import ChatGroup from "./ChatGroup";
import { useNavigate } from "react-router-dom";
import "./Kanban.css";

const GroupBoard = () => {
  const { docId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [course, setCourse] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      if (docId) {
        const fetchedTasks = await getAllTasks(docId);
        const fetchedCourse = await getCourseByGroupId(docId);
        setTasks(fetchedTasks);
        setCourse(fetchedCourse);
      }
    };

    fetchTasks();
  }, [docId]);

  return (
    <>
      <MenubarCustom />
      <div className=" align-items-center justify-content-center mt-4 bg-panel2">
        <p>

          {course.finalProject}
        </p>
      </div>
      <div className="flex flex-row mt-5 ml-5">
        <Kanban id={docId}></Kanban>
        <ChatGroup id={docId}/>

      </div>
  
    </>
  );
};

export default GroupBoard;
