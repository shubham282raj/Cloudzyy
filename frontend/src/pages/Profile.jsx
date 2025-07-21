import React from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getMemoUser, getRateLimit } from "../api/github";
import { useAppContext } from "../Context/AppContext";
import { ScreenLoader } from "../components/Loader";
import { formatFieldName } from "../utils/formatter";
import { logOut } from "../api/user";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { isLoggedIn, isLoginLoading, showToast } = useAppContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryFn: () => Promise.all([getMemoUser(), getRateLimit()]),
    enabled: isLoggedIn,
    queryKey: `user-dataxrate-limit`,
    onSuccess: (data) => console.log(data),
  });

  const mutation = useMutation({
    mutationFn: logOut,
    mutationKey: "logout",
    onSuccess: () => {
      showToast("Signed Out");
      navigate("/");
      queryClient.invalidateQueries("validateToken");
    },
  });

  // return null;

  // const {}

  if (!isLoggedIn && !isLoginLoading) return <p>Unauthorized</p>;
  if (isLoading || isLoginLoading) return <ScreenLoader />;
  if (error) return <p>Error: {error.message}</p>;

  const [userData, ghRLData] = data;

  return (
    <div className="mx-auto flex max-w-xs flex-col items-center gap-7">
      <div className="flex w-full flex-col gap-2">
        <div className="mx-auto w-full rounded bg-slate-800 px-3 py-2 text-center text-lg">
          Profile
        </div>
        <table>
          <tbody>
            <tr>
              <td className="px-4 py-0.5 text-center">{userData.name}</td>
            </tr>
            <tr>
              <td className="px-4 py-0.5 text-center">{userData.email}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex w-full flex-col gap-2">
        <div className="mx-auto w-full rounded bg-slate-800 px-3 py-2 text-center text-lg">
          Github Repo Info
        </div>
        <table>
          <tbody>
            <tr>
              <td className="px-4 py-0.5 text-center">
                Owner: {userData.githubRepoOwner}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-0.5 text-center">
                Name: {userData.githubRepo}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex w-full flex-col gap-2">
        <div className="mx-auto w-full rounded bg-slate-800 px-3 py-2 text-center text-lg">
          Rate Limits
        </div>
        <table>
          <tbody>
            <tr>
              <td className="px-4 py-0.5">Used</td>
              <td className="px-4 py-0.5 text-right">{ghRLData.used}</td>
            </tr>
            <tr>
              <td className="px-4 py-0.5">Remaining</td>
              <td className="px-4 py-0.5 text-right">{ghRLData.remaining}</td>
            </tr>
            <tr>
              <td className="px-4 py-0.5">Reset in</td>
              <td className="px-4 py-0.5 text-right">
                {Math.floor(
                  (ghRLData.reset - Math.ceil(Date.now() / 1000)) / 60,
                )}{" "}
                m {(ghRLData.reset - Math.ceil(Date.now() / 1000)) % 60} s
              </td>
            </tr>
            <tr>
              <td className="px-4 py-0.5">Reset at</td>
              <td className="px-4 py-0.5 text-right">
                {new Date(ghRLData.reset * 1000).toLocaleTimeString()}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-0.5">Limit</td>
              <td className="px-4 py-0.5 text-right">{ghRLData.limit} / hr</td>
            </tr>
          </tbody>
        </table>
      </div>

      {isLoggedIn && (
        <button
          className="w-full rounded bg-neutral-200 px-7 py-2 font-bold text-black transition-colors duration-500 hover:bg-neutral-100"
          onClick={() => mutation.mutate()}
        >
          Sign Out
          <img
            src="/icons/log-out.svg"
            alt="log out"
            title="Log Out"
            className="ml-1 inline"
          />
        </button>
      )}
    </div>
  );
}
