import axios from "axios";
import * as MediaSoup from 'mediasoup-client'
import {TransportOptions} from "mediasoup-client/lib/Transport";
const EndPoint = 'http://localhost:3000'

const getEndpoint = (suffix: string): string => {
    return `${EndPoint}/${suffix}`
}
class DurbinTransport {
    static async getRTPCapabilities(): Promise<MediaSoup.types.RtpCapabilities> {
        const {data} = await axios.get<MediaSoup.types.RtpCapabilities>(getEndpoint('rtp-capabilities/room/1'))
        return data
    }

    static async createProducerTransport(): Promise<TransportOptions> {
        const {data} = await axios.get<TransportOptions>(getEndpoint('create/producer/room/1'))
        return data
    }

    static async createConsumerTransport(): Promise<TransportOptions> {
        const {data} = await axios.get<TransportOptions>(getEndpoint('create/consumer/room/1'))
        return data
    }

    static async connectProducerTransport({dtlsParameters, id}: {id: string, dtlsParameters: MediaSoup.types.DtlsParameters }): Promise<void> {
        await axios.post(getEndpoint(`connect/producer/transport/room/${id}`), {...dtlsParameters})
    }

    static async connectConsumerTransport({dtlsParameters, id}: {id: string, dtlsParameters: MediaSoup.types.DtlsParameters }): Promise<void> {
        await axios.post(getEndpoint(`connect/consumer/transport/room/${id}`), {...dtlsParameters})
    }

    static async produce({id, kind, rtpParameters}: {id: string, kind: MediaSoup.types.MediaKind, rtpParameters: MediaSoup.types.RtpParameters}): Promise<string> {
        const {data} = await axios.post<string>(getEndpoint(`produce/room/${id}`), {kind, rtpParameters})
        return data
    }

    static async consume({id, rtpCapabilities}: {id: string, rtpCapabilities: MediaSoup.types.RtpCapabilities}): Promise<MediaSoup.types.Consumer[]> {
        const {data} = await axios.post<MediaSoup.types.Consumer[]>(getEndpoint(`consume/room/${id}`), {rtpCapabilities})
        return data
    }

    static async resumeConsume({id}: {id: string}): Promise<void> {
        await axios.get(getEndpoint(`resume/consumer/room/${id}`))
    }
}
export {DurbinTransport}
