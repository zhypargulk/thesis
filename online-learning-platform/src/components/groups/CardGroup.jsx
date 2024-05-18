import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";
import "../courses/CardCourse.css";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import {
  fetchStudentsInGroup,
  getLeaderByRef,
  
} from "../../controller/Groups";
import "./CardGroup.css";
import { getDocumentById } from "../../controller/Courses";

const CardGroup = ({ title, imageUrl, groupId }) => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [leader, setLeader] = useState();
  const [group, setGroup] = useState([]);

  const header = (
    <div className="flex align-items-center justify-content-center w-100px h-100px">
      <img alt="Card" src={imageUrl} className="w-100px h-100px" />
    </div>
  );

  const onClickBoard = () => {
    navigate(groupId);
  };

  const fetchStudents = async () => {
    try {
      if (groupId) {
        const students = await fetchStudentsInGroup(groupId);
        const groupData = await getDocumentById("groups", groupId);
        const st = students.map((item) => item.name);
        setGroup(groupData);
        setStudents(st);
        if (groupData.leaderGroup) {
          const leadData = await getLeaderByRef(groupData.leaderGroup);
          console.log(leadData);
          setLeader(leadData);
        }
      }
    } catch (error) {
      console.error("Failed to fetch students or group:", error);
    }
  };

  const footer = (
    <div className="flex flex-wrap justify-content-end gap-6">
      <Button
        label="Promote a leader"
        icon="pi pi-check"
        onClick={onClickBoard}
      />
      <Button
        label="Open the Board"
        onClick={() => navigate(`/groups/${groupId}/board`)}
      />
    </div>
  );

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className=" flex justify-content-center">
      {group && (
        <Card
          title={`${title} group project`}
          subTitle={
            <span>
              <b>All members of group: </b>
              {students.join(", ")}
              <br />
              <p>
                {" "}
                <b>Leader:</b> {leader ? leader.name : "No leader"}
              </p>
            </span>
          }
          footer={footer}
          header={header}
        >
          <p className="m-0"></p>
        </Card>
      )}
    </div>
  );
};

export default CardGroup;
