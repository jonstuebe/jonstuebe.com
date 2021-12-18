import { FC } from "react";

export const Tag: FC<HTMLSpanElement> = ({ children, className = "" }) => {
	return (
		<span
			className={
				"flex-shrink-0 inline-block px-2 py-0.5 text-blue-800 text-xs font-medium bg-blue-200 rounded-full" +
				" " +
				className
			}
		>
			{children}
		</span>
	);
};
