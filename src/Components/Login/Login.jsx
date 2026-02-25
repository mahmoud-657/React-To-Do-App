import React, { useState } from "react";
import "./Login.module.css";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import axios from "axios";

let Schema = z.object({
  email: z.string().email("email must contain @ mail-account and .com"),
  password: z.string().min(8, "password must be at least 8 characters"),
});

export default function Login() {
  let loginForm = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(Schema),
  });

  let { register, handleSubmit, formState } = loginForm;

  let [successMsg, setSuccessMsg] = useState();
  let [errorMsg, setErrorMsg] = useState();
  let [isLoading, setIsLoading] = useState(false);
  let navigate = useNavigate();

  function doLogin(formBody) {
    setIsLoading(true);

    axios
      .post("https://todo-nti.vercel.app/user/login", formBody)
      .then((res) => {
        console.log(res);
        setSuccessMsg(res.data.message);
        setIsLoading(false);
        localStorage.setItem("userToken", res.data.token);
        localStorage.setItem("userData", JSON.stringify(res.data.user));

        setTimeout(() => navigate("/"), 2000);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(true);
        // setErrorMsg(err.data.message);
        setErrorMsg("account not signed up");
      });
  }

  return (
    <>
      <Helmet>
        <title>Login | ToDo App</title>
      </Helmet>

      <form
        onSubmit={handleSubmit(doLogin)}
        className="w-2/5 mx-auto p-8 my-10 border-4 border-white shadow-xl/30"
      >
        {successMsg && <p className="text-green-400">Login success, Welcome</p>}
        {errorMsg && (
          <p className="text-red-800">Login failed, please try again</p>
        )}

        <div className="flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-gray-800 my-4 text-center">
            Log in to Your ToDo App
          </h1>
        </div>

        <div className="mb-5">
          <label
            htmlFor="email"
            className="block mb-2.5 text-sm font-medium text-heading"
          >
            Email
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
            Password
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

        <button
          type="submit"
          disabled={isLoading}
          className="text-white bg-blue-600 w-full rounded-3xl shadow-2xl box-border border border-transparent hover:bg-blue-800 focus:ring-4 font-bold leading-5 p-2.5 mt-4 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <>
              logging in <i className="fa-solid fa-spinner fa-spin"></i>
            </>
          ) : (
            "Log in"
          )}
        </button>
      </form>
    </>
  );
}
