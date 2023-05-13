import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader } from "../components";

const RequestTable = ({
  approveRequest,
  finalizeRequest,
  state,
  address,
  requests,
}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onApprove = async (rId, approvers) => {
    try {
      setIsLoading(true);
      await approveRequest(state.pId, rId);
      setIsLoading(false);
      navigate("/");
    } catch (error) {
      setIsLoading(false);
      if (approvers.includes(address)) {
        alert("You have already approved, you can't approve twice!");
      } else {
        alert("You have not donated to this campaign OR Transaction Canceled!");
      }
    }
  };

  const onFinalize = async (rId, reqComplete, approvalCount) => {
    try {
      setIsLoading(true);
      await finalizeRequest(state.pId, rId);
      setIsLoading(false);
      navigate("/");
    } catch (error) {
      setIsLoading(false);
      if (reqComplete) {
        alert("Request has already been finalized!");
      } else if (approvalCount <= parseInt(state.donators.length / 2)) {
        alert("Request has no enough approvals!");
      } else {
        alert("Transaction Canceled");
      }
    }
  };

  const handleDetails = (request) => {
    navigate(`/campaigns/${state.title}/requests/details/${request.rId}`, {
      state: { ...request, owner: state.owner },
    });
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="relative overflow-x-auto w-[100%] mt-4">
        <table className="w-full text-sm text-center text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                ID
              </th>
              <th scope="col" className=" px-6 py-3">
                TITLE
              </th>
              <th scope="col" className="px-6 py-3">
                AMOUNT(ETH)
              </th>
              <th scope="col" className="px-6 py-3">
                RECIPIENT
              </th>
              <th scope="col" className="px-6 py-3">
                APPROVALCOUNT
              </th>
              <th scope="col" className="px-6 py-3">
                ACTION
              </th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => {
              return (
                <tr
                  key={request.rId}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 "
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {`${request.rId + 1}`}
                  </th>
                  <td className="px-6 py-4">{request.title}</td>
                  <td className="px-6 py-4 ">{request.amount}</td>
                  <td className="px-6 py-4">{`${request.recipient.slice(
                    0,
                    16
                  )}...`}</td>
                  <td className="px-6 py-4 ">
                    {request.approvalCount}/{state.donators.length}
                  </td>
                  <td className="px-6 py-4">
                    {state.owner == address ? (
                      <button
                        onClick={() =>
                          onFinalize(
                            request.rId,
                            request.complete,
                            request.approvalCount
                          )
                        }
                        className="rounded-fullfont-epilogue font-semibold text-[15px] leading-[26px] text-[#3b67df] py-2 px-4 rounded-[10px] border-2 border-[#3b67df] "
                      >
                        Finalize
                      </button>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() =>
                            onApprove(request.rId, request.approvers)
                          }
                          className="rounded-fullfont-epilogue font-semibold text-[15px] leading-[26px] text-[#1dc071] py-2 px-4 rounded-[10px] border-2 border-[#1dc071] "
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleDetails(request)}
                          className="rounded-fullfont-epilogue font-semibold text-[15px] leading-[26px]  py-2 px-4 rounded-[10px] border-2 border-[#8c6dfd] text-[#8c6dfd] "
                        >
                          Details
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default RequestTable;
