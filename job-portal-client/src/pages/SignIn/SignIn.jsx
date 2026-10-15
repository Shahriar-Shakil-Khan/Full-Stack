import { use, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { AuthContext } from "../../contexts/AuthContext/AuthContext";
import SocialLogin from "../shared/socialLogin";

export default function SignIn() {
  const { signIn } = use(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // protected page theke ashle oi page e, na hole home e
  const from = location.state?.from?.pathname || "/";

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");

    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
      setSubmitting(true);
      await signIn(email, password);
      form.reset();
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setError("Invalid email or password. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content w-full flex-col">
        <div className="card w-full max-w-sm shrink-0 bg-base-100 shadow-2xl">
          <div className="card-body">
            <h1 className="text-center text-4xl font-bold">Sign In</h1>

            <form onSubmit={handleSignIn}>
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

                <div>
                  <a className="link link-hover">Forgot password?</a>
                </div>

                {error && <p className="text-sm text-error">{error}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-neutral mt-4"
                >
                  {submitting ? "Signing in..." : "Sign In"}
                </button>
              </fieldset>
            </form>

            <SocialLogin from={from} />

            <p className="mt-2 text-center text-sm">
              New here?{" "}
              <Link to="/register" className="link link-primary">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}