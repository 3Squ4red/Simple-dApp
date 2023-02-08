import logo from "./logo.svg";
import "./App.css";
import React, { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import { address, abi } from "./contract";
import { ethers } from "ethers";

function App() {
  const [userAddress, setUserAddress] = useState("");
  const [isGoerli, setIsGoerli] = useState(false);
  const [simpleContract, setSimpleContract] = useState();
  const [newMessage, setNewMessage] = useState("");
  const [contractMessage, setContractMessage] = useState("");

  useEffect(() => {
    connectWallet();
  }, []);

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Please install metamask");
        return;
      }

      const chainId = await ethereum.request({ method: "eth_chainId" });
      if (chainId === "0x5") {
        setIsGoerli(true);

        // getting the account
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        setUserAddress(accounts[0]);

        // getting the contract
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(address, abi, signer);
        setSimpleContract(contract);

        // getting all the proposals
        const message = await contract.getMessage();
        console.log("the message is: ", message);
        setContractMessage(message);

        // Account and network listeners
        window.ethereum.on("accountsChanged", function (accounts) {
          setUserAddress(accounts[0]);
        });

        window.ethereum.on("chainChanged", function (networkId) {
          setIsGoerli(networkId === "0x5");
        });
      } else {
        alert("please switch to Goerli network");
        return;
      }
    } catch (error) {
      console.error("ERR connecting to MetaMask", error.message);
    }
  };

  const setMessage = async (e) => {
    e.preventDefault();
    if (!simpleContract) return;

    try {
      const tx = await simpleContract.setMessage(newMessage);
      await tx.wait();

      setContractMessage(newMessage);

      alert("The message was changed successfully!");
      setNewMessage("");
    } catch (e) {
      console.error(e.message);
      alert(e.message);
    }
  };

  return (
    <div>
      {userAddress === "" ? (
        <center>
          <button className="button" onClick={connectWallet}>
            Connect Wallet
          </button>
        </center>
      ) : isGoerli ? (
        <div className="App">
          <h1>Simple dApp</h1>
          <h3>{contractMessage}</h3>
          <form>
            <TextField
              id="outlined-basic"
              label="Message"
              variant="outlined"
              style={{ margin: "0px 5px" }}
              size="small"
              placeholder="Enter a message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={setMessage}>
              Set Message
            </Button>
          </form>
        </div>
      ) : (
        <div>
          <div className="flex flex-col justify-center items-center mb-20 font-bold text-2xl gap-y-3">
            Please switch to the Goerli testnet and then reload{" "}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
