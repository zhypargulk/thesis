import React, { useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import "../courses/CardCourse.css";

const CreatedCourseCard = ({ title, imageUrl, desc, id, groupId }) => {
  const navigate = useNavigate();
  const [showFullDesc, setShowFullDesc] = useState(false);

  const truncateDesc = (desc, length = 100) => {
    return desc.length > length && !showFullDesc
      ? `${desc.substring(0, length)}...`
      : desc;
  };

  const header = (
    <div className="flex align-items-center justify-content-center w-200px h-200px">
      <img alt="Card" src={imageUrl} className="w-200px h-200px" />
    </div>
  );

  const onClickBoard = () => {
    navigate(`/edit/${id}`);
  };

  const footer = (
    <div className="flex flex-wrap justify-content-end gap-2">
      <Button
        label="Edit the course"
        icon="pi pi-pencil"
        onClick={() => onClickBoard()}
      />
    </div>
  );

  return (
    <div className=" flex justify-content-center">
      <Card
        title={<span className="black-text">{title}</span>}
        subTitle={<span className="black-text">Course Description</span>}
        footer={footer}
        header={header}
        className="md:w-30rem  green-border-card"
      >
        <p className="m-0 black-text">{truncateDesc(desc)}</p>
        {desc.length > 100 && (
          <Button
            label={showFullDesc ? "Show Less" : "Show More"}
            className="button-link-text"
            onClick={() => setShowFullDesc(!showFullDesc)}
          />
        )}
      </Card>
    </div>
  );
};

export default CreatedCourseCard;
