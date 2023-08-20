import { rspc } from "@/rspc/utils";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Button, FlatInput, Select } from "ui";
import { NewCampaignInputFields } from "./page";
import { X } from "ui/icons";
import { toast } from "ui/toast";

interface Props {
    setStep: (step: number) => void;
}

const BasicSettings = (props: Props) => {
    const [selectLists, setLists] = useState<string[]>([])
    const smtpServers = rspc.useQuery(["smtp.get"])
    const lists = rspc.useQuery(["list.get_all"])
    const templates = rspc.useQuery(["templates.get_all"])
    const form = useFormContext<NewCampaignInputFields>()

    return (
        <div className="w-full max-w-lg flex flex-col gap-2">
            <div className="flex flex-col ">
                <label className="text-sm font-semibold">Name</label>
                <FlatInput
                    {...form.register("name", {
                        required: {
                            value: true,
                            message: "Campaign name is required"
                        }
                    })}
                    placeholder="Campaign Name" containerClassName="w-full" className="w-full" />
                {form.formState.errors.name && (
                    <p className="text-red-500 text-sm">
                        {form.formState.errors.name.message}
                    </p>
                )}
            </div>
            <div className="flex flex-col">
                <label className="text-sm font-semibold">Subject</label>
                <FlatInput
                    {...form.register("subject", {
                        required: {
                            value: true,
                            message: "Campaign subject is required"
                        }
                    })}
                    placeholder="Campaign Subject" containerClassName="w-full" className="w-full" />
                {form.formState.errors.subject && (
                    <p className="text-red-500 text-sm">
                        {form.formState.errors.subject.message}
                    </p>
                )}
            </div>
            <div className="flex flex-col">
                <label className="text-sm font-semibold">From address</label>
                <Select
                    onChange={(e) => form.setValue("from", e)}
                    defaultValue={undefined}
                    ariaLabel="Select a from address"
                    items={smtpServers.data?.map((smtp_server) => (
                        { label: smtp_server.smtp_from, value: smtp_server.id }
                    ))}
                    placeholder="Select a from address"
                />
            </div>
            <div className="flex flex-col">
                <label className="text-sm font-semibold">Template (can be left empty)</label>
                <Select
                    onChange={(e) => form.setValue("template", e)}
                    defaultValue={undefined}
                    ariaLabel="Select a from address"
                    items={templates.data?.map((template) => (
                        { label: template.identifier, value: template.id }
                    ))}
                    placeholder="Select a from address"
                />
            </div>
            <div className="flex flex-col">
                <label className="text-sm font-semibold">Lists</label>
                <div className="flex">
                    <Select
                        className="w-full"
                        onChange={(e) => {
                            setLists((v) => [...v, e])
                        }}
                        defaultValue={undefined}
                        ariaLabel="Select a list"
                        items={lists.data?.map((list) => (
                            { label: list.name, value: list.id }
                        ))}
                        placeholder="Select a list"
                    />
                    <div className="flex flex-wrap gap-2 items-center ml-2">
                        {selectLists.map((list) => (
                            <Button
                                onClick={() => {
                                    setLists((v) => v.filter((l) => l !== list))
                                }}
                                className="flex items-center gap-2 px-1 py-0"
                                variant={"secondary"}
                                key={list}>
                                <span className="px-2 py-1 rounded-md">{lists.data?.find((l) => l.id === list)?.name}</span>
                                <X className="mr-2" />
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
            <Button
                onClick={() => {
                    form.setValue("lists", selectLists)

                    const forms = form.formState.errors
                    if (Object.keys(forms).length > 0) {
                        toast.error("Form has errors")
                        return;
                    }

                    const data = form.getValues()
                    if (data.from == undefined) {
                        toast.error("Please select a from address")
                    }

                    if (data.lists.length === 0) {
                        toast.error("Please select at least one list")
                        return;
                    }

                    props.setStep(2)
                }}
                className="w-full mt-4">
                Next
            </Button>
        </div >
    )
}

export default BasicSettings