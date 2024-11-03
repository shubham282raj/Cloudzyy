import React from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { loginUser } from "../api/user";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const queryClient = useQueryClient();

  const { register, handleSubmit } = useForm();

  const navigate = useNavigate();

  const mutation = useMutation(loginUser, {
    onSuccess() {
      navigate("/");
      queryClient.invalidateQueries("validateToken");
    },
    onError(error) {
      window.alert(error.message);
    },
  });

  const onSubmit = handleSubmit((data) => {
    if (!mutation.isLoading) mutation.mutate(data);
  });

  return (
    <div>
      <div className="mx-auto max-w-screen-md rounded-lg bg-gray-800">
        <form
          className="mx-auto flex max-w-80 flex-col gap-4 py-10"
          onSubmit={onSubmit}
        >
          <div className="text-center text-lg font-bold tracking-widest underline">
            Login
          </div>
          <input
            type="text"
            className="rounded-lg px-4 py-2"
            placeholder="Email"
            {...register("email")}
          />
          <input
            type="password"
            className="rounded-lg px-4 py-2"
            placeholder="Password"
            {...register("password")}
          />
          <label className="mx-auto flex gap-2 text-gray-400">
            <input
              type="checkbox"
              className="outline-none"
              {...register("rememberMe")}
            />
            Remember me
          </label>
          <button
            type="submit"
            className="mx-auto w-24 rounded-lg border-t border-slate-700 p-1.5 shadow-md shadow-slate-950"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
