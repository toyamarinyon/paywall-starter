import React from "react";
import classnames from "classnames";

interface ButtonProps {
  loading?: boolean;
  loadingText?: string;
}
export function Button({
  loading = false,
  loadingText = "処理中",
  ...props
}: ButtonProps &
  React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >) {
  return (
    <button
      {...props}
      className={classnames(
        "px-4 py-1 bg-indigo-500 text-white rounded w-full",
        { "opacity-50": loading },
        props.className
      )}
      disabled={loading}
    >
      {loading ? <span>{loadingText}</span> : <span>購入する</span>}
    </button>
  );
}
