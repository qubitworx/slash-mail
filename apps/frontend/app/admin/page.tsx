"use client";

import { rspc } from "@/rspc/utils";
import { Button, Input } from "ui";
import { EyeIcon, UserIcon } from "ui/icons";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface FormFields {
  username: string;
  password: string;
}

export default function Home() {
  const loginMutation = rspc.useMutation(["auth.login"]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>();
  const [error, setError] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: FormFields) => {
    await loginMutation.mutateAsync(
      {
        password: data.password,
        username: data.username,
      },
      {
        onSuccess: (e) => {
          setError(false);

          router.push("/dashboard");
        },
        onError: (e) => {
          setError(true);
        },
      }
    );
  };

  return (
    <div className="w-full h-full grid place-items-center">
      <div className="bg-white-fill p-3 max-w-sm w-full rounded-lg">
        <h1 className="text-2xl font-medium">Login to your account</h1>
        <p className="text-white-text-disabled mt-2 text-sm">
          You can use the admin username and password to login. These
          credentials are set by you in the environment variables.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          {error && (
            <p className="text-red-500 text-sm mb-2">
              Invalid username or password
            </p>
          )}
          <div className="flex flex-col gap-2">
            <Input
              {...register("username", { required: true })}
              icon={<UserIcon size={24} />}
              className="w-full"
              variant={error ? "error" : "primary"}
              placeholder="Username"
            />
            <Input
              {...register("password", { required: true })}
              icon={<EyeIcon size={24} />}
              variant={error ? "error" : "primary"}
              className="w-full"
              type="password"
              placeholder="Password"
            />
          </div>
          <Button
            loading={loginMutation.isLoading}
            className="mt-4 w-full flex items-center justify-center gap-2"
            type="submit"
          >
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}
