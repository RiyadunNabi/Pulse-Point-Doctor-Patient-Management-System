// import React from 'react';
// import { createPortal } from 'react-dom';
// import { X } from 'lucide-react';

// // 1. Add 'subtitle' to the props list here
// function Modal({ isOpen, onClose, title, subtitle, children, size = 'md' }) {
//   if (!isOpen) return null;

//   const sizeClasses = {
//     sm: 'max-w-md',
//     md: 'max-w-2xl',
//     lg: 'max-w-4xl',
//     xl: 'max-w-6xl'
//   };

//   return createPortal(
//     <div className="fixed inset-0 z-50 overflow-y-auto">
//       {/* Backdrop */}
//       <div 
//         className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
//         onClick={onClose}
//       />
      
//       {/* Modal Container */}
//       <div className="flex min-h-full items-center justify-center p-4">
//         <div 
//           className={`relative w-full ${sizeClasses[size]} bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50 transform transition-all duration-300 scale-100`}
//           onClick={(e) => e.stopPropagation()}
//         >
//           {/* Header */}
//           <div className="flex items-center justify-between p-6 border-b border-slate-200/50">
//             <div>
//               <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
//               {/* 2. Conditionally render the subtitle here */}
//               {subtitle && (
//                 <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
//               )}
//             </div>
//             <button
//               onClick={onClose}
//               className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
//             >
//               <X className="w-5 h-5" />
//             </button>
//           </div>
          
//           {/* Content */}
//           <div className="p-6">
//             {children}
//           </div>
//         </div>
//       </div>
//     </div>,
//     document.body
//   );
// }

// export default Modal;


// import React from 'react';
// import { createPortal } from 'react-dom';
// import { X } from 'lucide-react';

// /**
//  * A reusable, styled modal component aligned with the project's color theme.
//  *
//  * @param {object} props
//  * @param {boolean} props.isOpen - Controls if the modal is visible.
//  * @param {function} props.onClose - Function to call when the modal should be closed.
//  * @param {string} props.title - The main title displayed in the modal header.
//  * @param {string} [props.subtitle] - An optional subtitle displayed below the main title.
//  * @param {'sm' | 'md' | 'lg' | 'xl'} [props.size='md'] - The max-width of the modal.
//  * @param {React.ReactNode} props.children - The content to be rendered inside the modal.
//  */
// function Modal({ isOpen, onClose, title, subtitle, children, size = 'md' }) {
//   if (!isOpen) return null;

//   const sizeClasses = {
//     sm: 'max-w-md',
//     md: 'max-w-2xl',
//     lg: 'max-w-4xl',
//     xl: 'max-w-6xl'
//   };

//   return createPortal(
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//       {/* Backdrop */}
//       <div 
//         className="fixed inset-0 bg-black/60 backdrop-blur-sm"
//         onClick={onClose}
//         aria-hidden="true"
//       />
      
//       {/* Modal Panel */}
//       <div 
//         className={`relative w-full ${sizeClasses[size]} bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] mx-auto`}
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Colorful Gradient Header */}
//         <div className="flex-shrink-0 px-6 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-t-2xl">
//             <div className="flex items-start justify-between">
//                 <div>
//                     <h2 className="text-xl font-bold text-white tracking-wide">
//                         {title}
//                     </h2>
//                     {subtitle && (
//                         <p className="mt-1 text-sm text-cyan-100">
//                             {subtitle}
//                         </p>
//                     )}
//                 </div>
//                 <button
//                     onClick={onClose}
//                     className="p-2 -mr-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
//                     aria-label="Close modal"
//                 >
//                     <X className="w-5 h-5" />
//                 </button>
//             </div>
//         </div>
          
//         {/* Content Area */}
//         <div className="p-6 overflow-y-auto">
//           {children}
//         </div>
//       </div>
//     </div>,
//     document.body
//   );
// }

// export default Modal;



import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

/**
 * A reusable, styled modal component with a blue-themed color profile.
 *
 * @param {object} props
 * @param {boolean} props.isOpen - Controls if the modal is visible.
 * @param {function} props.onClose - Function to call when the modal should be closed.
 * @param {string} props.title - The main title displayed in the modal header.
 * @param {string} [props.subtitle] - An optional subtitle displayed below the main title.
 * @param {'sm' | 'md' | 'lg' | 'xl'} [props.size='md'] - The max-width of the modal.
 * @param {React.ReactNode} props.children - The content to be rendered inside the modal.
 */
function Modal({ isOpen, onClose, title, subtitle, children, size = 'md' }) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal Panel */}
      <div 
        className={`relative w-full ${sizeClasses[size]} bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] mx-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Updated Blue-themed Gradient Header */}
        <div className="flex-shrink-0 px-6 py-4 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-t-2xl">
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-xl font-bold text-white tracking-wide">
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="mt-1 text-sm text-sky-100">
                            {subtitle}
                        </p>
                    )}
                </div>
                <button
                    onClick={onClose}
                    className="p-2 -mr-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
                    aria-label="Close modal"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>
          
        {/* Content Area */}
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}

export default Modal;
