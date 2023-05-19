import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ethers } from "ethers";

import { useStateContext } from "../context";
import { CustomButton, FormField, Loader } from "../components";

const RequestForm = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState();
  const { createRequest, upload } = useStateContext();
  const [form, setForm] = useState({
    title: "",
    description: "",
    amount: "",
    recipient: "",
    imageUrl: "",
  });

  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    const uploadUrl = await upload({
      data: [file],
      options: {
        uploadWithGatewayUrl: true,
        uploadWithoutDirectory: true,
      },
    });

    await createRequest({
      ...form,
      amount: ethers.utils.parseUnits(form.amount, 18),
      pId: state.pId,
      imageUrl: uploadUrl[0]
    });
    setIsLoading(false);
    navigate("/");
    
  };

  return (
    <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
      {isLoading && <Loader />}
      <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">
          Create a Request
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full mt-[65px] flex flex-col gap-[30px]"
      >
        <div className="flex flex-wrap gap-[40px]">
          <FormField
            labelName="Request Title *"
            placeholder="Write a title"
            inputType="text"
            value={form.title}
            handleChange={(e) => handleFormFieldChange("title", e)}
          />
          <FormField
            labelName="Recipient *"
            placeholder="0xAbyzf..."
            inputType="text"
            value={form.recipient}
            handleChange={(e) => handleFormFieldChange("recipient", e)}
          />
        </div>

        <FormField
          labelName="Description *"
          placeholder="Write your description"
          isTextArea
          value={form.description}
          handleChange={(e) => handleFormFieldChange("description", e)}
        />

        <div className="flex">
          <FormField
            labelName="Amount Needed *"
            placeholder="ETH 0.50"
            inputType="text"
            value={form.amount}
            handleChange={(e) => handleFormFieldChange("amount", e)}
          />
        </div>

        <FormField
          labelName="Request Sample image/Video *"
          placeholder="Place image URL of your request"
          inputType="file"
          handleChange={(e) => {
            if (e.target.files){
              setFile(e.target.files[0]);
            }
          }}
        />

        <div className="flex justify-center items-center mt-[40px]">
          <CustomButton
            btnType="submit"
            title="Submit new request"
            styles="bg-[#1dc071]"
          />
        </div>
      </form>
    </div>
  );
};

export default RequestForm;
