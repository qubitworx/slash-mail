interface Props {
  name: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const DashboardLayout = (props: Props) => {
  return (
    <div className="flex flex-col">
      <div className="flex gap-2 items-center w-full border-b border-white-stroke py-3 px-3">
        {props.icon}
        <h1 className="text-xl font-semibold">{props.name}</h1>
      </div>
      <div className="flex flex-col gap-2 p-4">{props.children}</div>
    </div>
  );
};

export default DashboardLayout;
