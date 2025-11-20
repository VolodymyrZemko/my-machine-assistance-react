import React, { useState } from 'react';
import './App.css';
import machines from './data/machines.json';
import { UserProvider } from './context/UserContext.jsx';
import { useMachineRoute } from './modules/routing/useMachineRoute.js';
import { MachineDetail } from './components/machines/MachineDetail.jsx';
import { MyAccountMachine } from './components/machines/MyAccountMachine.jsx';
import { OLMachine } from './components/machines/OLMachine.jsx';
import { VLMachine } from './components/machines/VLMachine.jsx';
import { MilkMachine } from './components/machines/MilkMachine.jsx';
import { Tabs, TabContent } from './components/tabs/Tabs.jsx';
import { Footer } from './components/layout/Footer.jsx';

const TAB_ITEMS = [
  { key: 'my-account', label: 'My Account Machine', render: () => <MyAccountMachine /> },
  { key: 'ol', label: 'OL', render: () => <OLMachine /> },
  { key: 'vl', label: 'VL', render: () => <VLMachine /> },
  { key: 'milk', label: 'Milk', render: () => <MilkMachine /> }
];

export default function App() {
  const [active, setActive] = useState('my-account');
  const { machineId, closeMachine } = useMachineRoute();
  const activeMachine = machineId ? machines.find(m => m.id === machineId) : null;

  return (
    <UserProvider>
      <div className="app-wrapper minimal">
        {!activeMachine && (
          <>
            <Tabs items={TAB_ITEMS} active={active} onChange={setActive} />
            <TabContent items={TAB_ITEMS} active={active} />
          </>
        )}
        {activeMachine && (
          <div className="tab-panel">
            <MachineDetail machine={activeMachine} onClose={closeMachine} />
          </div>
        )}
        <Footer text={activeMachine ? 'Viewing machine detail' : 'Tabs: My Account / OL / VL / Milk'} />
      </div>
    </UserProvider>
  );
}

