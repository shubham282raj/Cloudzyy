import React from "react";
import { useQuery } from "react-query";
import { getRateLimit } from "../api/github";
import { useAppContext } from "../Context/AppContext";
import { ScreenLoader } from "../components/Loader";

export default function Profile() {
  const { isLoggedIn, isLoginLoading } = useAppContext();

  const { data, isLoading, error } = useQuery({
    queryFn: () => getRateLimit(),
    enabled: isLoggedIn,
    queryKey: `rate-limit`,
    // onSuccess: (data) => console.log(data),
  });

  if (!isLoggedIn && !isLoginLoading) return <p>Unauthorized</p>;
  if (isLoading || isLoginLoading) return <ScreenLoader />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex flex-col">
        <div className="mx-auto w-fit rounded-lg border px-3 py-0.5 text-center text-lg">
          Profile
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="mx-auto w-fit rounded-lg border px-3 py-0.5 text-center text-lg">
          Rate Limits
        </div>
        <table>
          <tbody>
            <tr>
              <td className="px-4 py-0.5">Limit</td>
              <td className="px-4 py-0.5 text-right">{data.rate.limit} / hr</td>
            </tr>
            <tr>
              <td className="px-4 py-0.5">Used</td>
              <td className="px-4 py-0.5 text-right">{data.rate.used}</td>
            </tr>
            <tr>
              <td className="px-4 py-0.5">Remaining</td>
              <td className="px-4 py-0.5 text-right">{data.rate.remaining}</td>
            </tr>
            <tr>
              <td className="px-4 py-0.5">Reset in</td>
              <td className="px-4 py-0.5 text-right">
                {Math.floor(
                  (data.rate.reset - Math.ceil(Date.now() / 1000)) / 60,
                )}{" "}
                m {(data.rate.reset - Math.ceil(Date.now() / 1000)) % 60} s
              </td>
            </tr>
            <tr>
              <td className="px-4 py-0.5">Reset at</td>
              <td className="px-4 py-0.5 text-right">
                {new Date(data.rate.reset * 1000).toLocaleTimeString()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
