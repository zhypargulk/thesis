import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Kanban from "./Kanban";
import { getAllTasks } from "../controller/Tasks"; // Adjust the import path as necessary

const GroupBoard = () => {
  const { docId } = useParams();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      if (docId) {
        const fetchedTasks = await getAllTasks(docId);
        setTasks(fetchedTasks);
      }
    };

    fetchTasks();
  }, [docId]);

  return (
    <>
      <Kanban id={docId}></Kanban>
    </>
  );
};

export default GroupBoard;
