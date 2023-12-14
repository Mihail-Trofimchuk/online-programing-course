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
 
 
const FormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
})

interface TestProps {
	chapterId: string;
	question: string
	answers: AnswerOption[]

	
  };
 
export function CheckboxReactHookFormMultiple({chapterId, question, answers}: TestProps ) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      items: [],
    },
  })

  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null >(null);
  const [isActive, setisActive] = useState<boolean>(false);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
   
      const response = await axios.post(`/api/checkAnswer/${chapterId}`, {
        selectedAnswers: data.items,
      });

	  const correctAnswersFromServer = response.data.correctAnswers;
   
	  const isCorrect = data.items.every((answer: string) => correctAnswersFromServer.includes(answer))
	 
      if (isCorrect) {
		toast.success("Success");
        setIsAnswerCorrect(true);
		setisActive(true);
		

      } else {
		toast.error("Fail");
        setIsAnswerCorrect(false);
		setisActive(true);
      }
    } catch (error) {
      console.error('Error checking answer:', error);
    }
  };


  return (

    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="items"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">{question}</FormLabel>
                <FormDescription>
                  Select the correct answers.
                </FormDescription>
              </div>
              {answers.map((item) => (
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
                          <Checkbox disabled={isActive}
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
		
      <Button  className={`${ isAnswerCorrect ? 'bg-green-500' : ' bg-red-500'}`} disabled={isActive} type="submit">Submit</Button>
		   {/* <Button onClick={handleReset} type="button"  className="ml-4 bg-blue-500 text-white">
          Reset
           </Button> */}

      </form>
    </Form>
  )
}