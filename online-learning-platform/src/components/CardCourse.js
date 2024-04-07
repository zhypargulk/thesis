import React, { useState } from "react";
import { Card } from "primereact/card";
import "./CardCourse.css";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

const CardCourse = ({ title, imageUrl, desc, id, groupId }) => {
  const navigate = useNavigate();
  const [showFullDesc, setShowFullDesc] = useState(false);

  // Define truncateDesc function inside the CardCourse component
  const truncateDesc = (desc, length = 100) => {
    return desc.length > length && !showFullDesc
      ? `${desc.substring(0, length)}...`
      : desc;
  };

  const header = <img alt="Card" src={imageUrl} />;
  const onClickBoard = () => {
    navigate(id);
  };

  const footer = (
    <div className="flex flex-wrap justify-content-end gap-2">
      <Button
        label="Details of the course"
        icon="pi pi-check"
        onClick={onClickBoard}
      />
    </div>
  );

  return (
    <div className="card flex justify-content-center">
      <Card
        title={title}
        subTitle="Course Description"
        footer={footer}
        header={header}
        className="md:w-30rem"
      >
        <p className="m-0">{truncateDesc(desc)}</p>
        {desc.length > 100 && (
          <Button
            label={showFullDesc ? "Show Less" : "Show More"}
            className="p-button-text p-button-plain"
            onClick={() => setShowFullDesc(!showFullDesc)}
          />
        )}
      </Card>
    </div>
  );
};

export default CardCourse;
