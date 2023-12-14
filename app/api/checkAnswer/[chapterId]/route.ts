import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { chapterId: string; } }
) {
  try {
    const { userId } = auth();
    const { selectedAnswers } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

	const chapterOwner = await db.chapter.findUnique({
		where: {
		  id: params.chapterId,
		},
		include: {
		  test: {
			select: {
			  id: true,
			  answerOptions: {
				select: {
				  id: true,
				  isCorrect: true,
				}
			  }
			}
		  }
		}
	  });

    if (!chapterOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

	const correctAnswers = chapterOwner.test.reduce((acc: string[], currentTest) => {
		currentTest.answerOptions.forEach(answerOption => {
		  if (answerOption.isCorrect) {
			acc.push(answerOption.id);
		  }
		});
		return acc;
	  }, []);

	  const isCorrect = selectedAnswers.every((answer: string) => correctAnswers.includes(answer))

    // const testOwner = await db.test.findUnique({
    //   where: {
    //     id: params.quizId,
    //     courseId: params.courseId,
    //   }
    // });

    // if (!testOwner) {
    //   return new NextResponse("Unauthorized", { status: 401 });
    // }

    // const lastAnswer = await db.answerOption.findFirst({
    //   where: {
    //     testId: params.quizId,
    //   },
    //   orderBy: {
    //     position: "desc",
    //   },
    // });

    // const newPosition = lastAnswer ? lastAnswer.position + 1 : 1;

    // const answer = await db.answerOption.create({
    //   data: {
	// 	    option,
    //     testId: params.quizId,
    //     position: newPosition,
    //   }
    // });
	// console.log(answer);

    return NextResponse.json({correctAnswers});
  } catch (error) {
    console.log("[TESTS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}