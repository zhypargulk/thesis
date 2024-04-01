import React from "react";
import { Card } from "primereact/card";
import "./CardCourse.css"; // Import CSS file for styling
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
const CardCourse = ({ title, imageUrl, desc, id, groupId }) => {
  const navigate = useNavigate();
  const header = <img alt="Card" src={imageUrl} />;

  const onClickBoard = () => {
    navigate(`/groups/${groupId}`);
  };
  const footer = (
    <div className="flex flex-wrap justify-content-end gap-2">
      <Button
        label="Go to the board"
        icon="pi pi-check"
        onClick={onClickBoard}
      />
    </div>
  );

  return (
    <div className="card flex justify-content-center">
      <Card
        title={title}
        subTitle="Subtitle"
        footer={footer}
        header={header}
        className="md:w-25rem"
      >
        <p className="m-0">{desc}</p>
      </Card>
    </div>
  );
};

export default CardCourse;
