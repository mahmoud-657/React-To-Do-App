import React, { useEffect, useState } from "react";
import "./Profile.module.css";
import axios from "axios";

export default function Profile() {
  let [todos, setToDo] = useState([]);
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

  return (
    <>
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
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
