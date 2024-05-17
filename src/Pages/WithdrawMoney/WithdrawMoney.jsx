import React, { useState, useEffect } from 'react';
import "./WithdrawMoney.css";
import { FaBuildingColumns, FaMoneyBillTransfer } from "react-icons/fa6";
import { db } from '../../../firebase';
import {  addDoc, collection } from 'firebase/firestore';
 

export default function WithdrawMoney () {
    const [formData, setFormData] = useState({
        receiver: '',
        accountnumber: '',
        amount: ''
    });
    const [balance, setBalance] = useState(50000);
    const [withdrawAmount, setWithdrawAmount] = useState(0);
    const [transactionSuccess, setTransactionSuccess] = useState(false);

    useEffect(() => {
        const savedBalance = localStorage.getItem('balance');
        if (savedBalance) {
            setBalance(parseFloat(savedBalance));
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        const { receiver, accountnumber, amount } = formData;

        if (!receiver || !accountnumber || !amount) {
            alert('Please fill in all fields.');
            return;
        }

        const withdrawAmount = parseFloat(amount);

        if (withdrawAmount > balance) {
            alert('Insufficient funds.');
            return;
        }

        // Calculate transaction charge based on withdraw amount
    let transactionCharge = 0;
    if (withdrawAmount <= 1000) {
        transactionCharge = 10;
    } else if (withdrawAmount <= 10000) {
        transactionCharge = 15;
    } else {
        transactionCharge = 20;
    }

    // Deduct transaction charge from balance
    const newBalance = balance - withdrawAmount - transactionCharge;

    // Check if the new balance is negative
    if (newBalance < 0) {
        alert('Insufficient funds to cover transaction costs.');
        return;
    }

    // Update balance and withdraw amount
    setBalance(newBalance);
    setWithdrawAmount(withdrawAmount);
    setTransactionSuccess(true);

    // Update localStorage with new balance
    localStorage.setItem('balance', newBalance.toString());

    const transactionRef = collection(
        db,"TransactionApp"
    )

    await addDoc(transactionRef,{
        name: receiver,
        accountnumber: accountnumber,
        withdrawamount: withdrawAmount,
    });

    // Display transaction details including transaction charge
    alert(`Transaction successful!\nAmount withdrawn: $${withdrawAmount}\nTransaction charge: $${transactionCharge}\nNew Balance: $${newBalance}`);

    // Reset form
    setFormData({ receiver: '', accountnumber: '', amount: '' });
};

    return (
        <main className="WithdrawMoneyContainer">
            <div className="p-3">
                <h1 className="text-3xl font-bold text-black">Withdraw Money</h1>
                <div className="date mt-4">
                    <input
                        type="date"
                        className="border border-blank px-4 py-2 rounded-lg"
                    ></input>
                </div>

                <div className="insights mt-8 flex flex-wrap ">
                    <div className="transactions bg-white p-8 rounded-lg shadow-md flex-1">
                        <div className="middle mt-4">
                            <div className="left">
                                <FaBuildingColumns />
                                <h3 className="text-lg font-semibold text-black">
                                    Account Balance
                                </h3>
                                <h1 id="balance" className="text-2xl font-bold text-blank">
                                    ${balance}
                                </h1>
                            </div>
                        </div>
                        <div className="text-muted mt-4">Last 24 hours</div>
                    </div>
                    <div className="transaction bg-white p-8 rounded-lg shadow-md flex-1 ml-14">
                        <div className="middle mt-4">
                            <div className="left">
                                <FaMoneyBillTransfer />
                                <h3 className="text-lg font-semibold text-black">
                                    Withdraw Money
                                </h3>
                                <h1 id="Withdraw Money" className="text-2xl font-bold text-blank">
                                    ${withdrawAmount}
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>

                {transactionSuccess && (
                    <div className="notification mt-4 text-green-600 font-bold">
                        Transaction successful!
                    </div>
                )}

                <div className="transactions mt-8">
                    <h2 className="text-xl font-bold mb-4 text-black">Withdraw Money Form</h2>
                    <form
                        onSubmit={handleSubmit}
                        id="withdraw-money-form"
                        className="bg-white rounded-lg shadow-md p-8"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="receiver" className="block text-black">
                                    Receiver's Full Name
                                </label>
                                <input
                                    type="text"
                                    id="receiver"
                                    name="receiver"
                                    value={formData.receiver}
                                    onChange={handleInputChange}
                                    className="bg-white border border-gray-400 px-4 py-2 rounded-lg w-full"
                                ></input>
                            </div>
                            <div>
                                <label htmlFor="accountnumber" className="block text-black">
                                    Account Number
                                </label>
                                <input
                                    type="text"
                                    id="accountnumber"
                                    name="accountnumber"
                                    value={formData.accountnumber}
                                    onChange={handleInputChange}
                                    className="bg-white border border-gray-400 px-4 py-2 rounded-lg w-full"
                                ></input>
                            </div>
                            <div>
                                <label htmlFor="amount" className="block text-black">
                                    Amount to Withdraw
                                </label>
                                <input
                                    type="text"
                                    id="amount"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleInputChange}
                                    className="bg-white border border-gray-400 px-4 py-2 rounded-lg w-full"
                                ></input>
                            </div>
                        </div>
                        <button
                            type="submit"
                            id="withdraw-money-btn"
                            className="btn bg-cyan-900 text-white  hover:bg-teal-500 px-4 py-2 mt-4 rounded-full"
                        >
                            Withdraw Money
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}