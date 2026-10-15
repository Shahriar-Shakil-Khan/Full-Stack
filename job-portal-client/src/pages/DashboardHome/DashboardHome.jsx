// /dashboard page। role দেখে সঠিক dashboard দেখায়।
// এই file আর নিচের ৩টা dashboard file একই folder এ রাখবে (যেমন src/pages/Dashboard/)।
import useAuth from "../../hooks/useAuth";
import useRole, { clearRoleCache } from "../../hooks/useRole";
import AdminDashboard from "./AdminDashboard";
import RecruterDashboard from "./RecruterDashboard";
import ApplicantDashboard from "./ApplicantDashboard";

export default function DashboardHome() {
  const { user } = useAuth();
  const { role, roleLoading } = useRole();

  // role লোড হচ্ছে
  if (roleLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // role অনুযায়ী dashboard
  if (role === "admin") return <AdminDashboard />;
  if (role === "recruiter") return <RecruterDashboard />;
  if (role === "applicant") return <ApplicantDashboard />;

  // blocked হলে
  if (role === "blocked") {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-rose-600">Account blocked</h2>
        <p className="mt-2 text-gray-600">
          Your account has been blocked by the admin. Please contact the admin.
        </p>
      </div>
    );
  }

  // pending হলে (বা role আনা না গেলে) অপেক্ষার message
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <h2 className="text-2xl font-bold text-gray-900">Waiting for approval</h2>
      <p className="mt-2 text-gray-600">
        Your account has been created. An admin will approve it and set you as
        an applicant or a recruiter soon.
      </p>
      <button
        type="button"
        onClick={() => {
          // cache মুছে আবার role আনি
          clearRoleCache(user?.email);
          window.location.reload();
        }}
        className="mt-6 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
      >
        Check again
      </button>
    </div>
  );
}