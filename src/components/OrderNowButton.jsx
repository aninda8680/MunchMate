import React from "react";
import { useNavigate } from "react-router-dom";

const OrderNowButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/menu");
  };

  return (
    <button
      onClick={handleClick}
      className="relative border hover:border-orange-600 duration-500 group cursor-pointer text-orange-50 overflow-hidden h-14 w-56 rounded-md bg-orange-800 p-2 flex justify-center items-center font-extrabold"
    >
      <div className="absolute z-10 w-48 h-48 rounded-full group-hover:scale-150 transition-all duration-500 ease-in-out bg-orange-900 delay-150 group-hover:delay-75" />
      <div className="absolute z-10 w-40 h-40 rounded-full group-hover:scale-150 transition-all duration-500 ease-in-out bg-orange-800 delay-150 group-hover:delay-100" />
      <div className="absolute z-10 w-32 h-32 rounded-full group-hover:scale-150 transition-all duration-500 ease-in-out bg-orange-700 delay-150 group-hover:delay-150" />
      <div className="absolute z-10 w-24 h-24 rounded-full group-hover:scale-150 transition-all duration-500 ease-in-out bg-orange-600 delay-150 group-hover:delay-200" />
      <div className="absolute z-10 w-16 h-16 rounded-full group-hover:scale-150 transition-all duration-500 ease-in-out bg-orange-500 delay-150 group-hover:delay-300" />
      <p className="z-10">Order Now</p>
    </button>
  );
};

export default OrderNowButton;
