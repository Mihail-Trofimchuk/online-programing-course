// import { auth } from "@clerk/nextjs";
// import { redirect } from "next/navigation";

// import { db } from "@/lib/db";
// import { SearchInput } from "@/components/search-input";
// import { getCourses } from "@/actions/get-courses";
// import { CoursesList } from "@/components/courses-list";
// import { getFavoriteCourses } from '@/actions/get-favorite';
// import { Category, Course } from '@prisma/client';
// import { useRouter } from 'next/router';

// interface FavoritePageProps {
//   searchParams: {
//     title: string;
//     categoryId: string;
//   }
// };

// type CourseWithProgressWithCategory = Course & {
// 	category: Category | null;
// 	chapters: { id: string }[];
// 	progress: number | null;
//   };
  



// const FavoritePage = async ({
//   searchParams
// }: FavoritePageProps) => {
//   const { userId } = auth();

//   if (!userId) {
//     return redirect("/");
//   }

  
//   const courses: CourseWithProgressWithCategory[] = await getFavoriteCourses({
//     userId,
//     ...searchParams,
//   });

  
//   return (
//     <>
//       <div className="p-6 space-y-4">
//         <CoursesList items={courses} />
//       </div>
//     </>
//    );
// }
 
// export default FavoritePage;

import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { getCourses } from "@/actions/get-courses";
import { getFavoriteCourses } from '@/actions/get-favorite';
import { CoursesList } from "@/components/courses-list";
import router, { useRouter } from 'next/router';
import { Category, Course } from '@prisma/client';

interface FavoritePageProps {
  searchParams: {
    title: string;
    categoryId: string;
  }
};

type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};

const FavoritePage = async ({
  searchParams
}: FavoritePageProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }



  try {
    const favoriteCourses = await getFavoriteCourses({
      userId,
      ...searchParams,
    });

    return (
      <>
        <div className="p-6 space-y-4">
          <CoursesList items={favoriteCourses}  />
        </div>
      </>
    );
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

export default FavoritePage;
