// 'use client';

// import React from 'react';
// import styles from './patinaSelector.module.css';

// interface PatinaOption {
//   name: string;
//   color: string;
//   description?: string;
// }

// interface PatinaSelectorProps {
//   selectedPatina: string;
//   onPatinaChange: (patina: string) => void;
// }

// const PatinaSelector: React.FC<PatinaSelectorProps> = ({ 
//   selectedPatina, 
//   onPatinaChange 
// }) => {
//   // Patina options based on the reference design
//   const patinaOptions: PatinaOption[] = [
//     { name: 'Alpine Stone', color: '#D4C4A8', description: 'Light cream stone finish' },
//     { name: 'Aged Stone', color: '#B8A082', description: 'Weathered natural stone' },
//     { name: 'Charcoal', color: '#5A5A5A', description: 'Dark charcoal finish' },
//     { name: 'Limestone', color: '#E6DCC6', description: 'Classic limestone color' },
//     { name: 'Sandstone', color: '#C9B299', description: 'Warm sandstone tone' },
//     { name: 'Slate Gray', color: '#708090', description: 'Cool slate gray' },
//     { name: 'Terra Cotta', color: '#B87333', description: 'Earthy terra cotta' },
//     { name: 'Antique White', color: '#F5F5DC', description: 'Soft antique white' },
//     { name: 'Weathered Bronze', color: '#8B7355', description: 'Bronze patina finish' },
//     { name: 'Natural Stone', color: '#A0A0A0', description: 'Natural stone gray' },
//     { name: 'Moss Green', color: '#8FBC8F', description: 'Subtle moss green' },
//     { name: 'Rust', color: '#B7410E', description: 'Oxidized rust finish' }
//   ];

//   return (
//     <div className={styles.patinaSelector}>
//       <div className={styles.selectorHeader}>
//         <h3 className={styles.selectorTitle}>Select Patina</h3>
//         <span className={styles.selectedPatina}>{selectedPatina}</span>
//       </div>
      
//       <div className={styles.patinaGrid}>
//         {patinaOptions.map((option) => (
//           <button
//             key={option.name}
//             className={`${styles.patinaOption} ${
//               selectedPatina === option.name ? styles.selected : ''
//             }`}
//             onClick={() => onPatinaChange(option.name)}
//             title={`${option.name} - ${option.description}`}
//             aria-label={`Select ${option.name} patina`}
//           >
//             <div 
//               className={styles.patinaColor}
//               style={{ backgroundColor: option.color }}
//             />
//             <span className={styles.patinaName}>{option.name}</span>
//           </button>
//         ))}
//       </div>
      
//       <div className={styles.patinaNote}>
//         <p>
//           <strong>Note:</strong> Patina colors are representative. Actual finish may vary 
//           due to the handcrafted nature of cast stone. Contact us for physical samples.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default PatinaSelector;
