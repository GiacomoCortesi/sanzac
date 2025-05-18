import { useEffect } from "react";
import { supabase } from "../lib/supabase";

const AuthRedirect = () => {
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (data.user) {
        window.location.href = "/admin";
      } else {
        window.location.href = "/login";
      }
    };

    checkUser();
  }, []);

  return null; // no visible UI
};

export default AuthRedirect;
