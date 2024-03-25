import React from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useNavigate, useParams } from "react-router-dom";

const Lesson = ({ lessonNumber, course }) => {
  const navigate = useNavigate();
  const { lessons } = useParams();

  const handleTakeLesson = () => {
    // Navigate to the lesson page, you might want to replace '/lesson' with your actual route
    navigate(`/lesson/${lessonNumber}`);
  };

  return (
    <Card title={`Lesson ${lessonNumber}`}>
      <div>
        Lesson {lessons}
        {/* You can customize the content of your lesson card here */}
        <Button label="Take Lesson" onClick={handleTakeLesson} />
      </div>
    </Card>
  );
};

export default Lesson;
