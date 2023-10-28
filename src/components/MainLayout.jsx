import React from 'react';
import { Routes, Route } from 'react-router-dom';
// import NodeNotifications from './toasts/NodeNotifications';
import toast, { Toaster, ToastBar } from 'react-hot-toast';
import Layout from './Wallet/components/Layout';
import Welcome from './Wallet/components/Welcome';
import WalletInfo from './Wallet/pages/WalletInfo';
import BagpipesFlowRoute from '../routes/BagpipesFlowRoute';
import TransactionMain from './Bagpipes/CustomNodes/TransactionReview/TransactionMain';
import ReactTestFlow from '../ReactTestFlow';
import Lab from '../pages/Lab/Lab';
import useAppStore from '../store/useAppStore';
import ThemeContext from '../contexts/ThemeContext';
import './toasts/toast.scss';

function MainLayout({ children }) {
    const { theme } = React.useContext(ThemeContext);

    // const { toastPosition } = useAppStore(state => ({
    //     toastPosition: state.toastPosition,
    //   }));
  return  (
        <>
        {/* <Toaster /> */}
        <Toaster
            position="top-left"

            containerStyle={{ position: 'absolute' }} 
            toastOptions={{
                className: 'toast-styles',
                style: {
                    background: '#fff00', // This seems like an incorrect color value. Ensure it's valid.
                    padding: 0,
                    minWidth: "200px",
                    transition: "all 0.5s ease-out",
                    zIndex: 100000,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between", // This will push the elements to the opposite ends
                    borderRadius: "8px",
        },
    }}
> 
    {(t) => (
        <ToastBar toast={t}>
            {({ icon, message }) => (
                <div className={` toast-container ${theme}`}>
                    <div className="toast-content">
                        {icon}
                        {message}
                    </div>
                    {t.type !== 'loading' && (
                        <button className='toast-button' onClick={() => toast.dismiss(t.id)}>x</button>
                    )}
                </div>
            )}
        </ToastBar> 
    )}
</Toaster>


      {/* <NodeNotifications /> */}
      <Routes>
            <Route element={<Layout />} path='/' >
            <Route
                element={<Welcome />}
                index
              />
              <Route
                  element={<Welcome />}
                  index
                />
                <Route
                  element={<Welcome />}
                  path='/welcome'
                />
                <Route
                  element={<WalletInfo />}
                  path='/wallet-info'
                />
                    {/* <Route
                  element={<Builder />}
                  path='/builder'
                /> */}
                  <Route
                  element={<BagpipesFlowRoute />}
                  path='/builder'
                />
                 <Route
                  element={<TransactionMain />}
                  path='/transaction/review'
                />
                  <Route element={<Lab />} path='/lab' />
  
                  <Route
                  element={<ReactTestFlow />}
                  path='/test-flow'
                />
                {/* <Route
                  element={<EvmWalletInfo />}
                  path='/evm-wallet-info'
                /> */}
              </Route>
            </Routes>
    </>
  );
}
  

  export default MainLayout;