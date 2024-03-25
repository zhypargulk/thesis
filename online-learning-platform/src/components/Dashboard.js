// import React, { useEffect, useState } from "react";
// import CourseCard from "./CourseCard";
// import { db, auth } from "../config/firebase";
// import { Button } from "primereact/button";
// import { Accordion, AccordionTab } from "primereact/accordion";
// import {
//   doc,
//   getDocs,
//   collection,
//   addDoc,
//   deleteDoc,
//   updateDoc,
// } from "firebase/firestore";
// import "./Dashboard.css";

// const Dashboard = ({ courses }) => {
//   const [movieList, setMovieList] = useState([]);
//   const movieCollectionRef = collection(db, "movies");

//   const [newMovieTitle, setNewMovieTitle] = useState("");
//   const [newReleaseDate, setNeleaseDate] = useState("");
//   const [isNewMoviewOscar, setIsNewMovieOscar] = useState(false);

//   const [updateTitle, setUpdatedTitle] = useState("");

//   const getMovieList = async () => {
//     try {
//       const data = await getDocs(movieCollectionRef);
//       const filteredData = data.docs.map((doc) => ({
//         ...doc.data(),
//         id: doc.id,
//       }));
//       setMovieList(filteredData);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const deleteMovie = async (id) => {
//     try {
//       const movieDoc = doc(db, "movies", id);
//       await deleteDoc(movieDoc);
//       getMovieList();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const updateTitleMovie = async (id) => {
//     const movieDoc = doc(db, "movies", id);
//     await updateDoc(movieDoc, { title: updateTitle });
//     getMovieList();
//   };

//   useEffect(() => {
//     getMovieList();
//   }, []);
//   console.log(movieList);

//   const onSubmitMovie = async () => {
//     try {
//       await addDoc(movieCollectionRef, {
//         title: newMovieTitle,
//         releaseDate: newReleaseDate,
//         receivedAnOscar: isNewMoviewOscar,
//         userId: auth?.currentUser?.uid,
//       });
//       getMovieList();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div>
//       <div>
//         <input
//           placeholder="Movie title..."
//           onChange={(e) => setNewMovieTitle(e.target.value)}
//         />

//         <input
//           placeholder="Release Date..."
//           type="number"
//           onChange={(e) => setNeleaseDate(Number(e.target.value))}
//         />
//         <input
//           type="checkbox"
//           checked={isNewMoviewOscar}
//           onChange={(e) => setIsNewMovieOscar(e.target.checked)}
//         />
//         <label>Received an Oscar</label>
//         <button onClick={onSubmitMovie}>Submit</button>
//       </div>
//       {movieList.map((movie) => (
//         <div>
//           <h1 className={movie.receivedAnOscar ? "green" : "red"}>
//             {movie.title}
//           </h1>
//           <button
//             onClick={() => {
//               deleteMovie(movie.id);
//             }}
//           >
//             Delete movie{" "}
//           </button>
//           <input
//             placeholder="new title..."
//             onChange={(e) => setUpdatedTitle(e.target.value)}
//           />
//           <button
//             onClick={() => {
//               updateTitleMovie(movie.id);
//             }}
//           >
//             Update movie{" "}
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Dashboard;
