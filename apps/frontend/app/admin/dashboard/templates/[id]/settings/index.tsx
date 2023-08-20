import { Template } from "@/rspc/bindings"
import { rspc } from "@/rspc/utils"
import { AlertDialog, Button, Checkbox } from "ui"
import { default_identifiers } from "../../row-actions"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface Props {
    template: Template
}

const Settings = (props: Props) => {
    const deleteTemplate = rspc.useMutation(["templates.delete"])
    const router = useRouter();
    const [ignoreDefaultTemplate, setIgnoreDefaultTemplate] = useState(props.template.ignoreDefaultTemplate)
    const editTemplate = rspc.useMutation("templates.edit")

    return (
        <div className="w-full">
            <div className="flex gap-2 items-center">
                <h1 className="flex gap-2 items-center">
                    Ignore default template
                </h1>
                <Checkbox
                    checked={ignoreDefaultTemplate}
                    onChange={setIgnoreDefaultTemplate}
                    defaultChecked={props.template.ignoreDefaultTemplate}
                />

            </div>
            <Button
                loading={editTemplate.isLoading}
                disabled={editTemplate.isLoading}
                className="mt-2 mr-2" onClick={() => {
                    editTemplate.mutateAsync({
                        id: props.template.id,
                        ignore_default_template: ignoreDefaultTemplate,
                        html: props.template.content,
                        identifier: props.template.identifier,
                        json: props.template.json,
                        name: props.template.name,

                    })
                }}>
                Save
            </Button>
            {default_identifiers.includes(props.template.identifier) ? (
                <></>
            ) : (
                <AlertDialog
                    title={"Delete Template"}
                    description="Are you sure you want to delete this template? This action cannot be undone. "
                    confirmationText={`Delete ${props.template.name}`}
                    confirmButtonText="Delete"
                    onConfirm={() => {
                        deleteTemplate.mutateAsync({
                            ids: [props.template.id]
                        }, {
                            onSuccess: () => {
                                router.push("/admin/dashboard/templates")
                            }
                        })
                    }}
                >
                    <Button
                        onClick={() => {

                        }}
                        variant={"error"}
                    >
                        Delete
                    </Button>
                </AlertDialog>
            )}


        </div>
    )
}

export default Settings