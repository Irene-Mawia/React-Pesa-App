import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import Dropdown from 'react-dropdown';
import { FaBuildingColumns, FaMoneyBills } from "react-icons/fa6";
import { db } from '../../firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import 'react-dropdown/style.css';

export default function SendMoney() {
    const [formData, setFormData] = useState({
        receiver: '',
        accountnumber: '',
        amount: ''
    });
    const [balance, setBalance] = useState(50000);
    const [sendAmount, setSendAmount] = useState(0);
    const [transactionSuccess, setTransactionSuccess] = useState(false);
    const [convertedAmount, setConvertedAmount] = useState('');
    const [selectedCurrency, setSelectedCurrency] = useState('USD');
    const [currencyOptions, setCurrencyOptions] = useState([]); // Store available currencies

    useEffect(() => {
        const savedBalance = localStorage.getItem('balance');
        if (savedBalance) {
            setBalance(parseFloat(savedBalance))
        }

        fetchCurrencyOptions(); // Fetch available currencies
    }, []);

    // Fetch available currencies
    const fetchCurrencyOptions = async () => {
        try {
            const response = await Axios.get('https://open.er-api.com/v6/latest');
            const data = response.data;
            const currencies = Object.keys(data.rates); // Extract currency codes
            setCurrencyOptions(currencies);
        } catch (error) {
            console.error('Error fetching currency options:', error);
        }
    };

    // Update form input state
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { receiver, accountnumber, amount } = formData;

        // Check if any field is empty
        if (!receiver || !accountnumber || !amount) {
            alert('Please fill in all fields.');
            return;
        }

        // Convert amount to number
        const sendAmount = parseFloat(amount);

        // Check if send amount exceeds balance
        if (sendAmount > balance) {
            alert('Insufficient funds.');
            return;
        }

        // Calculate transaction charge based on send amount
        let transactionCharge = 0;
        if (sendAmount <= 1000) {
            transactionCharge = 10;
        } else if (sendAmount <= 10000) {
            transactionCharge = 15;
        } else {
            transactionCharge = 20;
        }

        // Deduct transaction charge from balance
        const newBalance = balance - sendAmount - transactionCharge;

        // Check if the new balance is negative
        if (newBalance < 0) {
            alert('Insufficient funds to cover transaction costs.');
            return;
        }

        // Update balance and send amount
        setBalance(newBalance);
        setSendAmount(sendAmount);
        setTransactionSuccess(true);

        // Update localStorage with new balance
        localStorage.setItem('balance', newBalance.toString());


        const transactionRef = collection(
            db, "TransactionApp"
        )

        await addDoc(transactionRef, {
            name: receiver,
            accountnumber: accountnumber,
            amount: sendAmount,
            transactionCost: transactionCharge,
            timestamp: serverTimestamp(),
        });

        // Reset form
        setFormData({ receiver: '', accountnumber: '', amount: '' });

        // Display transaction details including transaction charge
        alert(`Transaction successful!\nAmount sent: $${sendAmount}\nTransaction charge: $${transactionCharge}\nNew Balance: $${newBalance}`);
    };

    // Function to handle currency conversion
    const handleConvertCurrency = async () => {
        try {
            const response = await Axios.get('https://open.er-api.com/v6/latest');
            const data = response.data;
            const conversionRate = data.rates[selectedCurrency];
            const convertedValue = (parseFloat(formData.amount) * conversionRate).toFixed(2);
            setConvertedAmount(convertedValue);
        } catch (error) {
            console.error('Error converting currency:', error);
        }
    };

    return (
        <main className="SendMoneyContainer bg-slate-100">
            <div className="p-3">
                <h1 className="text-3xl font-bold text-black">Send Money</h1>
                <div className="date mt-4">
                    <input
                        type="date"
                        className="border border-black px-4 py-2 rounded-lg"
                    ></input>
                </div>

                <div className="insights mt-8 flex flex-wrap">
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
                                <FaMoneyBills />
                                <h3 className="text-lg font-semibold text-black">
                                    Send Money
                                </h3>
                                <h1 id="Send Money" className="text-2xl font-bold text-blank">
                                    ${sendAmount}
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
                    <h2 className="text-xl font-bold mb-4 text-black">Send Money Form</h2>
                    <form
                        onSubmit={handleSubmit}
                        id="send-money-form"
                        className="bg-white rounded-lg shadow-md p-8">
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
                                    className="bg-white border border-gray-400 px-4 py-2 rounded-lg w-full"></input>
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
                                    className="bg-white border border-gray-400 px-4 py-2 rounded-lg w-full"></input>
                            </div>
                            <div>
                                <label htmlFor="amount" className="block text-black">
                                    Amount to Send
                                </label>
                                <input
                                    type="text"
                                    id="amount"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleInputChange}
                                    className="bg-white border border-gray-400 px-4 py-2 rounded-lg w-full"></input>
                            </div>
                            <div>
                                <label htmlFor="amount" className="block text-black">
                                    Convert to:
                                </label>
                                <Dropdown
                                    options={currencyOptions} // Populate options dynamically
                                    onChange={(option) => setSelectedCurrency(option.value)}
                                    value={selectedCurrency}
                                    placeholder="Select currency" />
                            </div>
                            
                                <div>
                                    <button
                                        type="submit"
                                        id="send-money-btn"
                                        className="btn bg-cyan-900 hover:bg-teal-500 text-white px-4 py-2  rounded-full">
                                        Send Money
                                    </button>
                                </div>
                                    <div>
                                    <button
                                        type="button"
                                        onClick={handleConvertCurrency}
                                        className="btn bg-cyan-900 hover:bg-teal-500 text-white px-4 py-2  ml-31 rounded-full">
                                        Convert
                                    </button>
                                    <p>{convertedAmount && <p>Amount to send in {selectedCurrency}: {convertedAmount}</p>}</p>
                                </div>
                            
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}



