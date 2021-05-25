import React from "react";
import { Route } from "react-router-dom";
import { withAuthenticationRequired } from "@auth0/auth0-react";

// T extends {} = {}, Path extends string = string
const ProtectedRoute = ({ component, ...args }: any ) => (
    <Route
        component={withAuthenticationRequired(component, {
            // eslint-disable-next-line react/display-name
            onRedirecting: () => <div>Loading ...</div>,
        })}
        {...args}
    />
);

export {ProtectedRoute}
