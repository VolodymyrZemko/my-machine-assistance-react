import React, { useState } from 'react';
import './App.css'; // ensure component-level styles are loaded
import { UserProvider } from './context/UserContext.jsx';
import { Tabs, TabContent } from './components/tabs/Tabs.jsx';
import { MyAccountMachine } from './components/machines/MyAccountMachine.jsx';
import { OLMachine } from './components/machines/OLMachine.jsx';
import { VLMachine } from './components/machines/VLMachine.jsx';
import { MilkMachine } from './components/machines/MilkMachine.jsx';
import { Footer } from './components/layout/Footer.jsx';

function App() {
  // Keep App purely as a connector/orchestrator.
  const [activeTab, setActiveTab] = useState('my-account-machine');

  const tabItems = [
    { key: 'my-account-machine', label: 'My Account Machine', render: () => <MyAccountMachine /> },
    { key: 'ol-machine', label: 'OL Machine', render: () => <OLMachine /> },
    { key: 'vl-machine', label: 'VL Machine', render: () => <VLMachine /> },
    { key: 'milk-machine', label: 'Milk Machine', render: () => <MilkMachine /> },
  ];

  return (
    <UserProvider>
      <div className="app-wrapper">
        <Tabs active={activeTab} onChange={setActiveTab} items={tabItems} />
        <TabContent active={activeTab} items={tabItems} />
        <Footer />
      </div>
    </UserProvider>
  );
}

export default App;

