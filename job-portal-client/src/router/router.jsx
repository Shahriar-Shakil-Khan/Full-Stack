// সব page এর route এখানে
import { createBrowserRouter } from "react-router";
import RootLayout from "../layout/RootLayout";
import Home from "../pages/Home/Home";
import Register from "../pages/Register/Register";
import SignIn from "../pages/SignIn/SignIn";
import JobDetails from "../pages/JobDetails/JobDetails";
import JobApply from "../pages/JobApply/JobApply";
import PrivateRoute from "../routes/PrivateRoute";
import RoleRoute from "../routes/RoleRoute"; // নতুন: role অনুযায়ী page আটকানো
import MyApplications from "../pages/MyApplications/MyApplications";
import AddJob from "../pages/addJob/AddJob";
import MyPostedJobs from "../pages/MyPostedJobs/MyPostedJobs";
import ViewApplications from "../pages/ViewApplications/ViewApplications";
import UpdateJob from "../pages/Updatejob/Updatejob";
import DashboardHome from "../pages/DashboardHome/DashboardHome"; // নতুন: dashboard (folder এর নাম DashboardHome)

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      // Home page
      {
        index: true,
        Component: Home,
      },
      // Job details page (সবাই দেখতে পারে)
      {
        path: "/jobs/:id",
        Component: JobDetails,
        loader: ({ params }) =>
          fetch(`http://localhost:3000/jobs/${params.id}`),
      },

      // নতুন: Dashboard (login লাগবে, role দেখে নিজেই সঠিক dashboard দেখায়)
      {
        path: "dashboard",
        element: (
          <PrivateRoute>
            <DashboardHome />
          </PrivateRoute>
        ),
      },

      // ---------- শুধু applicant ----------
      // Job এ apply করার page
      {
        path: "/jobApply/:id",
        element: (
          <PrivateRoute>
            <RoleRoute allow={["applicant"]}>
              <JobApply />
            </RoleRoute>
          </PrivateRoute>
        ),
      },
      // আমার করা application গুলো
      {
        path: "myApplications",
        element: (
          <PrivateRoute>
            <RoleRoute allow={["applicant"]}>
              <MyApplications />
            </RoleRoute>
          </PrivateRoute>
        ),
      },

      // ---------- শুধু recruiter ----------
      // নতুন job post করার page
      {
        path: "addJob",
        element: (
          <PrivateRoute>
            <RoleRoute allow={["recruiter"]}>
              <AddJob />
            </RoleRoute>
          </PrivateRoute>
        ),
      },
      // আমার post করা job গুলো
      {
        path: "myPostedJobs",
        element: (
          <PrivateRoute>
            <RoleRoute allow={["recruiter"]}>
              <MyPostedJobs />
            </RoleRoute>
          </PrivateRoute>
        ),
      },
      // একটা job এ কারা apply করেছে (status / shortlist এখানে)
      {
        path: "applications/:job_id",
        element: (
          <PrivateRoute>
            <RoleRoute allow={["recruiter"]}>
              <ViewApplications />
            </RoleRoute>
          </PrivateRoute>
        ),
        loader: ({ params }) =>
          fetch(`http://localhost:3000/applications/jobs/${params.job_id}`),
      },
      // job update করার page
      {
        path: "updateJob/:id",
        element: (
          <PrivateRoute>
            <RoleRoute allow={["recruiter"]}>
              <UpdateJob />
            </RoleRoute>
          </PrivateRoute>
        ),
      },

      // Register page
      {
        path: "/register",
        Component: Register,
      },
      // Sign in page
      {
        path: "/signIn",
        Component: SignIn,
      },
    ],
  },
]);