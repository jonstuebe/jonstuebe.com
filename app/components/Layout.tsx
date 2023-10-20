import type { FC, ReactNode } from "react";

const Layout: FC<{ className?: string; children: ReactNode }> = ({
  children,
  className,
}) => {
  return (
    <div className={`lg:max-w-5xl lg:px-0 px-6 mx-auto ${className}`}>
      {children}
    </div>
  );
};

export default Layout;
