
"use client"

import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {zodResolver} from "@hookform/resolvers/zod"
import * as z from 'zod';
import { usePathname, useRouter } from 'next/navigation';
import React from "react"
import { CommentValidation } from '@/lib/validations/thread';
import { addCommentToThread } from '@/lib/actions/thread.actions';


interface Props{
  threadId  : string;
  currentUserImg : string;
  currentUserId : string;
}

const Comment = ({
  threadId, currentUserImg, currentUserId
}: Props) => {


    const router  = useRouter();
    const pathname  = usePathname();

    const form = useForm({
        resolver : zodResolver(CommentValidation),
        defaultValues : {
            thread : '',
        },
    });
  
    const onSubmit = async (values : z.infer<typeof CommentValidation>) => {
        await addCommentToThread(
          threadId, 
          values.thread, 
          JSON.parse(currentUserId), 
          pathname);

        form.reset();
    }
  return ( 
    <Form {...form}>
        <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className="comment-form">

            {/* _________ Name input _________  */}
            <FormField
                control={form.control}
                name="thread"
                render={({ field }) => (
                <FormItem className='flex items-center gap-3 w-full'>
                    <FormLabel >
                        <Image 
                          src={currentUserImg}
                          alt='Profil Image'
                          width={48}
                          height={48}
                          className='rounded-full object-cover'
                        />
                    </FormLabel>
                    <FormControl className='no-focus border-none bg-transparent'>
                        <Input
                            type='text' 
                            placeholder='Comment...'
                            className='no-focus text-light-1 outline-none'
                            {...field}
                        />
                    </FormControl>
                </FormItem>
                )}
            />

            <Button type='submit' className='comment-form_btn'>
                Répondre
            </Button>
       </form>
    </Form>
  )

}

export default Comment