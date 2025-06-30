"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import React from "react";

export default function withAuth<T extends Record<string, any>>(Component: React.ComponentType<T>) {
    return function ProtectedComponent(props: T) {
      const { user, loading } = useAuth();
      const router = useRouter();
  
      useEffect(() => {
        if (!loading && user === null) {
          router.push("/signin");
        }
      }, [user, loading]);
  
      if (loading) {
        return <div className="text-center mt-10">Checking authentication...</div>;
      }
  
      if (!user) return null;
  
      return <Component {...props} />;
    };
  }  