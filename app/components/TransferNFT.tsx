"use client";
import { Address, nftTransfer, useOkto } from "@okto_web3/react-sdk";
import { nftTransfer as nftTransferUserOp } from "@okto_web3/react-sdk/userop";
import { useState } from "react";

function TransferNFT() {
  const oktoClient = useOkto();

  const [networkId, setNetworkId] = useState("");
  const [collectionAddress, setCollectionAddress] = useState("");
  const [nftId, setNftId] = useState("");
  const [recipientWalletAddress, setRecipientWalletAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [userOp, setUserOp] = useState<any | null>(null);
  const [userOpString, setUserOpString] = useState<string>("");

  const handleSubmit = async () => {
    if (!oktoClient.isLoggedIn()) {
      console.log("Not logged in");
      setModalMessage("Error: Not logged in");
      setModalVisible(true);
      return;
    }
    const transferParams = {
      caip2Id: networkId,
      collectionAddress: collectionAddress as Address,
      nftId,
      recipientWalletAddress: recipientWalletAddress as Address,
      amount: Number(amount),
      nftType: type as "ERC721" | "ERC1155",
    };

    console.log("NFT transfer params", transferParams);

    try {
      const userOpTmp = await nftTransferUserOp(oktoClient, transferParams);
      setUserOp(userOpTmp);
      setUserOpString(JSON.stringify(userOpTmp, null, 2));
    } catch (error: any) {
      console.error("NFT Transfer failed:", error);
      setModalMessage("Error: " + error.message);
      setModalVisible(true);
    }
  };

  const handleSubmitUserOp = async () => {
    if (!userOpString) return;
    try {
      const editedUserOp = JSON.parse(userOpString);
      const signedUserOp = await oktoClient.signUserOp(editedUserOp);
      const tx = await oktoClient.executeUserOp(signedUserOp);
      setModalMessage("NFT Transfer Submitted: " + JSON.stringify(tx, null, 2));
      setModalVisible(true);
    } catch (error: any) {
      console.error("NFT Transfer failed:", error);
      setModalMessage("Error: " + error.message);
      setModalVisible(true);
    }
  };

  const handleCloseModal = () => setModalVisible(false);

  const handleTransferNFT = async () => {
    if (!oktoClient.isLoggedIn()) {
      console.log("Not logged in");
      setModalMessage("Error: Not logged in");
      setModalVisible(true);
      return;
    }
    const transferParams = {
      caip2Id: networkId,
      collectionAddress: collectionAddress as Address,
      nftId,
      recipientWalletAddress: recipientWalletAddress as Address,
      amount: Number(amount),
      nftType: type as "ERC721" | "ERC1155",
    };

    console.log("NFT transfer params", transferParams);

    try {
      const result = await nftTransfer(oktoClient, transferParams);
      const formattedResult = JSON.stringify(result, null, 2);
      setModalMessage(`Execution Result:\n${formattedResult}`);
      setModalVisible(true);
    } catch (error: any) {
      console.error("Error transferring NFT:", error);
      setModalMessage("Error: " + error.message);
      setModalVisible(true);
    }
  };

  return (
    <div className="flex flex-col items-center bg-black p-6 rounded-lg shadow-lg w-full max-w-lg mx-auto">
      <h1 className="text-white text-2xl font-bold mb-6">Transfer NFT</h1>

      <input
        className="w-full p-2 mb-4 border border-gray-300 rounded text-black"
        value={networkId}
        onChange={(e) => setNetworkId(e.target.value)}
        placeholder="Enter Network ChainId"
      />

      <input
        className="w-full p-2 mb-4 border border-gray-300 rounded text-black"
        value={collectionAddress}
        onChange={(e) => setCollectionAddress(e.target.value)}
        placeholder="Enter Collection Address"
      />

      <input
        className="w-full p-2 mb-4 border border-gray-300 rounded text-black"
        value={nftId}
        onChange={(e) => setNftId(e.target.value)}
        placeholder="Enter NFT ID"
      />

      <input
        className="w-full p-2 mb-4 border border-gray-300 rounded text-black"
        value={recipientWalletAddress}
        onChange={(e) => setRecipientWalletAddress(e.target.value)}
        placeholder="Enter Recipient Wallet Address"
      />

      <input
        className="w-full p-2 mb-4 border border-gray-300 rounded text-black"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter Amount"
      />

      <input
        className="w-full p-2 mb-4 border border-gray-300 rounded text-black"
        value={type}
        onChange={(e) => setType(e.target.value)}
        placeholder="Enter NFT Type (nft or empty string)"
      />

      <button
        className="w-full p-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        onClick={handleTransferNFT}
      >
        Transfer NFT
      </button>

      <button
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={handleSubmit}
      >
        Create Transfer
      </button>

      {userOp && (
        <>
          <div className="w-full mt-4">
            <textarea
              className="w-full p-4 bg-gray-800 rounded text-white font-mono text-sm"
              value={userOpString}
              onChange={(e) => setUserOpString(e.target.value)}
              rows={10}
              style={{ resize: "vertical" }}
            />
          </div>
          <button
            className="w-full p-2 mt-4 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={handleSubmitUserOp}
          >
            Sign and Send Transaction
          </button>
        </>
      )}

      {modalVisible && (
        <div className="fixed text-white inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center max-h-screen">
          <div className="bg-black rounded-lg w-11/12 max-w-md p-6">
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <div className="text-white text-lg font-semibold">
                NFT Transfer Status
              </div>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={handleCloseModal}
              >
                &times;
              </button>
            </div>
            <div className="text-left max-h-[80vh] overflow-y-auto">
              <pre className="whitespace-pre-wrap">{modalMessage}</pre>
            </div>
            <div className="mt-4 text-right">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded"
                onClick={handleCloseModal}
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

export default TransferNFT;
