import { use, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext/AuthContext";
import { useNavigate } from "react-router";

export default function SocialLogin({ from }) {
  const { googleSignIn } = use(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleGoogleSignIn = async () => {
    setError("");
    try {
      setBusy(true);
      const result = await googleSignIn();
      console.log("Google login success:", result.user.email);
      navigate(from || "/", { replace: true });
    } catch (err) {
      console.error("Google login error:", err.code, err.message);
      setBusy(false);

      if (err.code === "auth/popup-closed-by-user" || err.code === "auth/cancelled-popup-request") {
        setError("Popup was closed. Please try again.");
      } else if (err.code === "auth/popup-blocked") {
        setError("Popup was blocked by the browser. Allow popups and try again.");
      } else if (err.code === "auth/unauthorized-domain") {
        setError("This domain is not authorized in Firebase.");
      } else if (err.code === "auth/operation-not-allowed") {
        setError("Google sign-in is not enabled in Firebase.");
      } else {
        setError(err.code || "Google login failed.");
      }
    }
  };

  return (
    <div>
      <div className="divider">OR</div>
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={busy}
        className="btn w-full border-[#e5e5e5] bg-white text-black"
      >
        <svg
          aria-label="Google logo"
          width="16"
          height="16"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <g>
            <path d="m0 0H512V512H0" fill="#fff"></path>
            <path
              fill="#34a853"
              d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
            ></path>
            <path
              fill="#4285f4"
              d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
            ></path>
            <path
              fill="#fbbc02"
              d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
            ></path>
            <path
              fill="#ea4335"
              d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
            ></path>
          </g>
        </svg>
        {busy ? "Please wait..." : "Login with Google"}
      </button>

      {error && <p className="mt-2 text-sm text-error">{error}</p>}
    </div>
  );
}