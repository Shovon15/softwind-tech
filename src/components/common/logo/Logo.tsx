import NavLink from "../link/NavLink";
import ImageComponent from "../image";
import { cn } from "@/utils/helpers/cn";

const Logo = ({
  className,
  src,
  onClick,
}: {
  className?: string;
  src?: string;
  onClick?: () => void;
}) => {
  return (
    <NavLink
      href="/"
      className={cn(`flex justify-start items-center`, className)}
      onClick={onClick}
    >
      <ImageComponent
        src={src || ""}
        // fallbackSrc={""}
        alt="logo"
        className="w-full h-full object-contain"
      />
    </NavLink>
  );
};

export default Logo;

const LogoFile = () => {
  return <></>;
};
