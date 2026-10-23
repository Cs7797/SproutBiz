/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { formatBalance } from "../utils/";
import detectEthereumProvider from "@metamask/detect-provider";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const MetaMask = ({ data }) => {
  const [hasProvider, setHasProvider] = useState(null);
  const initialState = { accounts: [], balance: "", chainId: "" };
  const [wallet, setWallet] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [amount, setAmount] = useState("");
  const [tip, setTip] = useState("");
  const [equity, setEquity] = useState(0);
  const [usdPrice, setUsdPrice] = useState("");
  console.log(hasProvider,error,errorMessage)
  useEffect(() => {
    const refreshAccounts = (accounts) => {
      if (accounts.length > 0) {
        updateWallet(accounts);
      } else {
        setWallet(initialState);
      }
    };
    // console.log(data)
    const refreshChain = (chainId) => {
      setWallet((wallet) => ({ ...wallet, chainId }));
    };

    const getProvider = async () => {
      const provider = await detectEthereumProvider({ silent: true });
      setHasProvider(Boolean(provider));

      if (provider) {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        refreshAccounts(accounts);
        window.ethereum.on("accountsChanged", refreshAccounts);
        window.ethereum.on("chainChanged", refreshChain);
      }
    };

    getProvider();

    return () => {
      window.ethereum?.removeListener("accountsChanged", refreshAccounts);
      window.ethereum?.removeListener("chainChanged", refreshChain);
    };
  }, []);

  const updateWallet = async (accounts) => {
    const balance = formatBalance(
      await window.ethereum?.request({
        method: "eth_getBalance",
        params: [accounts[0], "latest"],
      })
    );
    const chainId = await window.ethereum?.request({
      method: "eth_chainId",
    });
    setWallet({ accounts, balance, chainId });
  };

  const handleConnectMetamask = async () => {
    setLoading(true)
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setError(false);
      updateWallet(accounts);
      setLoading(false)
    } catch (err) {
      setError(true);
      setLoading(false)
      setErrorMessage(err.message);
    }
  };
  const convertToUsd = async () => {
    if (amount !== "") {
      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd`
        );
        const maticPriceInUsd = response.data["matic-network"].usd;
        const usdValue = parseFloat(amount) * maticPriceInUsd;
        setUsdPrice(usdValue.toFixed(2));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  const handleInvestmentChange = () => {
    const eqty = ((usdPrice / data.amountRequired) * data.equity).toFixed(4);

    setEquity(eqty);
  };
  useEffect(() => {
    convertToUsd();
  }, [amount]);
const navigate=useNavigate()
  useEffect(() => {
    if (data) {
      handleInvestmentChange();
    }
  }, [usdPrice]);
  console.log(usdPrice);
  const handleInvest = async () => {
    if (!wallet.accounts.length) return; // Ensure account is available
    setLoading(true)
    const total = parseInt(amount) + parseInt(tip);
    console.log(total);
    const valueInWei = total * 1000000000000000 + ""; // 1 Matic in wei

    try {
      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: wallet.accounts[0],
            to: "0x65Ed972De49e29fa75C99b29C42E2D6De566BC9a", // The recipient address
            value: valueInWei, // 1 Matic in wei
            // gasLimit: "0x5028",
            // maxPriorityFeePerGas: "0x3b9aca00",
            // maxFeePerGas: "0x2540be400",
          },
        ],
      });
      console.log(txHash);
      const res = await fetch(`/api/champaign/invested/${data._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invested: usdPrice, equity }),
      });
      const data1 = await res.json();
      if (data1.success == false) {
        setErrorMessage(data1.message);
        setLoading(false)
      } else {
        navigate('/profile')
      }
      console.log(data1);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="">
      <div className=" ">
        <form  onSubmit={handleInvest} className="bg-white space-y-2">
          <div className="">
            <label className="block font-semibold pb-2" htmlFor="amount">
              Amount:
            </label>
            <input
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
              id="amount"
              type="number"
              min={0}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter PolyGon Quantity"
              required
            />
          </div>
          <div className="">
            <label className="block font-semibold pb-2" htmlFor="tip">
              Tip:
            </label>
            <input
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
              id="tip"
              type="number"
              min={0}
              value={tip}
              onChange={(e) => setTip(e.target.value)}
              placeholder="Enter tip"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block font-semibold pb-2" htmlFor="equity">
              Equity:
            </label>
            <input
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
              id="equity"
              type="text"
              value={equity}
              disabled
              placeholder="Calculated equity"
            />
          </div>
          {wallet.accounts.length < 1 && (
            <div className="">
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 mt-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                disabled={!hasProvider || loading}
                style={{
                  cursor: !hasProvider||loading ? "not-allowed" : "pointer",
                }}
                title={
                  !hasProvider
                    ? "You Must have MetaMask Installed on your Browser"
                    : ""
                   
                }
                onClick={handleConnectMetamask}
              >
              {loading?"Loading...":  "Connect MetaMask"}
              </button>
              {!hasProvider && <p className="text-red-600 pt-2">Please Install MetaMask:  <a className="text-blue-700 hover:underline" target="_blank" href="https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?pli=1">Click here</a> </p> }
            </div>
          )}
          {wallet.accounts.length > 0 && (
            <div className="">
              <button
                className="bg-blue-500 mt-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
               
                disabled={loading}
              >
               {loading?"Loading..":" Invest Now"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default MetaMask;
