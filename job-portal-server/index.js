// // ---------- দরকারি প্যাকেজগুলো import ----------
// const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// const dns = require("dns");
// dns.setServers(["8.8.8.8", "8.8.4.4"]);
// const express = require("express");
// const cors = require("cors");
// const jwt = require("jsonwebtoken");
// const cookieParser = require("cookie-parser");
// const nodemailer = require("nodemailer"); // ইমেইল পাঠানোর জন্য
// require("dotenv").config({ quiet: true }); // transporter বানানোর আগেই .env লোড হতে হবে

// const app = express();
// const port = process.env.PORT || 3000;

// // ---------- Middleware: frontend থেকে request আর JSON data নেওয়ার জন্য ----------
// app.use(cors({
//   origin: ['http://localhost:5173'], // সব domain থেকে request নিতে পারবে
//   credentials: true, // cookie/authorization header নিতে পারবে
// }));
// app.use(express.json());
// app.use(cookieParser());

// const { initializeApp, cert } = require("firebase-admin/app");
// const { getAuth } = require("firebase-admin/auth");
// const serviceAccount = require("./firebase-admin-key.json");

// // Firebase Admin ekbar-i initialize hobe
// initializeApp({
//   credential: cert(serviceAccount),
// });

// // request ashar shomoy ta rekhe rakhe
// const logger = (req, res, next) => {
//   req.requestTime = new Date();
//   next();
// };

// // Cookie er JWT token verify kore
// const verifyJWT = (req, res, next) => {
//   const token = req?.cookies?.token;
//   console.log("Middleware - Cookies:", token);
//   if (!token) {
//     return res.status(401).send({ message: "Unauthorized" });
//   }

//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
//     if (err) {
//       return res.status(401).send({ message: "Unauthorized" });
//     }
//     req.decoded = decoded;

//     next();
//   });
// };

// // Header er Firebase token verify kore: Authorization: Bearer <token>
// const verifyFirebaseToken = async (req, res, next) => {
//   const authHeader = req.headers?.authorization;

//   // header na thakle ba "Bearer " diye shuru na hole
//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).send({ message: "Unauthorized" });
//   }

//   const token = authHeader.split(" ")[1]; // "Bearer <token>" theke token

//   try {
//     const userInfo = await getAuth().verifyIdToken(token);
//     console.log("Middleware - Firebase UserInfo:", userInfo.email);
//      console.log("UID:", userInfo.uid);
//     console.log("Email:", userInfo.email);
//     console.log("Email verified:", userInfo.email_verified);
//     console.log("Login time (auth_time):", new Date(userInfo.auth_time * 1000).toLocaleString());
//     console.log("Token issued (iat):", new Date(userInfo.iat * 1000).toLocaleString());
//     console.log("Token expires (exp):", new Date(userInfo.exp * 1000).toLocaleString());

//     // verifyJWT er moto req.decoded.userData.email diye-o kaj korbe
//     req.decoded = { ...userInfo, userData: { email: userInfo.email } };

//     next(); // age ei line chilo na, tai request atke jeto
//   } catch (error) {
//     return res.status(401).send({ message: "Unauthorized" });
//   }
// };

// const verifyEmailToken = async (req, res, next) => {
//   if(req.query.email!==req.decoded.email){
//     return res.status(403).send({ message: "Forbidden access" });
//   }
// }



// // ---------- ইমেইল পাঠানোর setup (Gmail দিয়ে) ----------
// // App Password এর মাঝে space থাকলে সেটা মুছে দিই, না হলে Gmail login fail করে
// const emailUser = process.env.EMAIL_USER;
// const emailPass = (process.env.EMAIL_PASS || "").replace(/\s/g, "");

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: { user: emailUser, pass: emailPass },
// });

// // server চালু হলেই Gmail setup ঠিক আছে কিনা console এ দেখাবে (server বন্ধ করবে না)
// transporter.verify((error) => {
//   if (error) {
//     console.log("EMAIL SETUP ERROR:", error.message);
//   } else {
//     console.log("Email setup ঠিক আছে ✅");
//   }
// });

// // ---------- status অনুযায়ী ইমেইলের subject আর message ----------
// const getEmailContent = (status, name, jobTitle, company) => {
//   const messages = {
//     // pending হলে
//     pending: {
//       subject: `Your application is under review - ${jobTitle}`,
//       text: `Hi ${name},\n\nThank you for applying for ${jobTitle} at ${company}. Your application is currently under review. We will update you soon.\n\nBest regards,\n${company}`,
//     },
//     // shortlist করলে
//     shortlisted: {
//       subject: `You have been shortlisted - ${jobTitle}`,
//       text: `Hi ${name},\n\nGood news! You have been shortlisted for the ${jobTitle} position at ${company}. We will contact you soon with the next steps.\n\nBest regards,\n${company}`,
//     },
//     // interview এর জন্য ডাকলে
//     interview: {
//       subject: `Interview invitation - ${jobTitle}`,
//       text: `Hi ${name},\n\nGood news! You have been shortlisted for an interview for the ${jobTitle} position at ${company}. We will contact you shortly with the interview schedule.\n\nBest regards,\n${company}`,
//     },
//     // চাকরি হয়ে গেলে
//     hired: {
//       subject: `Congratulations! You are hired - ${jobTitle}`,
//       text: `Hi ${name},\n\nCongratulations! We are happy to inform you that you have been selected for the ${jobTitle} position at ${company}. We will contact you soon with the next steps.\n\nBest regards,\n${company}`,
//     },
//     // বাতিল হলে
//     rejected: {
//       subject: `Update on your application - ${jobTitle}`,
//       text: `Hi ${name},\n\nThank you for your interest in the ${jobTitle} position at ${company}. After careful consideration, we have decided not to move forward with your application. We wish you all the best for your future.\n\nBest regards,\n${company}`,
//     },
//   };
//   return messages[status];
// };

// // ---------- MongoDB connection ----------
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0jj0hhq.mongodb.net/?appName=Cluster0`;

// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
//   serverSelectionTimeoutMS: 5000,
// });

// async function run() {
//   console.log("Connect to MongoDB");
//   try {
//     await client.connect();
//     await client.db("admin").command({ ping: 1 });
//     console.log(
//       "Pinged your deployment. You successfully connected to MongoDB!",
//     );

//     // ---------- দুইটা collection: jobs আর applications ----------
//     const jobsCollection = client.db("carrerCode").collection("jobs");
//     const applicationsCollection = client
//       .db("carrerCode")
//       .collection("applications");

//     // ---------- তৃতীয় collection: users (প্রতিজনের role রাখার জন্য) ----------
//     const usersCollection = client.db("carrerCode").collection("users");

//     // একই email দুইবার যাতে save না হয়
//     try {
//       await usersCollection.createIndex({ email: 1 }, { unique: true });
//     } catch (indexError) {
//       console.log("INDEX WARNING:", indexError.message);
//     }

//     // email দিয়ে একজন user এর role বের করে দেয় (না পেলে null)
//     const getRole = async (email) => {
//       if (!email) return null;
//       const user = await usersCollection.findOne({ email });
//       return user ? user.role : null;
//     };

//     //JWT token generate করার জন্য route
//     app.post("/jwt", async (req, res) => {
//       const userData = req.body;
//       const token = jwt.sign({ userData }, process.env.ACCESS_TOKEN_SECRET, {
//         expiresIn: "1h",
//       });
//       res.cookie('token', token, { 
//         httpOnly: true, 
//         secure: false, // HTTPS হলে true করা উচিত
//         maxAge: 3600000 }); // 1 hour
//       res.send({ success: true});
//     });
//     // ---------- GET /jobs ----------
//     // সব job আনে। ?email=... দিলে শুধু ওই HR এর job আনে।
//     // প্রতিটা job এর সাথে "applicationCount" (কয়জন apply করেছে) জুড়ে দেয়।
//     app.get("/jobs", verifyFirebaseToken , async (req, res) => {
//       try {
//         const email = req.query.email;
//         let query = {};
//         if (email) {
//           query = { hr_email: email };
//         }

//         const jobs = await jobsCollection.find(query).toArray();

//         // প্রতিটা job এর জন্য application গুনি
//         const result = [];
//         for (const job of jobs) {
//           const applicationCount = await applicationsCollection.countDocuments({
//             jobId: { $in: [job._id, job._id.toString()] },
//           });
//           result.push({ ...job, applicationCount });
//         }

//         res.send(result);
//       } catch (error) {
//         res.status(500).send({ error: error.message });
//       }
//     });

//     // ---------- GET /jobs/:id ----------
//     // একটা job এর details আনে
//     app.get("/jobs/:id", async (req, res) => {
//       try {
//         const id = req.params.id;
//         // id ভুল হলে server crash না করে error পাঠাই
//         if (!ObjectId.isValid(id)) {
//           return res.status(400).send({ error: "Invalid job id" });
//         }
//         const result = await jobsCollection.findOne({ _id: new ObjectId(id) });
//         // job না পেলে খালি object পাঠাই (frontend এর JSON parse যাতে না ভাঙে)
//         res.send(result || {});
//       } catch (error) {
//         res.status(500).send({ error: error.message });
//       }
//     });

//     // ---------- POST /jobs ----------
//     // নতুন job save করে (AddJob form থেকে)
//     app.post("/jobs", async (req, res) => {
//       try {
//         const newJob = req.body;

//         // শুধু approved recruiter job post করতে পারবে
//         const hrRole = await getRole(newJob.hr_email);
//         if (hrRole !== "recruiter") {
//           return res
//             .status(403)
//             .send({ error: "Only approved recruiters can post jobs" });
//         }

//         const result = await jobsCollection.insertOne(newJob);
//         res.send(result);
//       } catch (error) {
//         res.status(500).send({ error: error.message });
//       }
//     });

//     // ---------- PUT /jobs/:id ----------
//     // job এর তথ্য update করে (UpdateJob form থেকে)
//     app.put("/jobs/:id", async (req, res) => {
//       try {
//         const id = req.params.id;
//         if (!ObjectId.isValid(id)) {
//           return res.status(400).send({ error: "Invalid job id" });
//         }

//         // _id আর applicationCount database এ save করার জিনিস না, তাই বাদ দিই
//         const updatedJob = { ...req.body };
//         delete updatedJob._id;
//         delete updatedJob.applicationCount;

//         const result = await jobsCollection.updateOne(
//           { _id: new ObjectId(id) },
//           { $set: updatedJob },
//         );
//         res.send(result);
//       } catch (error) {
//         res.status(500).send({ error: error.message });
//       }
//     });

//     // ---------- DELETE /jobs/:id ----------
//     // job মুছে ফেলে, সাথে ওই job এর সব application ও মুছে দেয়
//     app.delete("/jobs/:id", async (req, res) => {
//       try {
//         const id = req.params.id;
//         if (!ObjectId.isValid(id)) {
//           return res.status(400).send({ error: "Invalid job id" });
//         }

//         const result = await jobsCollection.deleteOne({
//           _id: new ObjectId(id),
//         });

//         // job না থাকলে তার application রেখে লাভ নেই
//         await applicationsCollection.deleteMany({
//           jobId: { $in: [new ObjectId(id), id] },
//         });

//         res.send(result);
//       } catch (error) {
//         res.status(500).send({ error: error.message });
//       }
//     });

//     // ---------- POST /applications ----------
//     // কেউ apply করলে save করে। শুরুতে status থাকে "pending"।
//     app.post("/applications", async (req, res) => {
//       try {
//         console.log("Cookies:", req.cookies);
//         if (!ObjectId.isValid(req.body.jobId)) {
//           return res.status(400).send({ error: "Invalid job id" });
//         }

//         // শুধু approved applicant apply করতে পারবে
//         const applicantRole = await getRole(req.body.applicant_email);
//         if (applicantRole !== "applicant") {
//           return res
//             .status(403)
//             .send({ error: "Only approved applicants can apply" });
//         }
//         const application = {
//           ...req.body,
//           jobId: new ObjectId(req.body.jobId),
//           status: "pending",
//         };
//         const result = await applicationsCollection.insertOne(application);
//         res.send(result);
//       } catch (error) {
//         res.status(500).send({ error: error.message });
//       }
//     });

//     // ---------- GET /applications/jobs/:job_id ----------
//     // একটা job এ যারা apply করেছে তাদের list (ViewApplications page এর জন্য)
//     app.get("/applications/jobs/:job_id", async (req, res) => {
//       try {
//         const jobId = req.params.job_id;
//         const query = { jobId: { $in: [new ObjectId(jobId), jobId] } };
//         const result = await applicationsCollection.find(query).toArray();
//         res.send(result);
//       } catch (error) {
//         res.status(500).send({ error: error.message });
//       }
//     });

//     // ---------- PATCH /applications/:id/status ----------
//     // HR status বদলালে (pending/interview/hired/rejected) database এ save হয়
//     // আর applicant কে ইমেইল যায়
//     app.patch("/applications/:id/status", async (req, res) => {
//       try {
//         const id = req.params.id;
//         const status = String(req.body.status || "")
//           .toLowerCase()
//           .trim();

//         // শুধু এই ৪টা status চলবে
//         const allowed = [
//           "pending",
//           "shortlisted",
//           "interview",
//           "hired",
//           "rejected",
//         ];
//         if (!allowed.includes(status)) {
//           return res
//             .status(400)
//             .send({ success: false, error: "Invalid status" });
//         }
//         if (!ObjectId.isValid(id)) {
//           return res
//             .status(400)
//             .send({ success: false, error: "Invalid application id" });
//         }

//         // application টা খুঁজি
//         const application = await applicationsCollection.findOne({
//           _id: new ObjectId(id),
//         });
//         if (!application) {
//           return res
//             .status(404)
//             .send({ success: false, error: "Application not found" });
//         }

//         // database এ নতুন status save করি
//         await applicationsCollection.updateOne(
//           { _id: new ObjectId(id) },
//           { $set: { status: status } },
//         );

//         // ইমেইলে দেখানোর জন্য job এর title আর company নাম আনি
//         let job = null;
//         if (ObjectId.isValid(application.jobId)) {
//           job = await jobsCollection.findOne({
//             _id: new ObjectId(application.jobId),
//           });
//         }
//         const jobTitle = job?.title || "the job";
//         const company = job?.company || "our company";

//         // applicant এর email: যে field এ "@" আছে সেটাই নিই
//         const emailCandidates = [
//           application.applicant_email,
//           application.applicant,
//           application.email,
//         ];
//         const applicantEmail = emailCandidates.find(
//           (value) => typeof value === "string" && value.includes("@"),
//         );
//         const applicantName =
//           application.applicant_name || application.name || "Applicant";

//         // ইমেইল পাঠাই। fail করলেও status save থাকবে।
//         let emailSent = false;
//         let emailError = "";

//         if (!applicantEmail) {
//           emailError = "Applicant email not found";
//         } else {
//           try {
//             const content = getEmailContent(
//               status,
//               applicantName,
//               jobTitle,
//               company,
//             );
//             await transporter.sendMail({
//               from: `"${company}" <${emailUser}>`,
//               to: applicantEmail,
//               subject: content.subject,
//               text: content.text,
//             });
//             emailSent = true;
//           } catch (mailError) {
//             emailError = mailError.message;
//             console.log("EMAIL ERROR:", mailError.message);
//           }
//         }

//         // frontend কে জানাই: কাজ হয়েছে কিনা, ইমেইল গেছে কিনা
//         res.send({ success: true, status, emailSent, emailError });
//       } catch (error) {
//         res.status(500).send({ success: false, error: error.message });
//       }
//     });

//     // ---------- GET /applications ----------
//     // MyApplications page এর জন্য। ?email=... দিলে শুধু ওই user এর application।
//     // প্রতিটা application এর সাথে job এর details জুড়ে দেয়।
//  app.get("/applications", logger, verifyFirebaseToken, async (req, res) => {  //verifyJWT
//   try {
//     if (req.query.email !== req.decoded.userData.email) {
//       return res.status(403).send({ message: "Forbidden access" });
//     }

//     const filter = {};
//     if (req.query.email) filter.applicant_email = req.query.email;
//     if (req.query.jobId) {
//       // DB তে jobId ObjectId হিসেবে থাকে, তাই ObjectId আর string দুইভাবেই খুঁজি
//       filter.jobId = ObjectId.isValid(req.query.jobId)
//         ? { $in: [new ObjectId(req.query.jobId), req.query.jobId] }
//         : req.query.jobId;
//     }

//     const applications = await applicationsCollection
//       .find(filter)
//       .toArray();

//     const applicationsWithJob = await Promise.all(
//       applications.map(async (application) => {
//         let jobDetails = null;

//         if (ObjectId.isValid(application.jobId)) {
//           jobDetails = await jobsCollection.findOne({
//             _id: new ObjectId(application.jobId),
//           });
//         }

//         return { ...application, job: jobDetails };
//       }),
//     );

//     res.send(applicationsWithJob);
//   } catch (error) {
//     res.status(500).send({ error: error.message });
//   }
// });

//     // =====================================================================
//     //                    Role system এর নতুন route গুলো
//     // =====================================================================

//     // ---------- GET /users/role/:email ----------
//     // login করা user এর role দেয়। user প্রথমবার এলে users collection এ "pending" দিয়ে save হয়।
//     // .env এর ADMIN_EMAIL এর সাথে মিললে সে সবসময় "admin"।
//     app.get("/users/role/:email", async (req, res) => {
//       try {
//         const email = req.params.email;
//         const isAdminEmail =
//           email.toLowerCase() === (process.env.ADMIN_EMAIL || "").toLowerCase();

//         // না থাকলে নতুন user বানাই (থাকলে কিছু বদলায় না)
//         try {
//           await usersCollection.updateOne(
//             { email },
//             {
//               $setOnInsert: {
//                 role: isAdminEmail ? "admin" : "pending",
//                 createdAt: new Date(),
//               },
//             },
//             { upsert: true },
//           );
//         } catch (insertError) {
//           // একসাথে দুইটা request এলে duplicate error আসতে পারে, সেটা ignore করি
//         }

//         const user = await usersCollection.findOne({ email });
//         if (!user) {
//           return res.status(500).send({ error: "Could not load user" });
//         }

//         // ADMIN_EMAIL হলে role সবসময় admin রাখি
//         if (isAdminEmail && user.role !== "admin") {
//           await usersCollection.updateOne(
//             { email },
//             { $set: { role: "admin" } },
//           );
//           user.role = "admin";
//         }

//         res.send({ role: user.role });
//       } catch (error) {
//         res.status(500).send({ error: error.message });
//       }
//     });

//     // ---------- GET /users?adminEmail=... ----------
//     // সব user এর list (শুধু admin দেখতে পারবে)
//     app.get("/users", async (req, res) => {
//       try {
//         if ((await getRole(req.query.adminEmail)) !== "admin") {
//           return res.status(403).send({ error: "Only admin can see users" });
//         }
//         const users = await usersCollection
//           .find()
//           .sort({ createdAt: -1 })
//           .toArray();
//         res.send(users);
//       } catch (error) {
//         res.status(500).send({ error: error.message });
//       }
//     });

//     // ---------- PATCH /users/:id/role ----------
//     // admin কাউকে applicant / recruiter বানায় বা block করে
//     app.patch("/users/:id/role", async (req, res) => {
//       try {
//         const { role, adminEmail } = req.body;

//         if ((await getRole(adminEmail)) !== "admin") {
//           return res.status(403).send({ error: "Only admin can change roles" });
//         }

//         const allowedRoles = ["pending", "applicant", "recruiter", "blocked"];
//         if (!allowedRoles.includes(role)) {
//           return res.status(400).send({ error: "Invalid role" });
//         }
//         if (!ObjectId.isValid(req.params.id)) {
//           return res.status(400).send({ error: "Invalid user id" });
//         }

//         const target = await usersCollection.findOne({
//           _id: new ObjectId(req.params.id),
//         });
//         if (!target) {
//           return res.status(404).send({ error: "User not found" });
//         }
//         // admin এর role বদলানো যাবে না
//         if (target.role === "admin") {
//           return res
//             .status(403)
//             .send({ error: "Admin role can not be changed" });
//         }

//         await usersCollection.updateOne(
//           { _id: new ObjectId(req.params.id) },
//           { $set: { role: role } },
//         );
//         res.send({ success: true, role });
//       } catch (error) {
//         res.status(500).send({ error: error.message });
//       }
//     });

//     // ---------- GET /admin/stats?adminEmail=... ----------
//     // admin dashboard এর মোট সংখ্যা
//     app.get("/admin/stats", async (req, res) => {
//       try {
//         if ((await getRole(req.query.adminEmail)) !== "admin") {
//           return res.status(403).send({ error: "Only admin allowed" });
//         }
//         const [users, jobs, applications] = await Promise.all([
//           usersCollection.countDocuments(),
//           jobsCollection.countDocuments(),
//           applicationsCollection.countDocuments(),
//         ]);
//         res.send({ users, jobs, applications });
//       } catch (error) {
//         res.status(500).send({ error: error.message });
//       }
//     });

//     // ---------- GET /recruiter/stats?email=... ----------
//     // recruiter dashboard এর সংখ্যা: কয়টা job, কয়জন apply, কোন status এ কয়জন
//     app.get("/recruiter/stats", async (req, res) => {
//       try {
//         const email = req.query.email;
//         const jobs = await jobsCollection.find({ hr_email: email }).toArray();

//         // jobId কখনো ObjectId কখনো string থাকতে পারে, তাই দুইভাবেই খুঁজি
//         const jobIds = jobs.map((job) => job._id);
//         const allIds = [...jobIds, ...jobIds.map((id) => id.toString())];
//         const applications = await applicationsCollection
//           .find({ jobId: { $in: allIds } })
//           .toArray();

//         const byStatus = {
//           pending: 0,
//           shortlisted: 0,
//           interview: 0,
//           hired: 0,
//           rejected: 0,
//         };
//         applications.forEach((application) => {
//           const status = application.status || "pending";
//           if (byStatus[status] !== undefined) byStatus[status]++;
//         });

//         res.send({
//           totalJobs: jobs.length,
//           totalApplications: applications.length,
//           byStatus,
//         });
//       } catch (error) {
//         res.status(500).send({ error: error.message });
//       }
//     });

//     // ---------- DELETE /applications/:id?email=... ----------
//     // applicant নিজের apply undo (withdraw) করে। শুধু নিজেরটা, আর hired হলে না।
//     app.delete("/applications/:id", async (req, res) => {
//       try {
//         const id = req.params.id;
//         const email = req.query.email;

//         if (!ObjectId.isValid(id)) {
//           return res.status(400).send({ error: "Invalid application id" });
//         }

//         const application = await applicationsCollection.findOne({
//           _id: new ObjectId(id),
//         });
//         if (!application) {
//           return res.status(404).send({ error: "Application not found" });
//         }
//         if (application.applicant_email !== email) {
//           return res
//             .status(403)
//             .send({ error: "You can only withdraw your own application" });
//         }
//         if (application.status === "hired") {
//           return res
//             .status(400)
//             .send({ error: "A hired application can not be withdrawn" });
//         }

//         const result = await applicationsCollection.deleteOne({
//           _id: new ObjectId(id),
//         });
//         res.send(result);
//       } catch (error) {
//         res.status(500).send({ error: error.message });
//       }
//     });
//   } catch (err) {
//     console.log("CONNECTION FAILED:", err.message);
//   }
// }
// run();

// // ---------- Server চলছে কিনা check করার route ----------
// app.get("/", (req, res) => {
//   res.send("Career Server is running");
// });

// // ---------- MongoDB connect আছে কিনা check করার route ----------
// app.get("/ping", async (req, res) => {
//   try {
//     await client.db("admin").command({ ping: 1 });
//     res.send("MongoDB connected ✅");
//   } catch (err) {
//     res.status(500).send("MongoDB not connected ❌ " + err.message);
//   }
// });

// // ---------- Server start ----------
// app.listen(port, () => {
//   console.log(`Career Server listening on port ${port}`);
// });




// ---------- দরকারি প্যাকেজগুলো import ----------
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const nodemailer = require("nodemailer"); // ইমেইল পাঠানোর জন্য
require("dotenv").config({ quiet: true }); // transporter বানানোর আগেই .env লোড হতে হবে

const app = express();
const port = process.env.PORT || 3000;

// ---------- Middleware: frontend থেকে request আর JSON data নেওয়ার জন্য ----------
app.use(cors({
  origin: ['http://localhost:5173', process.env.FRONTEND_URL].filter(Boolean), // localhost + deploy করা frontend URL
  credentials: true, // cookie/authorization header নিতে পারবে
}));
app.use(express.json());
app.use(cookieParser());

// Vercel এ server প্রথমবার চালু হলে MongoDB connect হয়ে route তৈরি হওয়ার আগেই request চলে আসতে পারে।
// তাই প্রতিটা request আগে অপেক্ষা করে যতক্ষণ না run() শেষ হয়।
let dbReady = Promise.resolve();
app.use(async (req, res, next) => {
  await dbReady;
  next();
});

const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
// Vercel এ key file যায় না, তাই FIREBASE_SERVICE_ACCOUNT env variable থাকলে সেটা থেকে নিই।
// না থাকলে (নিজের computer এ) আগের মতো file থেকেই নিই।
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : require("./firebase-admin-key.json");

// Firebase Admin ekbar-i initialize hobe
initializeApp({
  credential: cert(serviceAccount),
});

// request ashar shomoy ta rekhe rakhe
const logger = (req, res, next) => {
  req.requestTime = new Date();
  next();
};

// Cookie er JWT token verify kore
const verifyJWT = (req, res, next) => {
  const token = req?.cookies?.token;
  console.log("Middleware - Cookies:", token);
  if (!token) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized" });
    }
    req.decoded = decoded;

    next();
  });
};

// Header er Firebase token verify kore: Authorization: Bearer <token>
const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers?.authorization;

  // header na thakle ba "Bearer " diye shuru na hole
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1]; // "Bearer <token>" theke token

  try {
    const userInfo = await getAuth().verifyIdToken(token);
    console.log("Middleware - Firebase UserInfo:", userInfo.email);
     console.log("UID:", userInfo.uid);
    console.log("Email:", userInfo.email);
    console.log("Email verified:", userInfo.email_verified);
    console.log("Login time (auth_time):", new Date(userInfo.auth_time * 1000).toLocaleString());
    console.log("Token issued (iat):", new Date(userInfo.iat * 1000).toLocaleString());
    console.log("Token expires (exp):", new Date(userInfo.exp * 1000).toLocaleString());

    // verifyJWT er moto req.decoded.userData.email diye-o kaj korbe
    req.decoded = { ...userInfo, userData: { email: userInfo.email } };

    next(); // age ei line chilo na, tai request atke jeto
  } catch (error) {
    return res.status(401).send({ message: "Unauthorized" });
  }
};

// NOTUN: /jobs er jonno. ?email na thakle shobai dekhte pabe (Home page).
// ?email thakle token lagbe, ar token er email er sathe mile jete hobe.
const optionalFirebaseAuth = (req, res, next) => {
  if (!req.query.email) return next();

  return verifyFirebaseToken(req, res, () => {
    if (req.query.email !== req.decoded.userData.email) {
      return res.status(403).send({ message: "Forbidden access" });
    }
    next();
  });
};

const verifyEmailToken = async (req, res, next) => {
  if(req.query.email!==req.decoded.email){
    return res.status(403).send({ message: "Forbidden access" });
  }
}



// ---------- ইমেইল পাঠানোর setup (Gmail দিয়ে) ----------
// App Password এর মাঝে space থাকলে সেটা মুছে দিই, না হলে Gmail login fail করে
const emailUser = process.env.EMAIL_USER;
const emailPass = (process.env.EMAIL_PASS || "").replace(/\s/g, "");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: emailUser, pass: emailPass },
});

// server চালু হলেই Gmail setup ঠিক আছে কিনা console এ দেখাবে (server বন্ধ করবে না)
transporter.verify((error) => {
  if (error) {
    console.log("EMAIL SETUP ERROR:", error.message);
  } else {
    console.log("Email setup ঠিক আছে ✅");
  }
});

// ---------- status অনুযায়ী ইমেইলের subject আর message ----------
const getEmailContent = (status, name, jobTitle, company) => {
  const messages = {
    // pending হলে
    pending: {
      subject: `Your application is under review - ${jobTitle}`,
      text: `Hi ${name},\n\nThank you for applying for ${jobTitle} at ${company}. Your application is currently under review. We will update you soon.\n\nBest regards,\n${company}`,
    },
    // shortlist করলে
    shortlisted: {
      subject: `You have been shortlisted - ${jobTitle}`,
      text: `Hi ${name},\n\nGood news! You have been shortlisted for the ${jobTitle} position at ${company}. We will contact you soon with the next steps.\n\nBest regards,\n${company}`,
    },
    // interview এর জন্য ডাকলে
    interview: {
      subject: `Interview invitation - ${jobTitle}`,
      text: `Hi ${name},\n\nGood news! You have been shortlisted for an interview for the ${jobTitle} position at ${company}. We will contact you shortly with the interview schedule.\n\nBest regards,\n${company}`,
    },
    // চাকরি হয়ে গেলে
    hired: {
      subject: `Congratulations! You are hired - ${jobTitle}`,
      text: `Hi ${name},\n\nCongratulations! We are happy to inform you that you have been selected for the ${jobTitle} position at ${company}. We will contact you soon with the next steps.\n\nBest regards,\n${company}`,
    },
    // বাতিল হলে
    rejected: {
      subject: `Update on your application - ${jobTitle}`,
      text: `Hi ${name},\n\nThank you for your interest in the ${jobTitle} position at ${company}. After careful consideration, we have decided not to move forward with your application. We wish you all the best for your future.\n\nBest regards,\n${company}`,
    },
  };
  return messages[status];
};

// ---------- MongoDB connection ----------
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0jj0hhq.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  serverSelectionTimeoutMS: 5000,
});

async function run() {
  console.log("Connect to MongoDB");
  try {
     await client.connect();
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!",
    // );

    // ---------- দুইটা collection: jobs আর applications ----------
    const jobsCollection = client.db("carrerCode").collection("jobs");
    const applicationsCollection = client
      .db("carrerCode")
      .collection("applications");

    // ---------- তৃতীয় collection: users (প্রতিজনের role রাখার জন্য) ----------
    const usersCollection = client.db("carrerCode").collection("users");

    // একই email দুইবার যাতে save না হয়
    try {
      await usersCollection.createIndex({ email: 1 }, { unique: true });
    } catch (indexError) {
      console.log("INDEX WARNING:", indexError.message);
    }

    // email দিয়ে একজন user এর role বের করে দেয় (না পেলে null)
    const getRole = async (email) => {
      if (!email) return null;
      const user = await usersCollection.findOne({ email });
      return user ? user.role : null;
    };

    //JWT token generate করার জন্য route
    app.post("/jwt", async (req, res) => {
      const userData = req.body;
      const token = jwt.sign({ userData }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
      });
      res.cookie('token', token, { 
        httpOnly: true, 
        secure: false, // HTTPS হলে true করা উচিত
        maxAge: 3600000 }); // 1 hour
      res.send({ success: true});
    });
    // ---------- GET /jobs ----------
    // সব job আনে (Home page, token লাগে না)।
    // ?email=... দিলে শুধু ওই HR এর job আনে (এই ক্ষেত্রে token লাগবে)।
    // প্রতিটা job এর সাথে "applicationCount" (কয়জন apply করেছে) জুড়ে দেয়।
    app.get("/jobs", optionalFirebaseAuth, async (req, res) => {
      try {
        const email = req.query.email;
        let query = {};
        if (email) {
          query = { hr_email: email };
        }

        const jobs = await jobsCollection.find(query).toArray();

        // প্রতিটা job এর জন্য application গুনি
        const result = [];
        for (const job of jobs) {
          const applicationCount = await applicationsCollection.countDocuments({
            jobId: { $in: [job._id, job._id.toString()] },
          });
          result.push({ ...job, applicationCount });
        }

        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // ---------- GET /jobs/:id ----------
    // একটা job এর details আনে
    app.get("/jobs/:id", async (req, res) => {
      try {
        const id = req.params.id;
        // id ভুল হলে server crash না করে error পাঠাই
        if (!ObjectId.isValid(id)) {
          return res.status(400).send({ error: "Invalid job id" });
        }
        const result = await jobsCollection.findOne({ _id: new ObjectId(id) });
        // job না পেলে খালি object পাঠাই (frontend এর JSON parse যাতে না ভাঙে)
        res.send(result || {});
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // ---------- POST /jobs ----------
    // নতুন job save করে (AddJob form থেকে)
    app.post("/jobs", async (req, res) => {
      try {
        const newJob = req.body;

        // শুধু approved recruiter job post করতে পারবে
        const hrRole = await getRole(newJob.hr_email);
        if (hrRole !== "recruiter") {
          return res
            .status(403)
            .send({ error: "Only approved recruiters can post jobs" });
        }

        const result = await jobsCollection.insertOne(newJob);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // ---------- PUT /jobs/:id ----------
    // job এর তথ্য update করে (UpdateJob form থেকে)
    app.put("/jobs/:id", async (req, res) => {
      try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
          return res.status(400).send({ error: "Invalid job id" });
        }

        // _id আর applicationCount database এ save করার জিনিস না, তাই বাদ দিই
        const updatedJob = { ...req.body };
        delete updatedJob._id;
        delete updatedJob.applicationCount;

        const result = await jobsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedJob },
        );
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // ---------- DELETE /jobs/:id ----------
    // job মুছে ফেলে, সাথে ওই job এর সব application ও মুছে দেয়
    app.delete("/jobs/:id", async (req, res) => {
      try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
          return res.status(400).send({ error: "Invalid job id" });
        }

        const result = await jobsCollection.deleteOne({
          _id: new ObjectId(id),
        });

        // job না থাকলে তার application রেখে লাভ নেই
        await applicationsCollection.deleteMany({
          jobId: { $in: [new ObjectId(id), id] },
        });

        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // ---------- POST /applications ----------
    // কেউ apply করলে save করে। শুরুতে status থাকে "pending"।
    app.post("/applications", async (req, res) => {
      try {
        console.log("Cookies:", req.cookies);
        if (!ObjectId.isValid(req.body.jobId)) {
          return res.status(400).send({ error: "Invalid job id" });
        }

        // শুধু approved applicant apply করতে পারবে
        const applicantRole = await getRole(req.body.applicant_email);
        if (applicantRole !== "applicant") {
          return res
            .status(403)
            .send({ error: "Only approved applicants can apply" });
        }
        const application = {
          ...req.body,
          jobId: new ObjectId(req.body.jobId),
          status: "pending",
        };
        const result = await applicationsCollection.insertOne(application);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // ---------- GET /applications/jobs/:job_id ----------
    // একটা job এ যারা apply করেছে তাদের list (ViewApplications page এর জন্য)
    app.get("/applications/jobs/:job_id", async (req, res) => {
      try {
        const jobId = req.params.job_id;
        const query = { jobId: { $in: [new ObjectId(jobId), jobId] } };
        const result = await applicationsCollection.find(query).toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // ---------- PATCH /applications/:id/status ----------
    // HR status বদলালে (pending/interview/hired/rejected) database এ save হয়
    // আর applicant কে ইমেইল যায়
    app.patch("/applications/:id/status", async (req, res) => {
      try {
        const id = req.params.id;
        const status = String(req.body.status || "")
          .toLowerCase()
          .trim();

        // শুধু এই ৪টা status চলবে
        const allowed = [
          "pending",
          "shortlisted",
          "interview",
          "hired",
          "rejected",
        ];
        if (!allowed.includes(status)) {
          return res
            .status(400)
            .send({ success: false, error: "Invalid status" });
        }
        if (!ObjectId.isValid(id)) {
          return res
            .status(400)
            .send({ success: false, error: "Invalid application id" });
        }

        // application টা খুঁজি
        const application = await applicationsCollection.findOne({
          _id: new ObjectId(id),
        });
        if (!application) {
          return res
            .status(404)
            .send({ success: false, error: "Application not found" });
        }

        // database এ নতুন status save করি
        await applicationsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { status: status } },
        );

        // ইমেইলে দেখানোর জন্য job এর title আর company নাম আনি
        let job = null;
        if (ObjectId.isValid(application.jobId)) {
          job = await jobsCollection.findOne({
            _id: new ObjectId(application.jobId),
          });
        }
        const jobTitle = job?.title || "the job";
        const company = job?.company || "our company";

        // applicant এর email: যে field এ "@" আছে সেটাই নিই
        const emailCandidates = [
          application.applicant_email,
          application.applicant,
          application.email,
        ];
        const applicantEmail = emailCandidates.find(
          (value) => typeof value === "string" && value.includes("@"),
        );
        const applicantName =
          application.applicant_name || application.name || "Applicant";

        // ইমেইল পাঠাই। fail করলেও status save থাকবে।
        let emailSent = false;
        let emailError = "";

        if (!applicantEmail) {
          emailError = "Applicant email not found";
        } else {
          try {
            const content = getEmailContent(
              status,
              applicantName,
              jobTitle,
              company,
            );
            await transporter.sendMail({
              from: `"${company}" <${emailUser}>`,
              to: applicantEmail,
              subject: content.subject,
              text: content.text,
            });
            emailSent = true;
          } catch (mailError) {
            emailError = mailError.message;
            console.log("EMAIL ERROR:", mailError.message);
          }
        }

        // frontend কে জানাই: কাজ হয়েছে কিনা, ইমেইল গেছে কিনা
        res.send({ success: true, status, emailSent, emailError });
      } catch (error) {
        res.status(500).send({ success: false, error: error.message });
      }
    });

    // ---------- GET /applications ----------
    // MyApplications page এর জন্য। ?email=... দিলে শুধু ওই user এর application।
    // প্রতিটা application এর সাথে job এর details জুড়ে দেয়।
 app.get("/applications", logger, verifyFirebaseToken, async (req, res) => {  //verifyJWT
  try {
    if (req.query.email !== req.decoded.userData.email) {
      return res.status(403).send({ message: "Forbidden access" });
    }

    const filter = {};
    if (req.query.email) filter.applicant_email = req.query.email;
    if (req.query.jobId) {
      // DB তে jobId ObjectId হিসেবে থাকে, তাই ObjectId আর string দুইভাবেই খুঁজি
      filter.jobId = ObjectId.isValid(req.query.jobId)
        ? { $in: [new ObjectId(req.query.jobId), req.query.jobId] }
        : req.query.jobId;
    }

    const applications = await applicationsCollection
      .find(filter)
      .toArray();

    const applicationsWithJob = await Promise.all(
      applications.map(async (application) => {
        let jobDetails = null;

        if (ObjectId.isValid(application.jobId)) {
          jobDetails = await jobsCollection.findOne({
            _id: new ObjectId(application.jobId),
          });
        }

        return { ...application, job: jobDetails };
      }),
    );

    res.send(applicationsWithJob);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

    // =====================================================================
    //                    Role system এর নতুন route গুলো
    // =====================================================================

    // ---------- GET /users/role/:email ----------
    // login করা user এর role দেয়। user প্রথমবার এলে users collection এ "pending" দিয়ে save হয়।
    // .env এর ADMIN_EMAIL এর সাথে মিললে সে সবসময় "admin"।
    app.get("/users/role/:email", async (req, res) => {
      try {
        const email = req.params.email;
        const isAdminEmail =
          email.toLowerCase() === (process.env.ADMIN_EMAIL || "").toLowerCase();

        // না থাকলে নতুন user বানাই (থাকলে কিছু বদলায় না)
        try {
          await usersCollection.updateOne(
            { email },
            {
              $setOnInsert: {
                role: isAdminEmail ? "admin" : "pending",
                createdAt: new Date(),
              },
            },
            { upsert: true },
          );
        } catch (insertError) {
          // একসাথে দুইটা request এলে duplicate error আসতে পারে, সেটা ignore করি
        }

        const user = await usersCollection.findOne({ email });
        if (!user) {
          return res.status(500).send({ error: "Could not load user" });
        }

        // ADMIN_EMAIL হলে role সবসময় admin রাখি
        if (isAdminEmail && user.role !== "admin") {
          await usersCollection.updateOne(
            { email },
            { $set: { role: "admin" } },
          );
          user.role = "admin";
        }

        res.send({ role: user.role });
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // ---------- GET /users?adminEmail=... ----------
    // সব user এর list (শুধু admin দেখতে পারবে)
    app.get("/users", async (req, res) => {
      try {
        if ((await getRole(req.query.adminEmail)) !== "admin") {
          return res.status(403).send({ error: "Only admin can see users" });
        }
        const users = await usersCollection
          .find()
          .sort({ createdAt: -1 })
          .toArray();
        res.send(users);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // ---------- PATCH /users/:id/role ----------
    // admin কাউকে applicant / recruiter বানায় বা block করে
    app.patch("/users/:id/role", async (req, res) => {
      try {
        const { role, adminEmail } = req.body;

        if ((await getRole(adminEmail)) !== "admin") {
          return res.status(403).send({ error: "Only admin can change roles" });
        }

        const allowedRoles = ["pending", "applicant", "recruiter", "blocked"];
        if (!allowedRoles.includes(role)) {
          return res.status(400).send({ error: "Invalid role" });
        }
        if (!ObjectId.isValid(req.params.id)) {
          return res.status(400).send({ error: "Invalid user id" });
        }

        const target = await usersCollection.findOne({
          _id: new ObjectId(req.params.id),
        });
        if (!target) {
          return res.status(404).send({ error: "User not found" });
        }
        // admin এর role বদলানো যাবে না
        if (target.role === "admin") {
          return res
            .status(403)
            .send({ error: "Admin role can not be changed" });
        }

        await usersCollection.updateOne(
          { _id: new ObjectId(req.params.id) },
          { $set: { role: role } },
        );
        res.send({ success: true, role });
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // ---------- GET /admin/stats?adminEmail=... ----------
    // admin dashboard এর মোট সংখ্যা
    app.get("/admin/stats", async (req, res) => {
      try {
        if ((await getRole(req.query.adminEmail)) !== "admin") {
          return res.status(403).send({ error: "Only admin allowed" });
        }
        const [users, jobs, applications] = await Promise.all([
          usersCollection.countDocuments(),
          jobsCollection.countDocuments(),
          applicationsCollection.countDocuments(),
        ]);
        res.send({ users, jobs, applications });
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // ---------- GET /recruiter/stats?email=... ----------
    // recruiter dashboard এর সংখ্যা: কয়টা job, কয়জন apply, কোন status এ কয়জন
    app.get("/recruiter/stats", async (req, res) => {
      try {
        const email = req.query.email;
        const jobs = await jobsCollection.find({ hr_email: email }).toArray();

        // jobId কখনো ObjectId কখনো string থাকতে পারে, তাই দুইভাবেই খুঁজি
        const jobIds = jobs.map((job) => job._id);
        const allIds = [...jobIds, ...jobIds.map((id) => id.toString())];
        const applications = await applicationsCollection
          .find({ jobId: { $in: allIds } })
          .toArray();

        const byStatus = {
          pending: 0,
          shortlisted: 0,
          interview: 0,
          hired: 0,
          rejected: 0,
        };
        applications.forEach((application) => {
          const status = application.status || "pending";
          if (byStatus[status] !== undefined) byStatus[status]++;
        });

        res.send({
          totalJobs: jobs.length,
          totalApplications: applications.length,
          byStatus,
        });
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // ---------- DELETE /applications/:id?email=... ----------
    // applicant নিজের apply undo (withdraw) করে। শুধু নিজেরটা, আর hired হলে না।
    app.delete("/applications/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const email = req.query.email;

        if (!ObjectId.isValid(id)) {
          return res.status(400).send({ error: "Invalid application id" });
        }

        const application = await applicationsCollection.findOne({
          _id: new ObjectId(id),
        });
        if (!application) {
          return res.status(404).send({ error: "Application not found" });
        }
        if (application.applicant_email !== email) {
          return res
            .status(403)
            .send({ error: "You can only withdraw your own application" });
        }
        if (application.status === "hired") {
          return res
            .status(400)
            .send({ error: "A hired application can not be withdrawn" });
        }

        const result = await applicationsCollection.deleteOne({
          _id: new ObjectId(id),
        });
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });
  } catch (err) {
    console.log("CONNECTION FAILED:", err.message);
  }
}
dbReady = run();

// ---------- Server চলছে কিনা check করার route ----------
app.get("/", (req, res) => {
  res.send("Career Server is running");
});

// ---------- MongoDB connect আছে কিনা check করার route ----------
app.get("/ping", async (req, res) => {
  try {
    await client.db("admin").command({ ping: 1 });
    res.send("MongoDB connected ✅");
  } catch (err) {
    res.status(500).send("MongoDB not connected ❌ " + err.message);
  }
});

// ---------- Server start ----------
app.listen(port, () => {
  console.log(`Career Server listening on port ${port}`);
});

// Vercel এর জন্য app টা export করে রাখি (locally এর কাজে কোনো প্রভাব নেই)
module.exports = app;