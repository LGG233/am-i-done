import React, { createContext, useState } from "react";

// 1. Create the context
export const RequestContext = createContext();

// 2. Create the provider
export const RequestProvider = ({ children }) => {
    const [requestData, setRequestData] = useState({ title: "", copy: "", points: "" });

    const handleNewRequest = () => {
        setRequestData({ title: "", copy: "", points: "" });
        console.log("New request triggered");
    };

    const handleSignOut = () => {
        localStorage.clear();
        window.location.href = "/";
    };

    return (
        <RequestContext.Provider value={{ requestData, setRequestData, handleNewRequest, handleSignOut }}>
            {children}
        </RequestContext.Provider>
    );
};