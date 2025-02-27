"use client";
import { Address, evmRawTransaction, useOkto } from "@okto_web3/react-sdk";
import { evmRawTransaction as evmRawTransactionUserOp } from "@okto_web3/react-sdk/userop";
import { useState } from "react";

function EVMRawTransaction() {
  const oktoClient = useOkto();
  const [networkId, setNetworkId] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [value, setValue] = useState("");
  const [data, setData] = useState("");
  const [userOp, setUserOp] = useState<any | null>(null);
  const [signedUserOp, setSignedUserOp] = useState<any | null>(null);
  const [editableUserOp, setEditableUserOp] = useState<string>("");
  const [responseMessage, setResponseMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const handleCreateUserOp = async () => {
    if (!oktoClient.isLoggedIn()) {
      console.log("Not logged in");
      setResponseMessage("Error: Not logged in");
      setModalVisible(true);
      return;
    }
    try {
      const rawTransactionIntentParams = {
        caip2Id: networkId,
        transaction: {
          from: from as Address,
          to: to as Address,
          value: BigInt(value),
          data: (data ? data : undefined) as any,
        },
      };
      console.log("Creating UserOp with params:", rawTransactionIntentParams);
      const createdUserOp = await evmRawTransactionUserOp(
        oktoClient,
        rawTransactionIntentParams
      );
      setUserOp(createdUserOp);
      const formattedUserOp = JSON.stringify(createdUserOp, null, 2);
      setEditableUserOp(formattedUserOp);
      setResponseMessage(`UserOp created:\n${formattedUserOp}`);
    } catch (error: any) {
      console.error("Error creating UserOp:", error);
      setResponseMessage(`Error creating UserOp: ${error.message}`);
    }
  };

  const handleSignUserOp = async () => {
    if (!editableUserOp) {
      setResponseMessage("Error: Create UserOp first!");
      return;
    }
    try {
      const parsedUserOp = JSON.parse(editableUserOp);
      const signedOp = await oktoClient.signUserOp(parsedUserOp);
      setSignedUserOp(signedOp);
      const formattedSignedOp = JSON.stringify(signedOp, null, 2);
      setResponseMessage(`UserOp signed:\n${formattedSignedOp}`);
    } catch (error: any) {
      console.error("Error signing UserOp:", error);
      setResponseMessage(`Error signing UserOp: ${error.message}`);
    }
  };

  const handleExecuteUserOp = async () => {
    if (!signedUserOp) {
      setResponseMessage("Error: Sign UserOp first!");
      return;
    }
    try {
      const result = await oktoClient.executeUserOp(signedUserOp);
      const formattedResult = JSON.stringify(result, null, 2);
      setResponseMessage(`Execution Result:\n${formattedResult}`);
    } catch (error: any) {
      console.error("Error executing UserOp:", error);
      setResponseMessage(`Error executing UserOp: ${error.message}`);
    }
  };

  const handleEVMRawTransaction = async () => {
    try {
      const rawTransactionIntentParams = {
        caip2Id: networkId,
        transaction: {
          from: from as Address,
          to: to as Address,
          value: BigInt(value),
          data: (data ? data : undefined) as any,
        },
      };
      console.log(
        "Executing EVM Raw Transaction with params:",
        rawTransactionIntentParams
      );
      const result = await evmRawTransaction(
        oktoClient,
        rawTransactionIntentParams
      );
      const formattedResult = JSON.stringify(result, null, 2);
      setResponseMessage(
        `EVM Raw Transaction executed successfully!\nResult:\n${formattedResult}`
      );
    } catch (error: any) {
      console.error("Error executing EVM Raw Transaction:", error);
      setResponseMessage(`Error: ${error.message}`);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(responseMessage);
      setModalVisible(true);
    } catch (error) {
      console.error("Clipboard copy failed", error);
    }
  };

  const closeModal = () => setModalVisible(false);

  return (
    <div className="flex flex-col items-center bg-black p-6 rounded-lg shadow-lg w-full max-w-lg mx-auto max-h-screen">
      <h1 className="text-white text-2xl font-bold mb-6">
        EVM Raw Transaction
      </h1>
      <input
        className="w-full p-2 mb-4 border border-gray-300 rounded text-black"
        value={networkId}
        onChange={(e) => setNetworkId(e.target.value)}
        placeholder="Enter Network (ChainId/CAIP2)"
      />
      <input
        className="w-full p-2 mb-4 border border-gray-300 rounded text-black"
        value={from}
        onChange={(e) => setFrom(e.target.value)}
        placeholder="Enter Sender Address"
      />
      <input
        className="w-full p-2 mb-4 border border-gray-300 rounded text-black"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        placeholder="Enter Recipient Address"
      />
      <input
        className="w-full p-2 mb-4 border border-gray-300 rounded text-black"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter Value in Wei"
      />
      <input
        className="w-full p-2 mb-4 border border-gray-300 rounded text-black"
        value={data}
        onChange={(e) => setData(e.target.value)}
        placeholder="Enter Data (optional)"
      />
      <button
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-4"
        onClick={handleEVMRawTransaction}
      >
        Execute EVM Raw Transaction
      </button>
      <div className="w-full flex flex-col space-y-4">
        <button
          className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={handleCreateUserOp}
        >
          Create UserOp
        </button>
        {userOp && (
          <textarea
            className="w-full p-4 bg-gray-800 rounded text-white font-mono text-sm resize-vertical"
            value={editableUserOp}
            onChange={(e) => setEditableUserOp(e.target.value)}
            rows={10}
            placeholder="Edit UserOp JSON here"
          />
        )}
        <button
          className="w-full p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          onClick={handleSignUserOp}
        >
          Sign UserOp
        </button>
        <button
          className="w-full p-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          onClick={handleExecuteUserOp}
        >
          Execute UserOp
        </button>
      </div>
      {responseMessage && (
        <div className="w-full mt-4">
          <textarea
            className="w-full p-4 bg-gray-800 rounded text-white font-mono text-sm resize-vertical"
            value={responseMessage}
            readOnly
            rows={6}
          />
          <button
            className="w-full p-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 mt-2"
            onClick={copyToClipboard}
          >
            Copy Response to Clipboard
          </button>
        </div>
      )}
      {modalVisible && (
        <div className="fixed text-white inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-black rounded-lg w-11/12 max-w-md p-6">
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <div className="text-white text-lg font-semibold">
                EVM Raw Transaction
              </div>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={closeModal}
              >
                &times;
              </button>
            </div>
            <div className="text-left max-h-[80vh] overflow-y-auto">
              <p>{responseMessage}</p>
            </div>
            <div className="mt-4 text-right">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EVMRawTransaction;
