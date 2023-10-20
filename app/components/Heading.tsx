import { FC, ReactText, useMemo } from "react";

export interface HeadingProps {
  type?: "h1" | "h2" | "h3" | "h4" | "h5";
  children: ReactText;
  className?: string;
}

export const Heading: FC<HeadingProps> = ({
  children,
  type = "h2",
  className,
  ...props
}) => {
  const Component = type;
  const size = useMemo(() => {
    switch (type) {
      case "h1":
        return "text-5xl font-bold lg:text-8xl lg:py-32 py-24 text-center";
      default:
        return "text-2xl font-semibold";
    }
  }, [type]);

  return (
    <Component
      className={
        size +
        " " +
        "leading-none tracking-tight m-0 text-left mb-4 select-none motion-safe:animate-fade-in " +
        " " +
        className
      }
      {...props}
    >
      {children}
    </Component>
  );
};
