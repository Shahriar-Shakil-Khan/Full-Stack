import { use, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { AuthContext } from "../../contexts/AuthContext/AuthContext";
import SocialLogin from "../shared/socialLogin";

export default function Register() {
  const { createUser } = use(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from?.pathname || "/";

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
      setSubmitting(true);
      await createUser(email, password);
      form.reset();
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setError(
        err.code === "auth/email-already-in-use"
          ? "This email is already registered."
          : err.code === "auth/weak-password"
          ? "Password must be at least 6 characters."
          : "Registration failed. Please try again."
      );
      setSubmitting(false);
    }
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content w-full flex-col">
        <div className="card w-full max-w-sm shrink-0 bg-base-100 shadow-2xl">
          <div className="card-body">
            <h1 className="text-center text-4xl font-bold">Register now!</h1>

            <form onSubmit={handleRegister}>
              <fieldset className="fieldset">
                <label className="label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="input w-full"
                  placeholder="Email"
                  required
                />

                <label className="label">Password</label>
                <input
                  type="password"
                  name="password"
                  className="input w-full"
                  placeholder="Password"
                  required
                />

                {error && <p className="text-sm text-error">{error}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-neutral mt-4"
                >
                  {submitting ? "Creating..." : "Register"}
                </button>
              </fieldset>
            </form>

            <SocialLogin from={from} />

            <p className="mt-2 text-center text-sm">
              Already have an account?{" "}
              <Link to="/signIn" className="link link-primary">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}