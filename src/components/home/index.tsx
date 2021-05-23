import React from "react";
import {HomeView} from "./home.view";
import {RTCClient} from "../../mediasoup/client.wrapper";

const Home = (): React.ReactElement => {
    const rtcClient = React.useMemo(() => {
        return new RTCClient()
    }, [])
    const [stream, setStream] = React.useState<MediaStream>()
    const [peerId, setPeerId] = React.useState('1')
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPeerId(e.currentTarget.value)
    }

    const connect = (): void => {
        rtcClient.connect(peerId).then(null)
    }

    const produce = (): void => {
        rtcClient.produce(peerId).then( stream => {
            setStream(stream)
        })
    }

    const consume = (): void => {
        rtcClient.consume(peerId).then(streamList => {
            setStream(streamList[0])
        })
    }

    return <HomeView connect={connect} consume={consume} produce={produce} stream={stream} value={peerId} onChange={onChange}/>
}

export {Home}
