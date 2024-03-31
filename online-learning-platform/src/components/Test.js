///generate demo data base with an algorithm examples
import { auth } from "../config/firebase";
import { updateProfile } from "firebase/auth"; // Import updateProfile
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { createTask, getAllTasks } from "../controller/Tasks";

const Test = () => {
  // const register = async (email, password, name, role) => {
  //   try {
  //     const userCredential = await createUserWithEmailAndPassword(
  //       auth,
  //       email,
  //       password
  //     );

  //     await updateUserProfile(userCredential.user, {
  //       displayName: `${name} - ${role}`,
  //     });

  //     await addUserToFirestore(userCredential.user.uid, {
  //       name,
  //       email,
  //       role: role,
  //     });
  //   } catch (error) {
  //     console.error("Error registering user:", error.message);
  //   }
  // };
  const registerTask = async (user_id, group_id, status, description) => {
    try {
      await createTask(user_id, group_id, status, description);
    } catch (error) {
      console.log("Error registering task:", error.message);
    }
  };
  const getTaskByGroupId = async (group_id) => {
    try {
      const all = await getAllTasks(group_id);
      console.log(all);
    } catch (error) {
      console.log("Error getting task by group_id:", error.message);
    }
  };
  registerTask(
    "R23nchVtfkVr0SboNpivKOfXSCa2", // MIRA
    "4I0cccZYWhjVBOkuvieT", // FIRST GROUP
    "IN PRODUCTION",
    "FINISH THE DOCUMENTATION"
  );
  getTaskByGroupId("jBPaPXfkJPB3vpQWxUlI");
  // register("f4tu6o@inf.elte.hu", "12345678", "Zhypa", "Student");
  // register("", "12345678", "Zhypa", "Teacher");
};

export default Test;
///add course
