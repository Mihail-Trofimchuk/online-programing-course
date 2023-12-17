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
import { useState } from 'react'
import axios from 'axios'
import { Wrapper } from './wrapper'
 
 
const FormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
})

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

interface TestProps {
  tests: Test[]
	chapterId: string;
  courseId: string;
  nextChapterId?: string;
  completeOnEnd: boolean;
	//question: string
	//answers: AnswerOption[]

	
  };
 
export function CheckboxReactHookFormMultiple({chapterId, tests, courseId, nextChapterId, completeOnEnd}: TestProps ) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      items: [],
    },
  })

  const [isAnswerCorrect, setIsAnswerCorrect] = useState<Array<boolean | null>>(Array(tests.length).fill(null));
  const [isTestActive, setIsTestActive] = useState<Array<boolean>>(Array(tests.length).fill(true));
  const [allTestsCompleted, setAllTestsCompleted] = useState<boolean>(false);


  const handleSubmit = (index: number) => async (data: z.infer<typeof FormSchema>) => {
    try {
      const response = await axios.post(`/api/checkAnswer/${tests[index].chapterId}`, {
        selectedAnswers: data.items,
      });

      const correctAnswersFromServer = response.data.correctAnswers;
      const isCorrect = data.items.every((answer: string) => correctAnswersFromServer.includes(answer));

      const updatedAnswers = [...isAnswerCorrect];
      updatedAnswers[index] = isCorrect;
      setIsAnswerCorrect(updatedAnswers);

      const updatedActiveStatus = [...isTestActive];
      updatedActiveStatus[index] = false;
      setIsTestActive(updatedActiveStatus);

      const allCompleted = updatedAnswers.every((answer) => answer !== null);
      setAllTestsCompleted(allCompleted);

      if (isCorrect) {
        toast.success('Success');
    
      } else {
        toast.error('Fail');
    
      }
    } catch (error) {
      console.error('Error checking answer:', error);
    }
  };


  return (
    <>
    <h1 className="text-2xl font-semibold mb-10">Test yourself</h1>
   { tests.map((test, index) => (

    <Form key={test.id} {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit(index))} className="space-y-8 mb-20">
        <FormField
          control={form.control}
          name="items"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">{test.question}</FormLabel>
                <FormDescription >
                  (Select the correct answers.)
                </FormDescription>
              </div>
              {test.answerOptions.map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name="items"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={item.id}
                        className=" flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox   disabled={!isTestActive[index]}
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, item.id])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== item.id
                                    )
                                  )
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {item.option}
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
		
      <Button className={` ${isAnswerCorrect[index]  ? 'bg-green-500' : ' bg-red-500'} `}   disabled={!isTestActive[index]} type="submit">Submit</Button>

      </form>
    </Form>
   ))}
     {allTestsCompleted && (
        <Wrapper courseId={courseId} nextChapterId={nextChapterId} completeOnEnd={completeOnEnd} chapterId={chapterId} tests={tests} />
      )}
     </>
  )
}