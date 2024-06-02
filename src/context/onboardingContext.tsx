// import React, {
//     createContext,
//     useContext,
//     useState,
//     ReactNode,
//   } from "react";

//   interface IOnboardingContext {
//     onboardingSaved: boolean;
//     setIsOnboardingSaved: any;
//   }

//   const OnboardingContext = createContext<IOnboardingContext>({
//     onboardingSaved: false,
//     setIsOnboardingSaved: false
//   });

//   export const OnboardingContextProvider: React.FC<{ children: ReactNode }> = ({
//     children,
//   }) => {
//     const [onboardingSaved, setIsOnboardingSaved] = useState(false);

//     const value = {
//       onboardingSaved,
//       setIsOnboardingSaved,
//     };
//     return (
//       <OnboardingContext.Provider value={value}>
//         {children}
//       </OnboardingContext.Provider>
//     );
//   };
//   export const useOnboarding = () => {
//     const context = useContext(OnboardingContext);
//     if (context === undefined) {
//       throw new Error("useOnboardingContext must be used within a OnboardingContextProvider");
//     }
//     return context;
//   };
