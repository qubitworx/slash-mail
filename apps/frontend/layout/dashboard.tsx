interface Props {
  name: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  hideOverflow?: boolean;
}

const DashboardLayout = (props: Props) => {
  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex gap-2 items-center w-full border-b border-white-stroke py-3 px-3">
        {props.icon}
        <h1 className="text-xl font-semibold">{props.name}</h1>
      </div>
      <div
        style={{
          overflow: props.hideOverflow ? "hidden" : "auto",
        }}
        className="flex flex-col gap-2 p-4 w-full h-full">{props.children}</div>
    </div>
  );
};

export default DashboardLayout;
