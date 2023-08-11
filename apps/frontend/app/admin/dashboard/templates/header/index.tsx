import NewTemplate from "./new-template";

interface Props {
  children?: React.ReactNode;
}

const Header = (props: Props) => {
  return (
    <div className="w-full flex gap-2 mb-2">
      {props.children}
      <NewTemplate />
    </div>
  );
};

export default Header;
