import React, { useEffect, useState } from "react";
import { supabase } from "../supabase/supabase";
import { FiLogOut } from "react-icons/fi";

const LogoutButton: React.FC = () => {
  const [hasUser, setHasUser] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      if (isMounted) setHasUser(!!data.user);
    };
    init();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) setHasUser(!!session?.user);
    });

    return () => {
      isMounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    setIsSigningOut(true);
    try {
      await supabase.auth.signOut();
      window.location.href = "/login";
    } finally {
      setIsSigningOut(false);
    }
  };

  if (!hasUser) return null;

  return (
    <button
      className="btn-icon hover:preset-tonal"
      onClick={handleLogout}
      aria-label="Logout"
      disabled={isSigningOut}
      title="Logout"
    >
      <FiLogOut size={20} />
    </button>
  );
};

export default LogoutButton;


