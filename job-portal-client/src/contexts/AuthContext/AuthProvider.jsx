import axios from "axios";
import { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth } from "../../firebase/firebase.config";
import { AuthContext } from "./AuthContext";

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // fail korle loading jate atke na thake
  const withLoading = async (fn) => {
    setLoading(true);
    try {
      return await fn();
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const createUser = (email, password) =>
    withLoading(() => createUserWithEmailAndPassword(auth, email, password));

  const signIn = (email, password) =>
    withLoading(() => signInWithEmailAndPassword(auth, email, password));

  const googleSignIn = () =>
    withLoading(() => signInWithPopup(auth, googleProvider));

  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  useEffect(() => {
    // async: JWT cookie set hoye gele tarpor user/loading update korbo
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser?.email) {
        const userData = { email: currentUser.email };
        try {
          // await: cookie set na howa porjonto wait kore
          const res = await axios.post("http://localhost:3000/jwt", userData, {
            withCredentials: true,
          });
          console.log("JWT token:", res.data);
        } catch (error) {
          console.log(error);
        }
      }

      // cookie ready howar por page ke jante dai user ache
      setUser(currentUser);
      setLoading(false);
      console.log("Auth state changed:", currentUser);
    });
    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    loading,
    createUser,
    signIn,
    googleSignIn,
    logOut,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;