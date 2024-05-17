import React, { useState, useEffect } from 'react';
import { FaBuildingColumns } from "react-icons/fa6";
import "./Wallet.css";
import { db } from '../../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { format } from "date-fns"


const Wallet = ({ initialBalance }) => {
  const [balance, setBalance] = useState(initialBalance || 50000); // Initial balance of $50,000
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
      // Retrieve balance from localStorage on component mount
      const savedBalance = localStorage.getItem('balance');
      if (savedBalance) {
          setBalance(parseFloat(savedBalance));
      }

      const fetchTransactions = async () => {
        const transactionRef = collection(db, 'TransactionApp');
        const snapshot = await getDocs(transactionRef);
        const transactionData = snapshot.docs.map(doc => doc.data());
        setTransactions(transactionData);
      };

      fetchTransactions();

  }, []);

  const formatTimestamp = (timestamp) => {
    if (timestamp && timestamp.seconds) {
      const date = new Date(timestamp.seconds * 1000);
      return format(date, 'MMM dd, yyyy HH:mm:ss');
    }
    return '';
  };


    return (
        <main>
            <div className="WalletContainer">
                <h1 className="text-3xl font-bold text-black">Wallet</h1>
                <div className="date mt-4">
                    <input type="date" className="border border-black px-4 py-2 rounded-lg"></input>
                </div>
                <div className="insights mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="transactions bg-white p-8 rounded-lg shadow-md">
                        <div className="middle mt-4">
                            <div className="left">
                                <FaBuildingColumns />
                                <h3 className="text-lg font-semibold text-black">Account Balance</h3>
                                <h1 id="balance" className="text-2xl font-bold text-black">${balance}</h1>
                            </div>
                        </div>
                        <div className="text-muted mt-4">Last 24 hours</div>
                    </div>
                </div>

                <div className="transactions mt-8">
                    <h2 className="text-xl font-bold mb-4 text-black">Recent Transactions</h2>
                    <table className="w-full bg-white rounded-lg shadow-md">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Account Number</th>
                                <th className="px-4 py-2">Amount</th>
                                <th className="px-4 py-2">Transaction Cost</th>
                                <th className="px-4 py-2">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((transaction, index) => (
                                <tr key={index}>
                                    <td className="border px-4 py-2 text-black">{transaction.name}</td>
                                    <td className="border px-4 py-2 text-black">{transaction.accountnumber}</td>
                                    <td className="border px-4 py-2 text-black">{transaction.amount}</td>
                                    <td className="border px-4 py-2 text-black">{transaction.transactionCost}</td>
                                    <td className="border px-4 py-2 text-black">{formatTimestamp(transaction.timestamp)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
};

export default Wallet;
