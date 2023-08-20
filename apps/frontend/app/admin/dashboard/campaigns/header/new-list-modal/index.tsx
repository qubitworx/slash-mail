import Link from "next/link";
import { FlatButton } from "ui";
import { Plus } from "ui/icons";

const NewCampaign = () => {
  return (
    <Link href="/admin/dashboard/campaigns/new" className="w-2/12">
      <FlatButton className="w-full flex gap-2 items-center justify-center">
        <Plus />
        Create Campaign
      </FlatButton>
    </Link>
  );
};

export default NewCampaign;
