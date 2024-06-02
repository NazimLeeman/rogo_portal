// /** @format */

// // FilterComponent.tsx
// import React from "react";
// import { XMarkIcon } from "@heroicons/react/24/solid";
// import { t } from "i18next";
// import Search from "antd/es/input/Search";

// interface FilterProps {
//   availableFilters: string[];
//   placeHolders?: string[] ;
//   filterValues: Record<string, string>;
//   onFilterChange: (filterName: string, value: string) => void;
//   onApplyFilters: () => void;
//   onClearAllFilters: () => void;
//   searchInput: string;
//   onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   showFilters: boolean; // Controlled by parent for dynamic show/hide
//   showSearch?: boolean; // Optional prop to control visibility of the search input
//   onDownload?: () => void;
// }

// const Filter: React.FC<FilterProps> = React.memo(
//   ({
//     availableFilters,
//     placeHolders,
//     filterValues,
//     onFilterChange,
//     onApplyFilters,
//     onClearAllFilters,
//     searchInput,
//     onSearchChange,
//     showFilters,
//     showSearch = true, // Show search by default unless specified
//     onDownload,
//   }) => {
//     return (
//       <div className="flex items-center justify-between">
//         <div className="flex flex-wrap items-center gap-4">
//           {showSearch && (
//             <SearchButton
//               searchInput={searchInput}
//               onSearchChange={onSearchChange}
//             />
//           )}
//           {showFilters &&
//             availableFilters.map((filter, index) => (
//               <div key={filter} className="relative">
//                 <input
//                   type="text"
//                   placeholder={placeHolders !== undefined ? placeHolders[index] : filter }
//                   value={filterValues[filter] || ""}
//                   onChange={(e) => onFilterChange(filter, e.target.value)}
//                   className="pl-4 pr-10 py-2 border border-[#79767D] rounded-lg"
//                 />
//                 {filterValues[filter] && (
//                   <button
//                     onClick={() => onFilterChange(filter, "")}
//                     className="absolute inset-y-0 right-0 px-3 flex items-center"
//                   >
//                     <XMarkIcon className="h-4 w-4 text-red-500" />
//                   </button>
//                 )}
//               </div>
//             ))}
//           {showFilters && (
//             <>
//               <button
//                 onClick={onApplyFilters}
//                 className="px-4 py-2 rounded-lg border border-[#79767D]"
//               >
//                 {t("APPLY")}
//               </button>
//               <button
//                 onClick={onClearAllFilters}
//                 className="px-4 py-2 rounded-lg border border-[#79767D] text-red-500"
//               >
//                 {t("CLEAR_ALL")}
//               </button>
//             </>
//           )}
//         </div>
//         {/* {onDownload && (
//         <button
//           onClick={onDownload}
//           className="px-6 py-3 rounded-lg border border-[#AEA9B1] bg-transparent text-gray-900 font-bold uppercase text-xs"
//         >
//           Download CSV
//         </button>
//       )} */}
//       </div>
//     );
//   }
// );

// export default Filter;
