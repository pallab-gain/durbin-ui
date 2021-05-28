import React from "react";
import {HomeView} from "./home.view";
import {RTCClient} from "../../mediasoup/client.wrapper";
import {DurbinTransport} from "../../mediasoup/transport";
import {useAuth0} from "@auth0/auth0-react";

const Home = (): React.ReactElement => {
    const rtcClient = React.useMemo(() => {
        return new RTCClient()
    }, [])
    const [stream, setStream] = React.useState<MediaStream>()
    const [roomId, setRoomId] = React.useState('1')
    const [peerId, setPeerId] = React.useState('1')
    const [accessToken, setAccessToken] = React.useState('')
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();
    React.useEffect(() => {
        getAccessTokenSilently().then(token => {
            setAccessToken(token)
            rtcClient.setAccessToken(token)
        })
    },[isAuthenticated])

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPeerId(e.currentTarget.value)
    }

    const createRoom = (): void => {
        DurbinTransport.createRoom(peerId, accessToken).then(setRoomId)
    }

    const joinRoom = (): void => {
        setRoomId(peerId)
    }

    const connect = (): void => {
        console.warn('->', roomId, peerId)
        rtcClient.connect(roomId, peerId).then(null)
    }

    const produce = (): void => {
        rtcClient.produce(roomId,peerId).then( stream => {
            setStream(stream)
        })
    }

    const consume = (): void => {
        rtcClient.consume(roomId, peerId).then(streamList => {
            setStream(streamList[0])
        })
    }

    return <HomeView connect={connect} consume={consume} produce={produce} create={createRoom} join={joinRoom} stream={stream} value={peerId} onChange={onChange}/>
}

export {Home}

