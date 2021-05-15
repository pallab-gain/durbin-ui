import React from 'react';

export interface HomeViewProps {
    value: number
    onClick: () => void
}
const HomeView = ({ value, onClick}: HomeViewProps): React.ReactElement => {
    return (
        <>
            <h2>Home</h2>
            <h1>{value}</h1>
            <button onClick={onClick}>BUTTON</button>
        </>
    );
}

export { HomeView };
