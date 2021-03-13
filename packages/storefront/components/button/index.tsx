import React from "react";
import classnames from "classnames";

interface ButtonProps {
  loading?: boolean;
  loadingText?: string;
  text?: string;
}
export function Button({
  loading = false,
  loadingText = "処理中",
  text = "購入する",
  ...props
}: ButtonProps &
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
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
      {loading ? <span>{loadingText}</span> : <span>{text}</span>}
    </button>
  );
}
