// import React from 'react';
// import { CheckCircle2, XCircle, DollarSign } from 'lucide-react';

// const PaymentTabs = ({ activePaymentTab, setActivePaymentTab,paidCount, unpaidCount }) => {
//     const paymentTabs = [
//         { 
//             id: 'paid', 
//             label: 'Paid', 
//             icon: CheckCircle2,
//             count: paidCount,
//             bgActive: 'bg-gradient-to-r from-green-400 to-emerald-500',
//             textActive: 'text-white',
//             bgInactive: 'hover:bg-green-50',
//             textInactive: 'text-green-600 hover:text-green-700'
//         },
//         { 
//             id: 'unpaid', 
//             label: 'Unpaid',
//             icon: XCircle,
//             count: unpaidCount,
//             bgActive: 'bg-gradient-to-r from-red-400 to-rose-500',
//             textActive: 'text-white',
//             bgInactive: 'hover:bg-red-50',
//             textInactive: 'text-red-600 hover:text-red-700'
//         }
//     ];

//     return (
//         <div className="border-b border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50">
//             <div className="px-6 py-3">
//                 <div className="flex items-center space-x-3 mb-2">
//                     <DollarSign className="w-5 h-5 text-orange-600" />
//                     <h3 className="text-lg font-semibold text-slate-800">Payment Status</h3>
//                 </div>
//                 <nav className="flex space-x-2">
//                     {paymentTabs.map((tab) => {
//                         const Icon = tab.icon;
//                         const isActive = activePaymentTab === tab.id;
                        
//                         return (
//                             <button
//                                 key={tab.id}
//                                 onClick={() => setActivePaymentTab(tab.id)}
//                                 className={`relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md ${
//                                     isActive
//                                         ? `${tab.bgActive} ${tab.textActive} shadow-md`
//                                         : `bg-white ${tab.textInactive} ${tab.bgInactive} border border-slate-200`
//                                 }`}
//                             >
//                                 <Icon className="w-4 h-4" />
//                                 <span>{tab.label}</span>
//                                 <span className={`inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold rounded-full min-w-[20px] ${
//                                     isActive 
//                                         ? 'bg-white/20 text-white' 
//                                         : 'bg-slate-100 text-slate-600'
//                                 }`}>
//                                     {paymentCounts[tab.id] || 0}
//                                 </span>
//                             </button>
//                         );
//                     })}
//                 </nav>
//             </div>
//         </div>
//     );
// };

// export default PaymentTabs;


// src/components/PaymentManagement/PaymentTabs.js
import React from 'react';
import { CheckCircle2, XCircle, DollarSign } from 'lucide-react';

const PaymentTabs = ({ activePaymentTab, setActivePaymentTab, paidCount, unpaidCount }) => {
  // Pre-attach the counts to each tab object for easy rendering
  const paymentTabs = [
    {
      id: 'paid',
      label: 'Paid',
      icon: CheckCircle2,
      count: paidCount,                             // ← use paidCount prop
      bgActive: 'bg-gradient-to-r from-green-400 to-emerald-500',
      textActive: 'text-white',
      bgInactive: 'hover:bg-green-50',
      textInactive: 'text-green-600 hover:text-green-700'
    },
    {
      id: 'unpaid',
      label: 'Unpaid',
      icon: XCircle,
      count: unpaidCount,                           // ← use unpaidCount prop
      bgActive: 'bg-gradient-to-r from-red-400 to-rose-500',
      textActive: 'text-white',
      bgInactive: 'hover:bg-red-50',
      textInactive: 'text-red-600 hover:text-red-700'
    }
  ];

  return (
    <div className="border-b border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50">
      <div className="px-6 py-3">
        <div className="flex items-center space-x-3 mb-2">
          <DollarSign className="w-5 h-5 text-orange-600" />
          <h3 className="text-lg font-semibold text-slate-800">Payment Status</h3>
        </div>
        <nav className="flex space-x-2">
          {paymentTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activePaymentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActivePaymentTab(tab.id)}
                className={`relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md ${
                  isActive
                    ? `${tab.bgActive} ${tab.textActive} shadow-md`
                    : `bg-white ${tab.textInactive} ${tab.bgInactive} border border-slate-200`
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                <span
                  className={`inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold rounded-full min-w-[20px] ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.count /* ← now renders paidCount or unpaidCount */}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default PaymentTabs;
