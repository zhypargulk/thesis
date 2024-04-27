import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Kanban from "./Kanban";
import { getAllTasks } from "../../controller/Tasks";
import MenubarCustom from "../menu/Menubar";
import ChatGroup from "./ChatGroup";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

const GroupBoard = () => {
  const { docId } = useParams();
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      if (docId) {
        const fetchedTasks = await getAllTasks(docId);
        console.log(fetchedTasks);
        setTasks(fetchedTasks);
      }
    };

    fetchTasks();
  }, [docId]);

  return (
    <>
      <MenubarCustom />
      <div className="flex flex-row">
        <Kanban id={docId}></Kanban>
        <ChatGroup />
      </div>
      <div className="flex flex-row w-full items-center">
        <Button
          label="Add new tasks"
          className="ml-5 mt-2 w-30rem"
          onClick={() => navigate(`/groups/${docId}`)}
        />
        <Button
          label="Check your project status"
          className="mt-2 w-4 ml-auto mr-5"
          onClick={() => navigate(`/groups/${docId}/ide`)}
        />
      </div>
    </>
  );
};

export default GroupBoard;
