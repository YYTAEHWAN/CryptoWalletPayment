import React, { useContext } from 'react';
import MainHomePage from "./pages/MainLandingPage";
import MainBlockchainManagePage from "./pages/MainBlockchainManagePage";
import MainPaymentRecordsPage from "./pages/MainPaymentRecordsPage";
import MainMyInfoPage from "./pages/MainMyInfoPage";
import MainWalletViewPage from "./pages/MainWalletViewPage";
import MainEmptyPage from "./pages/MainEmptyPage";
import SignInFormPage from "./pages/SignInFormPage";
import SignUpFormPage from "./pages/SignUpFormPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserContext from './contexts/UserContext';
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

const queryClient = new QueryClient();

export default function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <UserContext.Provider value={{
          isLogin: false,
          consumer_or_not: undefined,
          email: "",
          id: "",
          password: "",
          phone_number: "",
          real_name: "",
          resident_registration_number: "",
          wallet_address: "",
        }}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<SignInFormPage />} />
              <Route path="/signup" element={<SignUpFormPage />} />
              <Route path="/main" element={<MainHomePage />} />
              <Route
                path="/BlockchainManage"
                element={<MainBlockchainManagePage />}
              />
              <Route path="/PaymentRecord" element={<MainPaymentRecordsPage />} />
              <Route path="/WalletView" element={<MainWalletViewPage />} />
              <Route path="/MyInfo" element={<MainMyInfoPage />} />
              <Route path="*" element={<MainEmptyPage />} />
            </Routes>
          </BrowserRouter>
        </UserContext.Provider>
      </div>
      <ReactQueryDevtools />
    </QueryClientProvider>

  );
}
