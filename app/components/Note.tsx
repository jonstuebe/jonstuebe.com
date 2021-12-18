import { FC } from "react";

export const Note: FC<{ content: string; date: string; className?: string }> =
  ({ content, date, className = "" }) => {
    return (
      <div
        className={
          "rounded-md border-gray-900 border-solid border-2 p-5 motion-safe:transition motion-safe:transform hover:ring-2 ring-blue-300 ring-opacity-10" +
          " " +
          className
        }
      >
        <p className="text-base font-semibold text-gray-400 mb-2 mt-0">
          {date}
        </p>
        <div
          className="prose prose-dark max-w-max"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    );
  };
