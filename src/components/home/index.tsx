import React from "react";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {getValue, increment} from "../../features/root.slice";
import {HomeView} from "./home.view";

const Home = (): React.ReactElement => {
    const dispatch = useAppDispatch()
    const value = useAppSelector(getValue)
    const addValue = () => dispatch(increment())
    return <HomeView onClick={addValue} value={value}/>
}

export {Home}
