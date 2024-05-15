"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schema/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function Component() {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounced = useDebounceCallback(setUsername, 500);
  const { toast } = useToast();
  const router = useRouter();

  //zod
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username.length > 0) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(
            `api/check-username?username=${username}`
          );
          const data = await response.data;
          setUsernameMessage(data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error Checking Username"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    console.log("Form Submitted:", data); // Debugging log
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/signup", data);
      console.log("Response:", response.data); // Debugging log
      toast({
        title: "Success",
        description: response.data.message,
      });
      router.replace(`/verify/${data.username}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.error("Sign Up Error:", axiosError); // Debugging log
      toast({
        title: "Sign Up Failed",
        description: axiosError.response?.data.message ?? "There was a problem with your sign-up. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        
        <Form {...form}>
          
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
          > 
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);
                      }}
                    />
                  </FormControl>
                  {isCheckingUsername && <Loader2 className=" animate-spin" />}
                  <p
                    className={` text-sm ${
                      usernameMessage === "Username Available"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {usernameMessage}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john123@gmail.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    Verify after sign up
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Sign Up"
              )}
            </Button> 
            {/* Button Should be inside form */}
            </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member?{" "}
            <Link href="/signin" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
