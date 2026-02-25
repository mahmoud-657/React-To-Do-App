import React, { useState } from "react";
import "./Register.module.css";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet";

let Schema = z
  .object({
    name: z
      .string()
      .min(3, "user name must be at least 3 characters")
      .max(30, "user name must be less than 30 characters"),
    email: z.string().email("email must contain @ mail-account and .com"),
    password: z.string().min(8, "password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "password not match",
    path: ["confirmPassword"],
  });

export default function Register() {
  let registerForm = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(Schema),
  });

  let { register, handleSubmit, formState } = registerForm;

  let [successMsg, setSuccessMsg] = useState();
  let [errorMsg, setErrorMsg] = useState();
  let [isLoading, setIsLoading] = useState(false);
  let navigate = useNavigate();

  function doRegister(formBody) {
    setIsLoading(true);

    axios
      .post("https://todo-nti.vercel.app/user/signup", formBody)
      .then((res) => {
        console.log(res);
        setSuccessMsg(res.data.message);
        setIsLoading(false);
        setTimeout(() => navigate("/login"), 2000);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(true);
        setErrorMsg(err.data.message);
      });
  }

  return (
    <>
      <Helmet>
        <title>Register | ToDo App</title>
      </Helmet>
      <form
        onSubmit={handleSubmit(doRegister)}
        className="w-2/5 mx-auto p-8 my-10 border-4 border-white shadow-xl/30"
      >
        {successMsg && (
          <p className="text-green-400">Register success, Welcome</p>
        )}
        {errorMsg && (
          <p className="text-red-800">Register failed, please try again</p>
        )}

        <div className="flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-gray-800 my-4 text-center">
            Get started on ToDo App
          </h1>
        </div>

        <div className="mb-5">
          <label
            htmlFor="name"
            className="block mb-2.5 text-sm font-medium text-heading"
          >
            Your Name
          </label>
          <input
            {...register("name")}
            type="text"
            id="name"
            className="bg-neutral-200 border text-heading text-sm rounded-3xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 shadow-xs"
          />
          {formState.errors.name && (
            <p className="text-red-700">{formState.errors.name.message}</p>
          )}
        </div>

        <div className="mb-5">
          <label
            htmlFor="email"
            className="block mb-2.5 text-sm font-medium text-heading"
          >
            Your Email
          </label>
          <input
            {...register("email")}
            type="email"
            id="email"
            className="bg-neutral-200 border text-heading text-sm rounded-3xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 shadow-xs"
          />
          {formState.errors.email && (
            <p className="text-red-700">{formState.errors.email.message}</p>
          )}
        </div>
        <div className="mb-5">
          <label
            htmlFor="password"
            className="block mb-2.5 text-sm font-medium text-heading"
          >
            Your password
          </label>
          <input
            {...register("password")}
            type="password"
            id="password"
            className="bg-neutral-200 border text-heading text-sm rounded-3xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 shadow-xs"
          />
          {formState.errors.password && (
            <p className="text-red-700">{formState.errors.password.message}</p>
          )}
        </div>
        <div className="mb-5">
          <label
            htmlFor="confirmPassword"
            className="block mb-2.5 text-sm font-medium text-heading"
          >
            Confirm Your password
          </label>
          <input
            {...register("confirmPassword")}
            type="password"
            id="confirmPassword"
            className="bg-neutral-200 border text-heading text-sm rounded-3xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 shadow-xs"
          />
          {formState.errors.confirmPassword && (
            <p className="text-red-700">
              {formState.errors.confirmPassword.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="text-white bg-blue-600 w-full rounded-3xl shadow-2xl box-border border border-transparent hover:bg-blue-800 focus:ring-4 font-bold leading-5 p-2.5 mt-4 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <>
              Submitting <i className="fa-solid fa-spinner fa-spin"></i>
            </>
          ) : (
            "Submit"
          )}
        </button>
      </form>
    </>
  );
}
