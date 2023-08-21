"use client"
import DashboardLayout from "@/layout/dashboard";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Plus, X } from "ui/icons";
import BasicSettings from "./basic";
import EmailDesigner from "./editor/designer";

export interface NewCampaignInputFields {
    name: string;
    subject: string;
    from: string;
    lists: string[];
    template: string;
}

const NewCampaign = () => {
    const form = useForm<NewCampaignInputFields>({
        mode: "all",
        defaultValues: {
            lists: []
        }
    })
    const [step, setStep] = useState(2)

    return (
        <DashboardLayout
            name="Start Campaign"
            icon={<Plus />}
            hideOverflow
        >
            <FormProvider {...form}>
                <div className="w-full h-full flex flex-col items-center justify-center">
                    <div className={`w-full ${step == 1 && "max-w-lg"}`}>
                        <h1 className="text-2xl font-semibold">
                            Create Campaign
                        </h1>
                        <p className="text-sm text-gray-500 mb-4">
                            Step {step} of 2
                        </p>
                        {step == 1 && <BasicSettings setStep={setStep} />}
                        {step == 2 && <EmailDesigner />}
                    </div>
                </div>
            </FormProvider>
        </DashboardLayout>
    )
}

export default NewCampaign;