// import { auth } from "@clerk/nextjs";
// import { redirect } from "next/navigation";
// import { File } from "lucide-react";

// import { getTests } from "@/actions/get-tests";
// import { Banner } from "@/components/banner";
// import { Separator } from "@/components/ui/separator";
// import { Preview } from "@/components/preview";
// import React, { useEffect, useState } from "react";
// import { CheckboxReactHookFormMultiple } from './_components/test-question';
// import { Button } from '@/components/ui/button';
// import { Wrapper } from './_components/wrapper';
// // import { Test } from '@prisma/client';

// //import { CourseProgressButton } from "./_components/course-progress-button";


// const TestingPage = async ({
//   params
// }: {
//   params: { courseId: string;  }
// }) => {
//   const { userId } = auth();
  
//   let boolean = false;
//   if (!userId) {
//     return redirect("/");
//   } 

//   const {
//     tests,
//     course,
//     nextChapter,
//     userProgress,
//     purchase,
//   } = await getTests({
//     userId,
//     courseId: params.courseId,
//   });

//   const handleAnswerSelection = (answerId: string) => {
//     //setSelectedAnswer(answerId);
//   };

//   if (!tests || !course) {
//     return redirect("/")
//   }


// //   const isLocked = !chapter.isFree && !purchase;
// //   const completeOnEnd = !!purchase && !userProgress?.isCompleted;

//   return ( 
//     <div>
		
//       {/* {userProgress?.isCompleted && (
//         <Banner
//           variant="success"
//           label="You already completed this chapter."
//         />
//       )}
//       {isLocked && (
//         <Banner
//           variant="warning"
//           label="You need to purchase this course to watch this chapter."
//         />
//       )} */}
//       <div className="flex flex-col max-w-4xl mx-auto pb-20">
       
//         <div>
//           <div className="p-4 flex flex-col   justify-between">
          
// 			{/* {tests.map((test) => (
//                 <div key={test.id}>
//                   <TestQuestion test={test} />
//                   <TestAnswers
//                     answers={test.answerOptions}
//                     handleAnswerSelection={handleAnswerSelection}
//                   />
//                 </div>
//               ))} */}
// 			{tests.map((test) => (
// 		    <div className="p-4 mt-8 mb-8 justify-between" key={test.id}>
// 		      <CheckboxReactHookFormMultiple 
// 			   question={test.question}
// 			   courseId={params.courseId}
// 			   answers={test.answerOptions}
// 			   />
// 			 </div>
// 			))}

          
// 		      <Wrapper 
// 			   courseId={params.courseId}
// 			   tests={tests}
// 			   />
		
			


            
//             {/* {purchase ? (
//               <CourseProgressButton
//                 chapterId={params.chapterId}
//                 courseId={params.courseId}
//                 nextChapterId={nextChapter?.id}
//                 isCompleted={!!userProgress?.isCompleted}
//               />
//             ): null} */}
//           </div>
		
// 		  {/* <Button type="button"  className="ml-4 bg-blue-500 text-white">
//           Reset
//            </Button> */}
//           {/* <div>
//             <Preview value={test.description!} />
//           </div> */}
//           {/* {!!attachments.length && (
//             <>
//               <Separator />
//               <div className="p-4">
//                 {attachments.map((attachment) => (
//                   <a 
//                     href={attachment.url}
//                     target="_blank"
//                     key={attachment.id}
//                     className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
//                   >
//                     <File />
//                     <p className="line-clamp-1">
//                       {attachment.name}
//                     </p>
//                   </a>
//                 ))}
//               </div>
//             </>
//           )} */}
//         </div>
		
//       </div>
//     </div>
//    );
// }
 
// export default TestingPage;


// ... (остальной импорт)

// interface AnswerOption {
// 	id: string;
// 	option: string;
// 	isCorrect: boolean;
// 	testId: string;
// 	position: number;
//   }
  
//   interface Test {
// 	id: string;
// 	question: string;
// 	answerOptions: AnswerOption[];
// 	position: number;
// 	courseId: string;
// 	isPublished: boolean;
//   }

// const TestingPage = ({ params }: { params: { courseId: string } }) => {
//   const { userId } = auth();

//   const [testsData, setTestsData] = useState<Test[] | null>(null);;
//   const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
//   const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!userId) {
//         return redirect("/");
//       }
//       try {
//         const { tests, course, nextChapter, userProgress, purchase } = await getTests({
//           userId,
//           courseId: params.courseId,
//         });
//         setTestsData(tests ? tests : []);
//       } catch (error) {
//         console.error('Error fetching test data:', error);
//       }
//     };

//     fetchData();
//   }, [userId, params.courseId]);

//   const handleAnswerSelection = (answerId: string) => {
//     setSelectedAnswer(answerId);
//   };

//   const handleAnswerConfirmation = async () => {
//     try {
//       // Отправьте выбранный ответ на сервер и получите результат (правильный/неправильный)
//       // const result = await checkAnswer({ testId, selectedAnswer });
//       // setIsAnswerCorrect(result);
//     } catch (error) {
//       console.error('Error confirming answer:', error);
//     }
//   };

//   return (
//     <div>
//       <div className="flex flex-col max-w-4xl mx-auto pb-20">
//         <div>
//           <div className="p-4 flex flex-col md:flex-row items-center justify-between">
//             <h2 className="text-2xl font-semibold mb-2">
//               {testsData && testsData.map((test) => (
//                 <div key={test.id}>
//                   <p className="line-clamp-1">{test.question}</p>
//                   <div>
//                     {test.answerOptions && test.answerOptions.map((answer) => (
//                       <div key={answer.id} className="flex items-center">
//                         <button
//                           onClick={() => handleAnswerSelection(answer.id)}
//                           className={`mr-2 ${
//                             selectedAnswer === answer.id ? 'bg-blue-500 text-white' : 'bg-gray-300'
//                           }`}
//                         >
//                           {answer.option}
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                   <button onClick={handleAnswerConfirmation}>Confirm Answer</button>
//                   {isAnswerCorrect !== null && (
//                     <p>{isAnswerCorrect ? 'Correct!' : 'Incorrect.'}</p>
//                   )}
//                 </div>
//               ))}
//             </h2>
//           </div>
//           <Separator />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TestingPage;
