// Dashboard.js
import React, { useEffect, useState } from "react";
import CourseCard from "./CourseCard";
import { db, auth } from "../config/firebase";
import { Button } from "primereact/button";
import { Accordion, AccordionTab } from "primereact/accordion";
import {
  doc,
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import "./Dashboard.css";

const Dashboard = ({ courses }) => {
  const [movieList, setMovieList] = useState([]);
  const movieCollectionRef = collection(db, "movies");

  //new movie
  const [newMovieTitle, setNewMovieTitle] = useState("");
  const [newReleaseDate, setNeleaseDate] = useState("");
  const [isNewMoviewOscar, setIsNewMovieOscar] = useState(false);

  //update
  const [updateTitle, setUpdatedTitle] = useState("");

  const getMovieList = async () => {
    //read data
    //set the movielist
    try {
      const data = await getDocs(movieCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setMovieList(filteredData);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMovie = async (id) => {
    try {
      const movieDoc = doc(db, "movies", id);
      await deleteDoc(movieDoc);
      getMovieList();
    } catch (err) {
      console.error(err);
    }
  };

  const updateTitleMovie = async (id) => {
    const movieDoc = doc(db, "movies", id);
    await updateDoc(movieDoc, { title: updateTitle });
    getMovieList();
  };

  useEffect(() => {
    getMovieList();
  }, []);
  console.log(movieList);

  const onSubmitMovie = async () => {
    try {
      await addDoc(movieCollectionRef, {
        title: newMovieTitle,
        releaseDate: newReleaseDate,
        receivedAnOscar: isNewMoviewOscar,
        userId: auth?.currentUser?.uid,
      });
      getMovieList();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div>
        <input
          placeholder="Movie title..."
          onChange={(e) => setNewMovieTitle(e.target.value)}
        />

        <input
          placeholder="Release Date..."
          type="number"
          onChange={(e) => setNeleaseDate(Number(e.target.value))}
        />
        <input
          type="checkbox"
          checked={isNewMoviewOscar}
          onChange={(e) => setIsNewMovieOscar(e.target.checked)}
        />
        <label>Received an Oscar</label>
        <button onClick={onSubmitMovie}>Submit</button>
      </div>
      {movieList.map((movie) => (
        <div>
          <h1 className={movie.receivedAnOscar ? "green" : "red"}>
            {movie.title}
          </h1>
          <button
            onClick={() => {
              console.log(movie.id);
              deleteMovie(movie.id);
            }}
          >
            Delete movie{" "}
          </button>
          <input
            placeholder="new title..."
            onChange={(e) => setUpdatedTitle(e.target.value)}
          />
          <button
            onClick={() => {
              updateTitleMovie(movie.id);
            }}
          >
            Update movie{" "}
          </button>
        </div>
      ))}
      {/* <h2>My Courses</h2>
      <div className="course-list">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div> */}

      <Accordion activeIndex={0}>
        <AccordionTab header="Header I">
          <p className="m-0">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </AccordionTab>
        <AccordionTab header="Header II" className=".green">
          <p className="m-0">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
            quae ab illo inventore veritatis et quasi architecto beatae vitae
            dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
            aspernatur aut odit aut fugit, sed quia consequuntur magni dolores
            eos qui ratione voluptatem sequi nesciunt. Consectetur, adipisci
            velit, sed quia non numquam eius modi.
          </p>
        </AccordionTab>
        <AccordionTab header="Header III">
          <p className="m-0">
            At vero eos et accusamus et iusto odio dignissimos ducimus qui
            blanditiis praesentium voluptatum deleniti atque corrupti quos
            dolores et quas molestias excepturi sint occaecati cupiditate non
            provident, similique sunt in culpa qui officia deserunt mollitia
            animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis
            est et expedita distinctio. Nam libero tempore, cum soluta nobis est
            eligendi optio cumque nihil impedit quo minus.
          </p>
        </AccordionTab>
      </Accordion>
    </div>
  );
};

export default Dashboard;
