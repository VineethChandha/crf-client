import React from "react";

const Button = ({ type = "button", variant = "primary", className="", children, onClick }) => {
  const baseStyle =
    "w-full flex justify-center items-center font-semibold py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary: "text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 ease-in-out duration-150",
    secondary: "text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:ring-indigo-500 ease-in-out duration-150",
    disabled: "text-gray-400 bg-gray-200 cursor-not-allowed",
  };

  return (
    <button
      type={type}
      className={`${baseStyle} ${className} ${variants[variant]}`}
      onClick={onClick}
      disabled={variant === "disabled"}
    >
      {children}
    </button>
  );
};

export default Button;
