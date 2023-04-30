import { useState, useEffect } from "react";

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [blockNumber, setBlockNumber] = useState(null);
  const [balance, setBalance] = useState(null);
  const apiKey = "YOUR_API_KEY";
  const walletAddress = "YOUR_WALLET_ADDRESS";

  useEffect(() => {
    fetch(`https://api.etherscan.io/api?module=proxy&action=eth_getBlockByNumber&tag=latest&boolean=true&apikey=${apiKey}`)
      .then(response => response.json())
      .then(data => setTransactions(data.result.transactions))
      .catch(error => console.log(error));
  }, [apiKey]);

  useEffect(() => {
    fetch(`https://api.etherscan.io/api?module=account&action=balance&address=${walletAddress}&tag=latest&apikey=${apiKey}`)
      .then(response => response.json())
      .then(data => data.result / 1000000000000000000)
      .then(data => setBalance(data))
      .catch(error => console.log(error));
  }, [apiKey]);

 useEffect(() => {
  const fetchLatestBlock = async () => {
    try {
      const response = await fetch(`https://api.etherscan.io/api?module=proxy&action=eth_blockNumber&apikey=${apiKey}`);
      if (response.ok) {
        const data = await response.json();
        setBlockNumber(parseInt(data.result, 16));
      }      
    } catch (error) {
      console.log(error);
    }
  };
  setInterval(fetchLatestBlock, 10000);
}, [blockNumber]);

 
  return (
    <div>
       <p> The Latest Block Number is: {blockNumber} </p>
       <br />
       <p> The Wallet Balance of : {walletAddress} is: {balance} ETH </p>
      {transactions.length ? (
        <div>
          <h1>Latest Transactions:</h1>
          <ul>
            {transactions.map((txn) => (
              <li key={txn.hash}>
                <p>Hash: {txn.hash}</p>
                <p>From: {txn.from}</p>
                <p>To: {txn.to}</p>
                <p>Value: {txn.value}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading transactions...</p>
      )}
    </div>
  );
}
