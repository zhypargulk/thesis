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
    // eslint-disable-next-line 
  }, []);

  const truncateDesc = (desc, length = 100) => {
    return desc.length > length && !showFullDesc
      ? `${desc.substring(0, length)}...`
      : desc;
  };

  const truncateTitle = (desc, length = 20) => {
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


  return (
    <div className=" flex justify-content-center">
      <Card
        title={<span className="black-text">{truncateTitle(title)}</span>}
        subTitle={<span className="black-text">Course Description</span>}
        header={header}
        className="md:w-30rem green-border-card"
      >
        <div className="card-content-container flex-grow-1 d-flex flex-column">
          <div className="flex-grow-1">
            <p className="m-0 black-text desc">{truncateDesc(desc)}</p>
          </div>
          <Button
        label="Continue lessons"
        icon="pi pi-forward"
        className="w-16rem mt-4"
        onClick={onClickBoard}
      />
        </div>

      </Card>
    </div>
  );
};

export default CardMyCourse;
