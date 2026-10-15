import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext/AuthContext";


const useAuth = () => useContext(AuthContext);
export default useAuth;