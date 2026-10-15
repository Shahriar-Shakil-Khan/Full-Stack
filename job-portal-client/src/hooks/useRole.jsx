// login করা user এর role (admin / recruiter / applicant / pending / blocked) এনে দেয়।
// এই file টা src/hooks/ folder এ রাখবে (useAuth.jsx এর পাশে)।
import { useEffect, useState } from "react";
import useAuth from "./useAuth";

// একই email এর জন্য বারবার server call না করতে role মনে রাখি
const roleCache = {};

// logout করলে বা "Check again" চাপলে cache মুছতে এটা ব্যবহার হয়
export const clearRoleCache = (email) => {
  if (email) delete roleCache[email];
};

export default function useRole() {
  const { user, loading } = useAuth();
  // server থেকে আসা উত্তর রাখি: কোন email এর role কী
  const [result, setResult] = useState({ email: null, role: null });

  const email = user?.email;

  useEffect(() => {
    // firebase এর user লোড হচ্ছে, বা login করা নেই
    if (loading || !email) return;

    let cancelled = false;

    // প্রথমবার হলে server থেকে role আনি
    if (!roleCache[email]) {
      roleCache[email] = fetch(
        `http://localhost:3000/users/role/${encodeURIComponent(email)}`
      )
        .then((res) => res.json())
        .then((data) => data.role || null)
        .catch(() => {
          delete roleCache[email];
          return null;
        });
    }

    // উত্তর আসার পর state বদলাই (effect এর ভেতরে সরাসরি না)
    roleCache[email].then((role) => {
      if (!cancelled) setResult({ email, role });
    });

    return () => {
      cancelled = true;
    };
  }, [email, loading]);

  // state থেকে হিসাব করে বের করি (আলাদা state রাখার দরকার নেই)
  const hasResult = !!email && result.email === email;
  const role = hasResult ? result.role : null;
  // user আছে কিন্তু তার role এখনো আসেনি, অথবা firebase এখনো লোড হচ্ছে
  const roleLoading = loading || (!!email && !hasResult);

  return { role, roleLoading };
}