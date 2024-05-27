import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { fetchLastCompletedLesson } from "../../controller/Courses";
import "../courses/CardCourse.css";

const CardMyCourse = ({ title, imageUrl, desc, id, groupId }) => {
  const navigate = useNavigate();
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [lessonNumber, setLessonNumber] = useState();
  const user = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user && user.uid) {
          const index = await fetchLastCompletedLesson(id, user.uid);
          setLessonNumber(index);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchData();
  }, []);

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
    navigate(`/course/${id}/lessons/${lessonNumber}`);
  };

  const footer = (
    <div className="flex flex-wrap justify-content-end gap-2">
      <Button
        label="Continue lessons"
        icon="pi pi-forward"
        onClick={onClickBoard}
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

export default CardMyCourse;
