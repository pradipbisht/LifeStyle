import { auth, db } from "@/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, Timestamp } from "firebase/firestore";

interface SignUpParams {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "admin" | "user";
  profilePic?: string;
  isVerified?: boolean;
}

async function signUpUser({
  username,
  email,
  password,
  confirmPassword,
  role,
  profilePic,
}: SignUpParams) {
  try {
    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      username,
      email,
      role,
      profilePic: profilePic || "",
      isVerified: false,
      timestamp: Timestamp.now(),
    });

    return {
      success: true,
      user,
      message:
        "Account created! Your account will be verified by an admin before you can log in.",
    };
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
}

export { signUpUser };
