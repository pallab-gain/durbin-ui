import axios from "axios";
import * as MediaSoup from 'mediasoup-client'
import {TransportOptions} from "mediasoup-client/lib/Transport";
const EndPoint = 'http://localhost:3000'

const getEndpoint = (suffix: string): string => {
    return `${EndPoint}/${suffix}`
}
class DurbinTransport {
    static async createRoom(roomId: string): Promise<void> {
        await axios.post(getEndpoint(`create/room/${roomId}`))
    }

    static async joinRoom(roomId: string, peerId: string): Promise<void> {
        await axios.get(getEndpoint(`join/room/${roomId}/peer/${peerId}`))
    }

    static async getRTPCapabilities(roomId: string, peerId: string): Promise<MediaSoup.types.RtpCapabilities> {
        const {data} = await axios.get<MediaSoup.types.RtpCapabilities>(getEndpoint(`rtp-capabilities/room/${roomId}/peer/${peerId}`))
        return data
    }

    static async createProducerTransport(roomId: string, peerId: string): Promise<TransportOptions> {
        const {data} = await axios.get<TransportOptions>(getEndpoint(`create/producer/transport/room/${roomId}/peer/${peerId}`))
        return data
    }

    static async createConsumerTransport(roomId: string, peerId: string): Promise<TransportOptions> {
        const {data} = await axios.get<TransportOptions>(getEndpoint(`create/consumer/transport/room/${roomId}/peer/${peerId}`))
        return data
    }

    static async connectProducerTransport(roomId: string, {dtlsParameters, peerId}: {peerId: string, dtlsParameters: MediaSoup.types.DtlsParameters }): Promise<void> {
        await axios.post(getEndpoint(`connect/producer/transport/room/${roomId}/peer/${peerId}`), {...dtlsParameters})
    }

    static async connectConsumerTransport(roomId: string, {dtlsParameters, peerId}: {peerId: string, dtlsParameters: MediaSoup.types.DtlsParameters }): Promise<void> {
        await axios.post(getEndpoint(`connect/consumer/transport/room/${roomId}/peer/${peerId}`), {...dtlsParameters})
    }

    static async produce(roomId: string, {peerId, kind, rtpParameters}: {peerId: string, kind: MediaSoup.types.MediaKind, rtpParameters: MediaSoup.types.RtpParameters}): Promise<string> {
        const {data} = await axios.post<string>(getEndpoint(`produce/room/${roomId}/peer/${peerId}`), {kind, rtpParameters})
        return data
    }

    static async consume(roomId: string,{peerId, producerPeerId, rtpCapabilities}: {peerId: string, producerPeerId: string, rtpCapabilities: MediaSoup.types.RtpCapabilities}): Promise<MediaSoup.types.Consumer[]> {
        const {data} = await axios.post<MediaSoup.types.Consumer[]>(getEndpoint(`consume/room/${roomId}/peer/${peerId}/with/producer/peer/${producerPeerId}`), {rtpCapabilities})
        return data
    }

    static async producerList(roomId: string, {peerId}: {peerId: string}): Promise<string[]>  {
        const {data} = await axios.get<string[]>(getEndpoint(`producer/list/room/${roomId}/peer/${peerId}`))
        return data
    }

    static async resumeConsume(roomId: string,{peerId}: {peerId: string}): Promise<void> {
        await axios.get(getEndpoint(`resume/consumer/room/${roomId}/peer/${peerId}`))
    }
}
export {DurbinTransport}
