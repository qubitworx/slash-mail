"use client";

import { rspc } from "@/rspc/utils";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Fields from "./fields";

export interface SettingsProps {
  name: string;
  description: string;
  api_url: string;
  web_url: string;
  logo: string;
}

const GeneralSettings = () => {
  let settings = rspc.useQuery(["setttings.get_all"]);
  const form = useForm<SettingsProps>();

  useEffect(() => {
    if (settings.data && form) {
      form.setValue(
        "name",
        settings.data.filter((s) => s.key === "name")[0].value
      );
      form.setValue(
        "description",
        settings.data.filter((s) => s.key === "description")[0].value
      );
      form.setValue(
        "api_url",
        settings.data.filter((s) => s.key === "api_url")[0].value
      );
      form.setValue(
        "web_url",
        settings.data.filter((s) => s.key === "web_url")[0].value
      );
      form.setValue(
        "logo",
        settings.data.filter((s) => s.key === "logo")[0].value
      );
    }
  }, [form, settings.data]);

  if (settings.isLoading) {
    return <div></div>;
  }

  return (
    <FormProvider {...form}>
      <div className="flex flex-col gap-2 w-full">
        <Fields />
      </div>
    </FormProvider>
  );
};

export default GeneralSettings;
