"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
 
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import toast from "react-hot-toast";
import { AnswerOption } from '@prisma/client'
import { useState } from 'react'
import { useRouter } from "next/navigation";
import axios from 'axios'
import { useConfettiStore } from "@/hooks/use-confetti-store";

 
 
type Test = {
	id: string;
	question: string;
	position: number;
  chapterId: string;
	isPublished: boolean;
	answerOptions: {
	  id: string;
	  option: string;
	  isCorrect: boolean;
	  testId: string;
	  position: number;
	}[];
  };

const FormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
})

interface TestProps {
	tests: Test[]
	chapterId: string;
  courseId: string; 
  nextChapterId?: string; 
  completeOnEnd: boolean
	//answers: AnswerOption[]
  };
 
export function Wrapper({chapterId,  tests, courseId, nextChapterId, completeOnEnd}: TestProps ) {
  const router = useRouter();
  const confetti = useConfettiStore();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      items: [],
    },
  })
 
//   function onSubmit(data: z.infer<typeof FormSchema>) {
//     toast({
//       title: "You submitted the following values:",
//       description: (
//         <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
//           <code className="text-white">{JSON.stringify(data, null, 2)}</code>
//         </pre>
//       ),
//     })
//   }

  const [correctAnswers, setCorrectAnswers] = useState<AnswerOption[]>([]);
  const [isActive, setIsActive] = useState<boolean>(false);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      const response = await axios.post(`/api/checkAnswer/${chapterId}`, {
        selectedAnswers: data.items,
      });

	  const correctAnswersFromServer = response.data.correctAnswers;


      setCorrectAnswers(correctAnswersFromServer);

	  console.log(response.data.isCorrect);
	  console.log(response.data);

  
    } catch (error) {
      console.error('Error checking answer:', error);
    }
  };

  const handleReset = async  () => {

    try {
      if (completeOnEnd) {
        await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
          isCompleted: true,
        });

        if (!nextChapterId) {
          confetti.onOpen();
        }

        toast.success("Progress updated");
        router.refresh();

        if (nextChapterId) {
          router.push(`/courses/${courseId}/chapters/${nextChapterId}`)
        }
      }
    } catch {
      toast.error("Something went wrong");
    }


	setIsActive(!isActive);
  };

  return (
	<div >
	<Button onClick={handleReset} type="button"  className="mb-8 bg-black text-white">
        Get answers
	</Button> 

  {isActive && tests.map((test) => (
  <div key={test.id} className="border border-gray-300 p-4 mb-4 rounded">
    <p className="font-bold text-lg mb-2">{test.question}</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {test.answerOptions.map((answer) => (
        <p key={answer.id} className="mb-2">
          {answer.isCorrect ? (
            <span className="text-green-500 font-semibold">{answer.option}</span>
          ) : (
            <span className="text-red-500 font-semibold">{answer.option}</span>
          )}
        </p>
      ))}
    </div>
  </div>
))}
</div>	

  )
}