import React from "react";
import { useLocation } from "react-router-dom";

import { thirdweb } from "../assets";

const RequestDetails = () => {
  const { state } = useLocation();

  return (
    <div>
      <div className="rounded-xl bg-slate-900 ">
        <a href={state.imageUrl}>
          <img
            src={state.imageUrl}
            alt="campaign"
            className="object-cover w-[100%] max-h-[496px]"
          />
        </a>
      </div>

      <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
        <div className="flex-[2] flex flex-col gap-[40px]">
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
              Creator
            </h4>
            <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
              <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer">
                <img
                  src={thirdweb}
                  alt="user"
                  className="w-[60%] h-[60%] object-contain"
                />
              </div>
              <div>
                <h4 className="font-epilogue font-semibold text-[14px] text-white break-all">
                  {state.owner}
                </h4>
                <p className="mt-[4px] font-epilogue font-normal text-[12px] text-[#808191]">
                  {state.approvers.length} Approvers
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
              Request Title
            </h4>

            <div className="mt-[20px]">
              <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">
                {state.title}
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
              Request Description
            </h4>
            <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify mt-[20px]">
              {state.description}
            </p>
          </div>
        </div>

        <div className="flex-1 ">
          <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
            Amount Needed
          </h4>
          <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify mt-[20px]">
            {state.amount} ETH
          </p>
          <div className="mt-[20px]">
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
              Recipient
            </h4>
            <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify mt-[20px]">
              {state.recipient}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetails;
