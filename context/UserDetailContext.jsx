// import React, { createContext, useState } from "react";

// // Default value is an array: [userDetail, setUserDetail]
// export const UserDetailContext = createContext([null, () => {}]);

// export const UserDetailProvider = ({ children }) => {
//   const state = useState(null);
//   return (
//     <UserDetailContext.Provider value={state}>
//       {children}
//     </UserDetailContext.Provider>
//   );
// };

import React, { createContext, useState } from "react";

// Create context with a function that accepts a parameter
export const UserDetailContext = createContext({
  userDetail: null,
  setUserDetail: () => {} // This accepts a parameter
});

export const UserDetailProvider = ({ children }) => {
  const [userDetail, setUserDetail] = useState(null);
  
  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      {children}
    </UserDetailContext.Provider>
  );
};