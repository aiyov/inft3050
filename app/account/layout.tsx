"use client";
import { useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const { role, isAuthenticated, handleLogout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    if (isAuthenticated && role !== 'customer') {
      handleLogout();
      router.replace('/login');
    }else if(!isAuthenticated){
      router.replace('/login');
    }
  }, [isAuthenticated, role, handleLogout]);

  if (!isAuthenticated && pathname !== '/login') {
    return <div />;
  }
  return children
  ;
}
