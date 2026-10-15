// নির্দিষ্ট role ছাড়া কেউ page এ ঢুকতে পারবে না।
// src/routes/ folder এ রাখবে (PrivateRoute.jsx এর পাশে)।
// ব্যবহার: <PrivateRoute><RoleRoute allow={["recruiter"]}><AddJob /></RoleRoute></PrivateRoute>
import { Link } from "react-router";
import useRole from "../hooks/useRole";

export default function RoleRoute({ allow, children }) {
  const { role, roleLoading } = useRole();

  // role লোড হচ্ছে
  if (roleLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // role মিললে page দেখাই
  if (allow.includes(role)) {
    return children;
  }

  // role না মিললে কারণ বলে dashboard এ পাঠাই
  const reason =
    role === "pending"
      ? "Your account is waiting for admin approval."
      : role === "blocked"
      ? "Your account has been blocked by the admin."
      : "This page is not available for your account type.";

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <h2 className="text-2xl font-bold text-gray-900">You can not open this page</h2>
      <p className="mt-2 text-gray-600">{reason}</p>
      <Link
        to="/dashboard"
        className="mt-6 inline-block rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
      >
        Go to dashboard
      </Link>
    </div>
  );
}