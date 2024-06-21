import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import pizza from "../../assets/images/pizza.jpg";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import axios from "axios";
import ToastNotificationContainer from "../../components/ToastContainer/ToastContainer";
import { useNavigate } from "react-router-dom";

const RegisterRestaurant = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        address: data.address,
        agreementAccepted: data.agreementAccepted,
        email: data.email,
        llc: data.llc,
        ownerName: data.ownerName,
        password: data.password,
        phoneNumber: data.phoneNumber,
        primaryContactDetails: {
          name: data.primaryContactName,
          address: data.primaryContactAddress,
          email: data.primaryContactEmail,
        },
        restaurantName: data.restaurantName,
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/auth/external/addRestaurant`,
        payload
      );

      if (response.status === 201) {
        navigate("/", { state: { message: "Restaurant registered successfully!" } });
      }
      console.log(response.data);
    } catch (error) {
      toast.error(error.response.data.error);
      console.error(error);
    }
    setLoading(false);
  };

  const [loading, setLoading] = useState(false);

  const bgImage = pizza;

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <ToastNotificationContainer />
      <div className="bg-white bg-opacity-75 p-8 rounded-lg shadow-lg w-full mx-16 sm:mx-38 md:mx-36 lg:mx-64 my-[90px]">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Register Your Restaurant
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid sm:grid-cols-2 grid-cols-1 sm:space-x-4">
            <Input
              label="Restaurant Name"
              id="restaurantName"
              placeholder="Restaurant Name"
              register={register}
              validation={{ required: "Restaurant Name is required" }}
              error={errors.restaurantName}
            />
            <Input
              label="Address"
              id="address"
              placeholder="Address"
              register={register}
              validation={{ required: "Address is required" }}
              error={errors.address}
            />
          </div>
          <div className="grid sm:grid-cols-2 grid-cols-1 sm:space-x-4">
            <Input
              label="LLC"
              id="llc"
              placeholder="LLC"
              register={register}
              validation={{ required: "LLC is required" }}
              error={errors.llc}
            />
            <Input
              label="Phone Number"
              id="phoneNumber"
              type="tel"
              placeholder="Phone Number"
              register={register}
              validation={{ required: "Phone Number is required" }}
              error={errors.phoneNumber}
            />
          </div>
          <div className="grid sm:grid-cols-2 grid-cols-1 sm:space-x-4">
            <Input
              label="Email"
              id="email"
              type="email"
              placeholder="name@company.com"
              register={register}
              validation={{
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              }}
              error={errors.email}
            />
            <Input
              label="Owner Name"
              id="ownerName"
              placeholder="Owner Name"
              register={register}
              validation={{ required: "Owner Name is required" }}
              error={errors.ownerName}
            />
          </div>
          <div className="grid sm:grid-cols-2 grid-cols-1 sm:space-x-4">
            <Input
              label="Create Password"
              id="password"
              type="password"
              placeholder="Create Password"
              register={register}
              validation={{ required: "Password is required" }}
              error={errors.password}
            />
            <Input
              label="Primary Contact Name"
              id="primaryContactName"
              placeholder="Primary Contact Name"
              register={register}
              validation={{ required: "Primary Contact Name is required" }}
              error={errors.primaryContactName}
            />
          </div>
          <div className="grid sm:grid-cols-2 grid-cols-1 sm:space-x-4">
            <Input
              label="Primary Contact Address"
              id="primaryContactAddress"
              placeholder="Primary Contact Address"
              register={register}
              validation={{ required: "Primary Contact Address is required" }}
              error={errors.primaryContactAddress}
            />
            <Input
              label="Primary Contact Email"
              id="primaryContactEmail"
              type="email"
              placeholder="Primary Contact Email"
              register={register}
              validation={{
                required: "Primary Contact Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              }}
              error={errors.primaryContactEmail}
            />
          </div>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="agreementAccepted"
              {...register("agreementAccepted", {
                required: "You must agree to the terms and conditions",
              })}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="agreementAccepted" className="ml-2 block text-sm text-gray-900">
              Agree to terms and conditions
            </label>
          </div>
          {errors.agreementAccepted && (
            <p className="text-red-500 text-sm mb-2">{errors.agreementAccepted.message}</p>
          )}
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Adding Restaurant..." : "Add Restaurant"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default RegisterRestaurant;
