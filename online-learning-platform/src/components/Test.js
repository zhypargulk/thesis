///generate demo data base with an algorithm examples
import { auth } from "../config/firebase";
import { updateProfile } from "firebase/auth"; // Import updateProfile
import { getFirestore, doc, setDoc } from "firebase/firestore";

const Test = () => {
  const register = async (email, password, name, role) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateUserProfile(userCredential.user, {
        displayName: `${name} - ${role}`,
      });

      await addUserToFirestore(userCredential.user.uid, {
        name,
        email,
        role: role,
      });
    } catch (error) {
      console.error("Error registering user:", error.message);
    }
  };

  register("f4tu6o@inf.elte.hu", "12345678", "Zhypa", "Student");
  register("", "12345678", "Zhypa", "Teacher");
};

export default Test;
///add course
