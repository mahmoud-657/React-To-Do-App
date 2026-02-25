import React, { useEffect, useState } from "react";
import "./Home.module.css";
import { Helmet } from "react-helmet";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";

let schema = z.object({
  title: z
    .string()
    .min(3, "title must be at least 3 characters")
    .max(30, "title must be less than 30 characters"),
  description: z
    .string()
    .min(3, "description must be at least 10 characters")
    .max(300, "description must be less than 30 characters"),
});

export default function Home() {
  let createForm = useForm({
    defaultValues: {
      title: "",
      description: "",
    },
    resolver: zodResolver(schema),
  });
  let [isLoading, setIsLoading] = useState(false);
  let [todos, setToDo] = useState([]);

  let { register, handleSubmit, reset, formState } = createForm;

  function createToDo(data) {
    // console.log(data);

    axios
      .post("https://todo-nti.vercel.app/todo/create", data, {
        headers: {
          token: localStorage.getItem("userToken"),
        },
      })
      .then((res) => {
        console.log(res);
        toast.success("task added");
        reset();
        getToDo();
      })
      .catch((err) => {
        console.log(err);
        toast.error("task not added");
        setIsLoading(false);
      });
  }

  function getToDo() {
    axios
      .get("https://todo-nti.vercel.app/todo/get-all", {
        headers: {
          token: localStorage.getItem("userToken"),
        },
      })
      .then((res) => {
        console.log(res);
        setToDo(res.data.todos);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    getToDo();
  }, []);

  function deleteToDo(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?",
    );
    if (!confirmDelete) return;

    axios
      .delete(`https://todo-nti.vercel.app/todo/delete-todo/${id}`, {
        headers: {
          token: localStorage.getItem("userToken"),
        },
      })
      .then((res) => {
        console.log(res);
        toast.success("todo deleted");
        getToDo();
      })
      .catch((err) => {
        console.log(err);
        toast.error("todo not deleted");
      });
  }

  let [isPopupOpen, setIsPopupOpen] = useState(false);
  let [selectedTodo, setSelectedTodo] = useState("");

  let updateForm = useForm({
    defaultValues: {
      title: selectedTodo?.title || "",
      description: selectedTodo?.description || "",
    },
  });

  useEffect(() => {
    if (selectedTodo) {
      updateForm.reset({
        title: selectedTodo.title,
        description: selectedTodo.description,
      });
    }
  }, [selectedTodo, updateForm]);

  function handleUpdate(data) {
    axios
      .patch(
        `https://todo-nti.vercel.app/todo/update-todo/${selectedTodo._id}`,
        data,
        {
          headers: {
            token: localStorage.getItem("userToken"),
          },
        },
      )
      .then((res) => {
        console.log(res);
        toast.success("Todo Updated");
        setIsPopupOpen(false);
        getToDo();
      })
      .catch((err) => {
        console.log(err);
        toast.error("Update Failed");
      });
  }

  return (
    <>
      <Helmet>
        <title>HOME</title>
      </Helmet>
      <Toaster position="top-right" />
      <div className="container mx-auto p-5">
        <div className="form flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-gray-800 my-4 text-center">
            Create Task
          </h1>
          <form
            onSubmit={handleSubmit(createToDo)}
            className="w-2/5 mx-auto p-8 my-10 border-4 border-white shadow-xl/30"
          >
            <div className="mb-5">
              <label
                htmlFor="title"
                className="block mb-2.5 text-sm font-medium text-heading"
              >
                Task Title
              </label>
              <input
                {...register("title")}
                type="text"
                id="title"
                className="bg-neutral-200 border  focus:ring-blue-500 focus:border-blue-500 text-heading text-sm rounded-3xl block w-full p-2.5 shadow-xs"
              />
              {formState.errors.title && (
                <p>{formState.errors.title.message}</p>
              )}
            </div>

            <div className="mb-5">
              <label
                htmlFor="description"
                className="block mb-2.5 text-sm font-medium text-heading"
              >
                Task Description
              </label>
              <textarea
                {...register("description")}
                id="description"
                rows="4"
                className="bg-neutral-200 border text-heading text-sm rounded-2xl focus:ring-blue-500 focus:border-blue-500 block w-full p-3 shadow-xs placeholder:text-body"
                placeholder="Write the task description here..."
              ></textarea>
              {formState.errors.description && (
                <p>{formState.errors.description.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="text-white bg-blue-600 w-full rounded-3xl shadow-2xl box-border border border-transparent hover:bg-blue-800 focus:ring-4 font-bold leading-5 p-2.5 mt-4 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  creating your task{" "}
                  <i className="fa-solid fa-spinner fa-spin"></i>
                </>
              ) : (
                "create Task"
              )}
            </button>
          </form>
        </div>
      </div>

      {todos.length > 0 && (
        <div className="max-w-6xl mx-auto px-6 mt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {todos.map((todo) => {
              return (
                <div
                  key={todo._id}
                  className="bg-white rounded-3xl shadow-lg p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-gray-100"
                >
                  <h2 className="text-xl font-bold text-gray-800 mb-3">
                    {todo.title}
                  </h2>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {todo.description}
                  </p>

                  <div className="flex justify-between gap-4">
                    <button
                      onClick={() => {
                        setSelectedTodo(todo);
                        setIsPopupOpen(true);
                      }}
                      type="button"
                      className="flex-1 bg-green-500 hover:bg-green-700 text-white py-2 rounded-xl font-semibold transition-all duration-300"
                    >
                      Update
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteToDo(todo._id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl font-semibold transition-all duration-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {isPopupOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Update Task</h2>

            <form onSubmit={updateForm.handleSubmit(handleUpdate)}>
              <input
                {...updateForm.register("title")}
                className="w-full mb-3 p-2 border rounded-xl"
              />

              <textarea
                {...updateForm.register("description")}
                className="w-full mb-4 p-2 border rounded-xl"
              />

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-xl"
                >
                  Save
                </button>

                <button
                  type="button"
                  onClick={() => setIsPopupOpen(false)}
                  className="flex-1 bg-gray-400 text-white py-2 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
