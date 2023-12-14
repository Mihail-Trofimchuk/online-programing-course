"use client";

import { UserButton, useAuth } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import { isAdmin } from "@/lib/admin";

import { SearchInput } from "./search-input";
import { useEffect, useState } from 'react';
import { db } from '@/lib/db';
import axios from 'axios';
import { Teacher } from '@prisma/client';
import Router from 'next/dist/server/router';

export const NavbarRoutes = () => {
  const { userId } = useAuth();
  const pathname = usePathname();

  const isAdminPage = pathname?.startsWith("/admin");
  
  const isTeacherPage = pathname?.startsWith("/teacher");
  const isCoursePage = pathname?.includes("/courses");
  const isSearchPage = pathname === "/search";


  const [isTeacherUser, setIsTeacherUser] = useState(false);

  useEffect(() => {
 
    const checkIsTeacher = async () => {
      try {

        const response = await axios.get(`/api/user/${userId}`);
        // const teacher = await db.teacher.findFirst({
        //   where: {
        //     clerk_id: userId,
        //   },
        // });

        const teacher = response.data;
  
    
        if(teacher){
   
          setIsTeacherUser(true); 
         
          
        } else {
       
          setIsTeacherUser(false); 
      
        }

      } catch (error) {
        console.error("Error fetching teacher data:", error);
      }
    };
   
    checkIsTeacher();
  }, [userId]);

  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      <div className="flex gap-x-2 ml-auto">
        {isTeacherPage || isCoursePage || isAdminPage ? (
          <Link href="/">
            <Button size="sm" variant="ghost">
              <LogOut className="h-4 w-4 mr-2" />
              Exit
            </Button>
          </Link>
        ) : !isAdmin(userId) && isTeacherUser && (
          <Link href="/teacher/courses">
            <Button size="sm" variant="ghost">
              Teacher mode
            </Button>
          </Link>
        )}
        { isAdmin(userId) && !isAdminPage && (
          <Link href="/admin/category"> 
            <Button size="sm" variant="ghost">
              Admin Page
            </Button>
          </Link>
        )}
        <UserButton
          afterSignOutUrl="/"
        />
      </div>
    </>
  )
}