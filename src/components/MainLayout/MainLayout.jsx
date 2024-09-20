import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
// import NodeNotifications from './toasts/NodeNotifications';
import toast, { Toaster, ToastBar } from 'react-hot-toast';
import Layout from '../Wallet/components/Layout';
import Welcome from '../Welcome/Welcome';
import WalletInfo from '../Wallet/pages/WalletInfo';
import EvmWalletInfo from '../Wallet/pages/EvmWalletInfo';
import BagpipesFlowRoute from '../../routes/BagpipesFlowRoute';
import TransactionMain from '../Bagpipes/CustomNodes/TransactionReview/TransactionMain';
import CreateFromTemplate from '../Bagpipes/TemplateFeatures/CreateFromTemplate';
import ReactTestFlow from '../../ReactTestFlow';
import Sidebar from '../Bagpipes/Sidebar/Sidebar';
import Header from '../Header';
import Lab from '../../pages/Lab/Lab';
import CommunityPages from '../../pages/PublicPages/CommunityPages';
import CommunityPage from '../../pages/PublicPages/CommunityPage/CommunityPage';
import CreatorPage from '../../pages/PublicPages/CreatorPage/CreatorPage';
import CreatorsPage from '../../pages/PublicPages/CreatorsPage/CreatorsPage';
import BlinkBuilder from '../../pages/PublicPages/Blinks/BlinkBuilder/';
import ScenarioInfo from '../../pages/Lab/Scenario';
import Parachains from '../../pages/Parachains/Parachains';
import ThemeContext from '../../contexts/ThemeContext';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useTippy, usePanelTippy } from '../../contexts/tooltips/TippyContext';
import Settings from '../../pages/Settings/Settings';


import '../toasts/toast.scss';
// import '../index.css';
import './MainLayout.scss';

function MainLayout({ children }) {
    const { tippyProps } = useTippy();
    const { panelTippyProps, hidePanelTippy } = usePanelTippy();

    const { theme } = React.useContext(ThemeContext);
    console.log('document', document); // Add this line to debug'
    // const { toastPosition } = useAppStore(state => ({
    //     toastPosition: state.toastPosition,
    //   }));
  return  (
    
  <div className={`main-layout ${theme === 'dark' ? '-dark' : '-light'}`}>

    {tippyProps.visible && (
        <Tippy
          appendTo={tippyProps.reference || (() => document.body)}
          content={tippyProps.content}
          interactive={true}
          placement={tippyProps.placement}
          visible={tippyProps.visible}
          theme="light"
          hideOnClick="false"
        >
          <div style={{ position: 'fixed', left: tippyProps.position.x, top: tippyProps.position.y }}></div>
        </Tippy>
      )}

        {/* <Toaster /> */}
        <Toaster
        position="top-left"
        containerStyle={{ position: 'absolute' }} 
        toastOptions={{
            className: 'toast-styles',
            style: {
                background: '#fff00', 
                padding: 0,
                minWidth: "200px",
                transition: "all 0.5s ease-out",
                zIndex: 100000,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between", 
                overflow: "hidden",
            },
        }}
    >
        {(t) => (
            <ToastBar toast={t}>
                {({ icon, message }) => (
                    <div className={`toast-container p-1 ${theme}`}>
                        <div className="toast-content pr-2">
                            {icon}
                            <span className="toast-message pr-2">{message}</span>
                        </div>
                        {t.type !== 'loading' && (
                            <button className='toast-button' onClick={() => toast.dismiss(t.id)}>x</button>
                        )}
                    </div>
                )}
            </ToastBar>
        )}
    </Toaster>

    {/* <Sidebar /> */}

        
        {/* <Header /> */}
            <Routes>
                {/* Root Route */}
                {/* <Route path="/" element={<Layout />}> */}
                    {/* Nested Routes */}
                    <Route index element={<Welcome />} />
                    <Route path="welcome" element={<Welcome />} />
                    <Route path="builder" element={<BagpipesFlowRoute />} />

                    <Route path="pages" element={<CommunityPages />} />
                    <Route path="/pages/:communityName" element={<CommunityPage />} />
                    <Route path="/creators/:creatorId" element={<CreatorPage />} /> 
                    <Route path="/creators" element={<CreatorsPage />} /> 

                    <Route path="lab" element={<Lab />} />
                    <Route path="/scenario/:scenarioId" element={<ScenarioInfo />} />
                    <Route path="wallet-info" element={<WalletInfo />} />
                    <Route path="transaction/review" element={<TransactionMain />} />
                    <Route path="parachains" element={<Parachains />} />
                    <Route path="test-flow" element={<ReactTestFlow />} />
                    <Route path="evm-wallet-info" element={<EvmWalletInfo />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path ="blinks" element={<BlinkBuilder />} />




                {/* </Route> */}
                {/* Other Top-Level Routes */}
                <Route path="/create" element={<CreateFromTemplate />} />
            </Routes>
            <Outlet />
      
</div>
  );
}
  
export default MainLayout;