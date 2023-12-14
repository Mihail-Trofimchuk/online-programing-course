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
import axios from 'axios'

 
 
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
	courseId: string;
	//answers: AnswerOption[]
  };
 
export function Wrapper({courseId,  tests}: TestProps ) {
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
      const response = await axios.post(`/api/checkAnswer/${courseId}`, {
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

  const handleReset = () => {
	setIsActive(!isActive);
  };

  return (
	<div >
	<Button onClick={handleReset} type="button"  className="ml-4 bg-blue-500 text-white">
        Get answers
	</Button> 

			{ isActive && tests.map((test) => (
                <div key={test.id} >
					<p>{test.question}</p>
					{test.answerOptions.map((answer)=>(
					
					   
					<p key={answer.id}>
			
					{ answer.isCorrect && <span style={{ color: 'green' }}> 	{answer.option} </span>}
				  </p>
					))}
				</div>
			))}
			 </div>
	

  )
}