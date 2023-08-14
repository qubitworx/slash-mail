import { Template } from "@/rspc/bindings"
import { rspc } from "@/rspc/utils"
import { AlertDialog, Button } from "ui"
import { default_identifiers } from "../../row-actions"
import { useRouter } from "next/navigation"

interface Props {
    template: Template
}

const Settings = (props: Props) => {
    const editTemplate = rspc.useMutation(["templates.delete"])
    const router = useRouter();

    return (
        <div className="w-full">

            {default_identifiers.includes(props.template.identifier) ? (
                <div className="bg-white-fill p-3 rounded-lg">
                    No settings available for this template.
                </div>
            ) : (
                <AlertDialog
                    title={"Delete Template"}
                    description="Are you sure you want to delete this template? This action cannot be undone. "
                    confirmationText={`Delete ${props.template.name}`}
                    confirmButtonText="Delete"
                    onConfirm={() => {
                        editTemplate.mutateAsync({
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