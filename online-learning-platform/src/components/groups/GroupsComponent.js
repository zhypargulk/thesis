import React, { useState, useEffect } from "react";
import { fetchStudentCoursesAndGroups } from "../../controller/Groups"; // Import the function
import { useAuth } from "../../context/AuthContext";
import CardGroup from "./CardGroup";
import MenubarCustom from "../menu/Menubar";
import { InputText } from "primereact/inputtext";

const GroupsComponent = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const user = useAuth();
  const [userId, setUserId] = useState();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (user) {
      setUserId(user.uid);
    }
  }, [user]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if (user && user.uid) {
          const fetchData = await fetchStudentCoursesAndGroups(user.uid);

          setData(fetchData);
          setFilteredData(fetchData);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, [userId]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const filteredCourses = data.filter((course) =>
      course.courseData.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filteredCourses);
  }, [searchTerm]);

  return (
    <>
      <MenubarCustom />
      <div>
        <div className="flex align-items-center justify-content-center mt-4 head-text">
          <span className=" text-6xl course-color">Your groups</span>
        </div>
        <div className="flex align-items-center justify-content-center mt-4">
          <InputText
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-9 h-4rem border-round-lg border-3 text-lg border-green-900"
            placeholder="Find the course"
          />
        </div>
        <div className="grid m-3">
          {filteredData.map((item) => (
            <div className="col-12 col-md-4 w-30rem m-3">
              <CardGroup
                key={item.docId}
                title={item.courseData.title}
                imageUrl={item.courseData.imageUrl}
                id={item.courseData.docId}
                groupId={item.groupId}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default GroupsComponent;
