import * as MediaSoup from 'mediasoup-client'
import {DurbinTransport} from "../transport";
class RTCClient {
    private device!: MediaSoup.types.Device

    private localMediaStream = async (): Promise<MediaStream> => {
        return await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
        });
    }

    public connect = async (peerId: string): Promise<void> => {
        await DurbinTransport.joinRoom(peerId)
    }

    public produce = async (peerId: string) => {
        const capabilities = await DurbinTransport.getRTPCapabilities(peerId)
        this.device = new MediaSoup.Device()
        await this.device.load({routerRtpCapabilities: capabilities})

        // create producer transport in server end
        const transportOptions = await DurbinTransport.createProducerTransport(peerId)
        // connect producer transport
        const transport = this.device.createSendTransport(transportOptions)
        transport.on('connect', async ({dtlsParameters}, cb, err) => await this.onConnectProducer({peerId, dtlsParameters}, cb, err ))
        transport.on('produce', async ({kind, rtpParameters}, cb, err) => await this.onProduce({peerId, kind, rtpParameters}, cb, err))
        transport.on('connectionstatechange', (state) => this.onConnectionStateChange('producer', state))
        // start producing
        const stream = await this.startProducing(transport)
        return stream
    }

    public consume = async (peerId: string) => {
        const capabilities = await DurbinTransport.getRTPCapabilities(peerId)
        this.device = new MediaSoup.Device()
        await this.device.load({routerRtpCapabilities: capabilities})

        // create a consumer transport in server end
        const transportOptions = await DurbinTransport.createConsumerTransport(peerId)
        // connect consumer transport
        const transport = this.device.createRecvTransport(transportOptions)
        transport.on('connect', async ({dtlsParameters}, cb, err) => await this.onConnectConsumer({peerId, dtlsParameters}, cb, err ))
        transport.on('connectionstatechange', (state) => this.onConnectionStateChange('consumer', state))
        const remoteStreams = await this.startConsuming(peerId, transport)
        return remoteStreams
    }

    private startProducing = async(producer: MediaSoup.types.Transport) => {
        const stream = await this.localMediaStream()
        const videoProducer = await producer.produce({
            track: stream.getVideoTracks()[0]
        })
        const audioProducer = await producer.produce({
            track: stream.getAudioTracks()[0]
        })
        return stream
    }

    private startConsuming = async (peerId: string, transport: MediaSoup.types.Transport ) => {
        const {rtpCapabilities} = this.device
        // get current list of producers
        const producers = await DurbinTransport.producerList({peerId})
        const remoteStreams: MediaStream[] = []
        for(const currentProducer of producers) {
            const remoteConsumers = await DurbinTransport.consume({peerId, producerPeerId: currentProducer, rtpCapabilities})
            const remoteStream = new MediaStream()
            for(const current of remoteConsumers) {
                const consumer = await transport.consume({
                    id: current.id,
                    producerId: current.producerId,
                    // @ts-ignore
                    kind: current.kind,
                    rtpParameters: current.rtpParameters,
                })
                remoteStream.addTrack(consumer.track)
            }
            remoteStreams.push(remoteStream)
        }
        await DurbinTransport.resumeConsume({peerId})
        return remoteStreams
    }

    private onConnectProducer = async ({dtlsParameters, peerId}: {peerId: string, dtlsParameters: MediaSoup.types.DtlsParameters }, cb: any, err: any) => {
        DurbinTransport.connectProducerTransport({peerId, dtlsParameters}).then(cb).catch(err)
    }

    private onConnectConsumer = async ({dtlsParameters, peerId}: {peerId: string, dtlsParameters: MediaSoup.types.DtlsParameters }, cb: any, err: any) => {
        DurbinTransport.connectConsumerTransport({peerId, dtlsParameters}).then(cb).catch(err)
    }

    private onProduce = async ({peerId, kind, rtpParameters}: {peerId: string, kind: MediaSoup.types.MediaKind, rtpParameters: MediaSoup.types.RtpParameters},  cb: any, err: any) => {
        DurbinTransport.produce({peerId, kind, rtpParameters}).then(id=>cb({id})).catch(err)
    }

    private onConnectionStateChange = (who: string, state: string) => {
        console.warn('->', who, state)
    }
}

export {RTCClient}
