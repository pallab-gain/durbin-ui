import React from 'react';
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {getValue, increment} from "../../features/root.slice";

const Home = (): React.ReactElement => {
    const dispatch = useAppDispatch()
    const value = useAppSelector( getValue)
    return (
        <>
            <h2>Home</h2>
            <h1>{value}</h1>
            <button onClick={()=> dispatch(increment())}>BUTTON</button>
        </>
    );
}

export { Home };
