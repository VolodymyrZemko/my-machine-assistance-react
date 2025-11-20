// import React from 'react';
// import { Link } from 'react-router-dom';
// import { getMachinesByTechnology } from '../../data/machines.js';

// export function VLMachine() {
//   const vlMachines = getMachinesByTechnology('VL');
//   return (
//     <div>
//       <h2>Vertuo (VL) Machines</h2>
//       <ul className="machine-list">
//         {vlMachines.map(m => (
//           <li key={m.id} className="machine-item">
//             <Link to={`/machine/${m.id}`}>
//               <img src={m.img} alt={m.name} width={120} height={120} loading="lazy" />
//               <p>{m.name}</p>
//             </Link>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }


import React from 'react';
import { getMachinesByTechnology } from '../../data/machines.js';

export function VLMachine() {
  const vlMachines = getMachinesByTechnology('VL');
  return (
    <div>
      <h2>Vertuo (VL) Machines</h2>
      <ul className="machine-list">
        {vlMachines.map(m => (
          <li key={m.id} className="machine-item">
            <img src={m.img} alt={m.name} width={120} height={120} loading="lazy" />
            <p>{m.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
