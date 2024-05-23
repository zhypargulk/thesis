import React, { useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import "./CardCourse.css";

const CardCourse = ({ title, imageUrl, desc, id }) => {
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
    navigate(`/courses/${id}`);
  };

  return (
    <div className="ml-8 flex justify-content-center">
      <Card
        title={<span className="black-text">{title}</span>}
        subTitle={<span className="black-text">Course Description</span>}
        header={header}
        className="w-30rem h-40rem black-border-card card-content"
      >
        <div className="card-content-container flex-grow-1 d-flex flex-column">
          <p className="m-0 black-text">{truncateDesc(desc)}</p>
          {/* {desc.length > 100 && (
            <Button
              label={"Show More"}
              className="button-link-text"
              onClick={() => navigate(`/courses/${id}`)}
            />
          )} */}
          <Button
            label="Details of the course"
            onClick={onClickBoard}
            className="details-button mt-4"
          />
        </div>
      </Card>
    </div>
  );
};

export default CardCourse;
