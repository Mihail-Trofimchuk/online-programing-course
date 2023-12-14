import { db } from "@/lib/db";
import { Attachment, Chapter } from "@prisma/client";

interface GetTestsProps {
  userId: string;
  courseId: string;
  chapterId: string;
};

export const getTests = async ({
  userId,
  courseId,
  chapterId
}: GetTestsProps) => {
  try {
    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        }
      }
    });

    const course = await db.course.findUnique({
      where: {
        isPublished: true,
        id: courseId,
      },
      select: {
        price: true,
      }
    });

    const tests = await db.test.findMany({
      where: {
        chapterId: chapterId,
        isPublished: true,
      },
	  include: {
		  answerOptions: true
	  }
    });

    if (!tests || !course) {
      throw new Error("Test or course not found");
    }


    let nextChapter: Chapter | null = null;

    // if (chapter.isFree || purchase) {
    //   muxData = await db.muxData.findUnique({
    //     where: {
    //       chapterId: chapterId,
    //     }
    //   });

    //   nextChapter = await db.chapter.findFirst({
    //     where: {
    //       courseId: courseId,
    //       isPublished: true,
    //       position: {
    //         gt: chapter?.position,
    //       }
    //     },
    //     orderBy: {
    //       position: "asc",
    //     }
    //   });
    // }

    // const userProgress = await db.userProgress.findUnique({
    //   where: {
    //     userId_chapterId: {
    //       userId,
    //       chapterId,
    //     }
    //   }
    // });

    return {
      tests,
      course,
      nextChapter,
      purchase,
    };
  } catch (error) {
    console.log("[GET_TESTS]", error);
    return {
      tests: null,
      course: null,
      nextChapter: null,
      userProgress: null,
      purchase: null,
    }
  }
}