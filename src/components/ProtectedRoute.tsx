"use client";

import { useEffect, ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();

      // ❌ No user
      if (!data.session) {
        router.push("/login");
      }else{
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if(loading){
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">
      <p className="animate-pulse">Loading....</p>
    </div>
  }

  return <>{children}</>;
}