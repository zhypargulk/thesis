import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";
import "./courses/CardCourse.css";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { getStudentsByGroupId } from "../controller/Groups";
import "./CardGroup.css";

const CardGroup = ({ title, imageUrl, groupId }) => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);

  const header = <img alt="Card" src={imageUrl} />;
  const onClickBoard = () => {
    navigate(groupId);
  };

  const fetchStudents = async () => {
    const students = await getStudentsByGroupId(groupId);
    setStudents(students.map((item) => item.name));
  };

  const footer = (
    <div className="flex flex-wrap justify-content-end gap-6">
      <Button
        label="Promote a leader"
        icon="pi pi-check"
        onClick={onClickBoard}
      />
      <Button label="Open the Board" className="" onClick={() => {}} />
    </div>
  );

  useEffect(() => {
    fetchStudents();
  }, [groupId]);

  return (
    <div className=" flex justify-content-center">
      <Card
        title={`${title} group project`}
        subTitle={
          <span>
            <b>All members of group: </b>
            {students.join(", ")}
            <br />
            <b>Leader:</b>
          </span>
        }
        footer={footer}
        header={header}
        className=""
      >
        <p className="m-0"></p>
      </Card>
    </div>
  );
};

export default CardGroup;
