import React, { useState, useEffect } from 'react';
import { FaBuildingColumns } from "react-icons/fa6";
import "./GroupContacts.css";
import { db } from '../../../firebase';
import {  addDoc, collection } from 'firebase/firestore';



const GroupContacts = () => {
    const [balance, setBalance] = useState(50000); // Initial balance of $50,000
    const [contacts, setContacts] = useState([]);
    const [groups, setGroups] = useState([]); // State variable to store created groups
    const [groupName, setGroupName] = useState('');
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [showContactForm, setShowContactForm] = useState(false);
    const [showGroupForm, setShowGroupForm] = useState(false);
    const [showSendToGroupForm, setShowSendToGroupForm] = useState(false);
    const [sendAmount, setSendAmount] = useState(0);
    const [transactionSuccess, setTransactionSuccess] = useState(false);
    const [selectedGroups, setSelectedGroups] = useState([]);

    useEffect(() => {
        // Retrieve balance from localStorage on component mount
        const savedBalance = localStorage.getItem('balance');
        if (savedBalance) {
            setBalance(parseFloat(savedBalance));
        }

        // Retrieve contacts from localStorage on component mount
        const savedContacts = JSON.parse(localStorage.getItem('contacts'));
        if (savedContacts) {
            setContacts(savedContacts);
        }

        // Retrieve groups from localStorage on component mount
        const savedGroups = JSON.parse(localStorage.getItem('groups'));
        if (savedGroups) {
            setGroups(savedGroups);
        }
    }, []);

    const handleAddContact = () => {
        setShowContactForm(true);
    };

    const handleCreateGroup = () => {
        setShowGroupForm(true);
    };

    const handleContactSubmit = (event) => {
        event.preventDefault();
        const name = event.target.name.value;
        const accountNumber = event.target.accountNumber.value;

        // Validate inputs
        if (!name || !accountNumber || isNaN(accountNumber) || accountNumber.length !== 6) {
            alert('Please fill in a valid name and 6-digit account number.');
            return;
        }

        // Store contact in local storage
        const newContact = { name, accountNumber };
        const updatedContacts = [...contacts, newContact];
        setContacts(updatedContacts);
        localStorage.setItem('contacts', JSON.stringify(updatedContacts));

        // Clear form fields
        event.target.reset();
        setShowContactForm(false); // Hide the contact form after submission
    };

    const handleGroupNameChange = (event) => {
        setGroupName(event.target.value);
    };

    const handleCheckboxChange = (event) => {
        const groupId = event.target.value;
        const isChecked = event.target.checked;

        if (isChecked) {
            setSelectedGroups([...selectedGroups, groupId]);
        } else {
            setSelectedGroups(selectedGroups.filter(id => id !== groupId));
        }
    };

    const handleGroupSubmit = (event) => {
        event.preventDefault();

        // Store group in local storage
        const newGroup = { name: groupName, contacts: selectedContacts };
        const updatedGroups = [...groups, newGroup];
        setGroups(updatedGroups);
        localStorage.setItem('groups', JSON.stringify(updatedGroups));

        // Clear form fields
        setGroupName('');
        setSelectedContacts([]);
        setShowGroupForm(false); // Hide the group creation form after submission
    };

    const handleSendToGroupSubmit = async(event) => {
        event.preventDefault();

        // Calculate total transaction charge for all selected groups
        let totalTransactionCharge = 0;
        selectedGroups.forEach(groupId => {
            const group = groups[groupId];
            group.contacts.forEach(contactId => {
                const amount = sendAmount;
                if (amount <= 1000) {
                    totalTransactionCharge += 10;
                } else if (amount <= 10000) {
                    totalTransactionCharge += 15;
                } else {
                    totalTransactionCharge += 20;
                }
            });
        });

        // Check if balance is sufficient for the transaction
        const totalAmountToSend = selectedGroups.length * sendAmount;
        if (totalAmountToSend + totalTransactionCharge > balance) {
            alert('Insufficient funds.');
            return;
        }

        // Deduct total transaction charge from balance
        const newBalance = balance - totalAmountToSend - totalTransactionCharge;

        // Check if the new balance is negative
        if (newBalance < 0) {
            alert('Insufficient funds to cover transaction costs.');
            return;
        }

        // Update balance
        setBalance(newBalance);
        setTransactionSuccess(true);

        // Update localStorage with new balance
        localStorage.setItem('balance', newBalance.toString());

        const transactionRef = collection(
            db,"TransactionApp"
        )
    
        await addDoc(transactionRef,{
            name: selectedGroups,
            amount: totalAmountToSend,
        });

        // Display transaction success message
        alert(`Transaction successful!\nAmount sent to selected group(s): $${sendAmount}\nTotal transaction charge: $${totalTransactionCharge}\nNew Balance: $${newBalance}`);

        // Reset form
        setSendAmount(0);
        setSelectedGroups([]);
        setShowSendToGroupForm(false);
    };

    return (
        <main className="GroupContactsContainer h-full">
            <h1 className="text-3xl font-bold text-black">Contacts</h1>
            <div className="date mt-4">
                <input type="date" className="border border-black px-4 py-2 rounded-lg"></input>
            </div>

            <div className="insights mt-8 flex flex-wrap">
                <div className="transactions bg-white p-8 rounded-lg shadow-md flex-1">
                    <div className="middle mt-4">
                        <div className="left">
                            <FaBuildingColumns></FaBuildingColumns>
                            <h3 className="text-lg font-semibold text-black">Account Balance</h3>
                            <h1 id="balance" className="text-2xl font-bold text-black">${balance}</h1>
                        </div>
                    </div>
                    <div className="text-muted mt-4">Last 24 Hours</div>
                </div>
            </div>

            <button id="addContactBtn" onClick={handleAddContact} className="bg-cyan-900 hover:bg-teal-500 text-white font-bold py-2 px-4 rounded mt-8">Add New Contact</button>

            {showContactForm && (
                <form onSubmit={handleContactSubmit}>
                    <input className=" mt-4 mr-2 py-2 px-2 border" type="text" name="name" placeholder="Contact Name" />
                    <input className=" mt-4 mr-2 py-2 px-2 border" type="text" name="accountNumber" placeholder="Account Number" />
                    <button id="submit-btn" type="submit " className="bg-cyan-900 hover:bg-teal-500 text-white py-2 px-2 rounded mt-4">Submit</button>
                </form>
            )}

            {/* Contacts table */}
            <table>
                <thead>
                    <tr >
                        <th>Name</th>
                        <th>Account Number</th>
                    </tr>
                </thead>
                <tbody>
                    {contacts.map((contact, index) => (
                        <tr key={index}>
                            <td>{contact.name}</td>
                            <td>{contact.accountNumber}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button className="bg-cyan-900 hover:bg-teal-500 text-white font-bold py-2 px-4 rounded mt-2" onClick={handleCreateGroup}>Create Group</button>

            {showGroupForm && (
                <form onSubmit={handleGroupSubmit}>
                    <input className=" mt-4 mr-2 py-2 px-2 border" type="text" value={groupName} onChange={handleGroupNameChange} placeholder="Group Name" />
                    {contacts.map((contact, index) => (
                        <div key={index}>
                            <label>
                                <input type="checkbox" value={index} onChange={handleCheckboxChange} />
                                {contact.name}
                            </label>
                        </div>
                    ))}
                    <button className="bg-cyan-900 hover:bg-teal-500 text-white font-bold py-2 px-4 rounded mt-2" type="submit">Create</button>
                </form>
            )}

            {/* Display created groups */}
            {groups.length > 0 && (
                <div>
                    <b><h2>Created Groups</h2></b>
                    <ul>
                        {groups.map((group, index) => (
                            <li key={index}>
                                <b><h3>{group.name}</h3></b>
                                <ul>
                                    {group.contacts.map((contactId, index) => (
                                        <li key={index}>{contacts[contactId].name}</li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {/* Button to send money to group */}
            <button className="bg-cyan-900 hover:bg-teal-500 text-white font-bold py-2 px-4 rounded mt-2" onClick={() => setShowSendToGroupForm(true)}>Send Money to Group</button>

            {/* Form to send money to group */}
            {showSendToGroupForm && (
                <form onSubmit={handleSendToGroupSubmit}>
                    <input type="number" value={sendAmount} onChange={(e) => setSendAmount(e.target.value)} placeholder="Amount to Send" className="mt-4 mr-2 py-2 px-2 border" />
                    <h3>Select Groups:</h3>
                    {groups.map((group, index) => (
                        <div key={index}>
                            <label>
                                <input type="checkbox" value={index} onChange={handleCheckboxChange} />
                                {group.name}
                            </label>
                        </div>
                    ))}
                    <button className="bg-cyan-900 hover:bg-teal-500 text-white font-bold py-2 px-4 rounded mt-2" type="submit">Send</button>
                </form>
            )}

            {/* Display transaction success message */}
            {transactionSuccess && (
                <div className="notification mt-4 text-green-600 font-bold">
                    Transaction successful!
                </div>
            )}
        </main>
    );
};

export default GroupContacts;
