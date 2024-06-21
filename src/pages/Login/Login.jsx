import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import pizza from "../../assets/images/pizza.jpg";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import ToastNotificationContainer from "../../components/ToastContainer/ToastContainer";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [activeTab, setActiveTab] = useState("ProductAdmin");
  const bgImage = pizza;

  const navigate = useNavigate();

  const location = useLocation();
  console.log("Location:", location);

  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message);
    }
  }, [location]);

  const handleLogin = async (data) => {
    try {
      let loginUrl;
      const baseUrl = process.env.REACT_APP_API_BASE_URL;
      if (activeTab === "ProductAdmin") {
        loginUrl = `${baseUrl}/auth/validateAdmin`;
      } else if (activeTab === "RestaurantAdmin") {
        loginUrl = `${baseUrl}/auth/validateRestaurantAdmin`;
      }

      const response = await axios.post(loginUrl, {
        email: data.email,
        password: data.password,
      });

      if (response.data.success) {
        localStorage.setItem("accessToken", response.data.token);

        if (response.data.restaurantAdmin) {
          localStorage.setItem(
            "username",
            response.data.restaurantAdmin.ownerName || "N/A"
          );
          localStorage.setItem(
            "restaurantId",
            response.data.restaurantAdmin._id || "N/A"
          );
        }

        if (response.data.productAdmin) {
          localStorage.setItem("accessToken", response.data.token);
          localStorage.setItem(
            "username",
            response.data.productAdmin.username || "N/A"
          );
          localStorage.setItem(
            "productAdminId",
            response.data.productAdmin._id || "N/A"
          );
        }

        toast.success("Logged in successfully!");
        if (activeTab === "ProductAdmin") {
          navigate("/product-admin/dashboard");
        } else if (activeTab === "RestaurantAdmin") {
          navigate("/restaurant-admin/dashboard");
        }
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error: ", error.response || error.message);
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})`, objectFit: `cover` }}
    >
      <ToastNotificationContainer />
      <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg w-full max-w-md sm:mx-0 mx-[12px]">
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setActiveTab("ProductAdmin")}
            className={`px-4 py-2 ${activeTab === "ProductAdmin"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800"
              } rounded-l font-medium`}
          >
            Product Admin
          </button>
          <button
            onClick={() => setActiveTab("RestaurantAdmin")}
            className={`px-4 py-2 ${activeTab === "RestaurantAdmin"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800"
              } rounded-r font-medium`}
          >
            Restaurant Admin
          </button>
        </div>
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          {activeTab === "ProductAdmin"
            ? "Product admin login"
            : "Restaurant admin login"}
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit(handleLogin)}>
          <Input
            label="Email address"
            id="email"
            type="email"
            register={register}
            placeholder="you@example.com"
            {...register("email", { required: "Email is required" })}
            error={errors.email}
          />
          <Input
            label="Password"
            id="password"
            type="password"
            placeholder="••••••••"
            register={register}
            {...register("password", { required: "Password is required" })}
            error={errors.password}
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember_me"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember_me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a href="#"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot your password?
              </a>
            </div>
          </div>
          <Button type="submit" variant="primary">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
