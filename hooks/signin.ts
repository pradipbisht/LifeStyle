import { auth, db } from "@/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

async function loginUser(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Check isVerified from Firestore database
    const userDoc = await getDoc(doc(db, "users", user.uid));

    if (!userDoc.exists()) {
      await signOut(auth);
      throw new Error("User profile not found. Please contact support.");
    }

    const userData = userDoc.data();

    if (!userData.isVerified) {
      // Sign out the user immediately
      await signOut(auth);
      throw new Error(
        "Your account is not verified yet. Please contact admin for verification."
      );
    }

    return { success: true, user };
  } catch (error: any) {
    console.error("Error signing in:", error);
    throw error;
  }
}

export { loginUser };
