import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Wallet from "./Pages/Wallet/Wallet";
import SendMoney from "./Pages/SendMoney";
import WithdrawMoney from "./Pages/WithdrawMoney/WithdrawMoney";
import GroupContacts from "./Pages/GroupContacts/GroupContacts";
import Layout from "./Pages/Layout";


const App = () => {
  return (
    <BrowserRouter>
        <Routes>
        <Route path="/" element={<Layout />} > 
        <Route index element={<Wallet />} />
        <Route path="/send-money" element={<SendMoney />} />
        <Route path="/withdraw-money" element={<WithdrawMoney />} />
        <Route path="/Group-contacts" element={<GroupContacts />} />
        
        </Route>
        </Routes>

    </BrowserRouter>
  )
}

export default App