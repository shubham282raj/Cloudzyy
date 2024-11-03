import React from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { registerUser } from "../api/user";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const queryClient = useQueryClient();

  const { register, handleSubmit } = useForm();

  const navigate = useNavigate();

  const mutation = useMutation(registerUser, {
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
            Register
          </div>
          <input
            type="text"
            className="rounded-lg px-4 py-2"
            placeholder="Name"
            {...register("name")}
          />
          <input
            type="text"
            className="rounded-lg px-4 py-2"
            placeholder="Email"
            {...register("email")}
          />
          <input
            type="text"
            className="rounded-lg px-4 py-2"
            placeholder="GitHub Repo Name"
            {...register("githubRepo")}
          />
          <input
            type="text"
            className="rounded-lg px-4 py-2"
            placeholder="GitHub Repo Owner"
            {...register("githubRepoOwner")}
          />
          <input
            type="text"
            className="rounded-lg px-4 py-2"
            placeholder="GitHub Repo Token"
            {...register("githubToken")}
          />
          <input
            type="password"
            className="rounded-lg px-4 py-2"
            placeholder="Password"
            {...register("password")}
          />
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
