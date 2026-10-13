import { cn } from "@/utils/helpers/cn";

type Props = IHeading & {
  children: React.ReactNode;
};

const Heading = (props: IHeading) => {
  const { children, tag: Tag = "h1", className, ...rest } = props;
  return (
    <Tag className={cn("", className)} {...rest}>
      {children}
    </Tag>
  );
};
export const HeadingOne = ({ children, className, ...props }: Props) => {
  return (
    <Heading
      tag="h1"
      className={`text-[clamp(2rem,3.958vw,4.75rem)] leading-[clamp(2.5rem,3.5vw,5.6rem)] ${className}`}
      {...props}
    >
      {children}
    </Heading>
  );
};

export const HeadingTwo = ({ children, className, ...props }: Props) => {
  return (
    <Heading
      tag="h2"
      className={`text-[clamp(2rem,3.958vw,4.75rem)] leading-[clamp(1.8rem,3.281vw,4.2rem)] ${className}`}
      {...props}
    >
      {children}
    </Heading>
  );
};
export const HeadingThree = ({ children, className, ...props }: Props) => {
  return (
    <Heading
      tag="h3"
      className={`text-[clamp(1.5rem,1.875vw,2.25rem)] leading-[clamp(1.875rem,2.292vw,2.75rem)] font-bold font-manrope ${className}`}
      {...props}
    >
      {children}
    </Heading>
  );
};
export const HeadingFour = ({ children, className, ...props }: Props) => {
  return (
    <Heading
      tag="h3"
      className={`text-[clamp(1.5rem,3.75vw,3.375rem)] leading-[clamp(1.875rem,2.292vw,2.75rem)] font-bold font-manrope ${className}`}
      {...props}
    >
      {children}
    </Heading>
  );
};

export const GradientHeading = ({
  children,
  className = "text-[clamp(0.875rem,2.093vw,2.5rem)] leading-[clamp(1.225rem,2.917vw,3.5rem)]",
  ...props
}: Props) => {
  return (
    <Heading
      tag="h4"
      className={` font-semibold font-manrope uppercase ${className}`}
      {...props}
      style={{
        background: "linear-gradient(296.02deg, rgba(255, 103, 29, 0) -0.62%, #FF671D 44.36%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      {children}
    </Heading>
  );
};
