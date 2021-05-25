import React from 'react';
import {useAuth0} from "@auth0/auth0-react";

const Logout = (): React.ReactElement => {
    const { logout } = useAuth0();
    return (
        <button onClick={()=>logout({
                returnTo: window.location.origin,
        })} type={"button"}>Logout</button>
    )
}
export {Logout}
