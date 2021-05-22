import React from "react";
import {HomeView} from "./home.view";
import {RTCClient} from "../../mediasoup/client.wrapper";
import {DurbinTransport} from "../../mediasoup/transport";

const Home = (): React.ReactElement => {
    const rtcClient = React.useMemo(() => {
        return new RTCClient()
    }, [])
    const [stream, setStream] = React.useState<MediaStream>()
    const connect = (): void => {
        rtcClient.connect().then(null)
    }

    const produce = (): void => {
        rtcClient.produce().then( stream => {
            setStream(stream)
        })
    }

    const consume = (): void => {
        rtcClient.consume().then(stream => {
            setStream(stream)
        })
    }

    return <HomeView connect={connect} consume={consume} produce={produce} stream={stream}/>
}

export {Home}
