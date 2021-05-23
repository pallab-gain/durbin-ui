import React from 'react';

export interface HomeViewProps {
    connect: () => void
    produce: () => void
    consume: () => void
    stream?: MediaStream
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}
const HomeView = ({ connect, produce, consume, stream, value, onChange}: HomeViewProps): React.ReactElement => {
    return (
        <>
            <h2>Home</h2>
            <input type="text" required onChange={onChange} value={value}/>
            <button onClick={connect}>connect</button>
            <button onClick={produce}>produce</button>
            <button onClick={consume}>consume</button>

            <video title={'localVideo'} ref={ audio => {
                if(stream) {
                    // @ts-ignore
                    audio.srcObject = stream
                }
            }} autoPlay={true} controls={true}/>
        </>
    );
}

export { HomeView };
