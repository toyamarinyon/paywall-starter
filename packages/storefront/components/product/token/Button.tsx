import React from "react";

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
    console.log(loading)
  return (
    <button
      {...props}
      className={`px-4 py-1 bg-indigo-500 text-white rounded w-full ${props.className}`}
    >
      {loading ? <span>{loadingText}</span> : <span>購入する</span>}
    </button>
  );
}
