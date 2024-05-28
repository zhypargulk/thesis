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


  const truncateTitle = (desc, length = 20) => {
    return desc.length > length && !showFullDesc
      ? `${desc.substring(0, length)}...`
      : desc;
  };

  return (
    <div className=" flex justify-content-center">
      <Card
        title={<span className="black-text">{truncateTitle(title)}</span>}
        subTitle={<span className="black-text desc">Course Description</span>}

        header={header}
        className="md:w-30rem  green-border-card card-fix"
      >
        <div className="card-content-container flex-grow-1 d-flex flex-column">
          <div className="flex-grow-1">
            <p className="m-0 black-text desc">{truncateDesc(desc)}</p>
          </div>
          <Button
        label="Edit the course"
        icon="pi pi-pencil"
        onClick={() => onClickBoard()}
        className="w-15rem mt-5"
      />
        </div>
      </Card>
    </div>
  );
};

export default CreatedCourseCard;
