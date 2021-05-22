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

    public connect = async (): Promise<void> => {
        const capabilities = await DurbinTransport.getRTPCapabilities()
        await this.loadDevice(capabilities)
    }


    public loadDevice = async (routerRtpCapabilities: MediaSoup.types.RtpCapabilities) => {
        this.device = new MediaSoup.Device()
        await this.device.load({routerRtpCapabilities})
        if(!this.device.canProduce('video') && !this.device.canProduce('audio')) {
            throw new Error('failed to load device. abort!')
        }
    }

    public produce = async () => {
        // create producer transport in server end
        const data = await DurbinTransport.createProducerTransport()
        // connect producer transport
        const transport = this.device.createSendTransport(data)
        transport.on('connect', async ({dtlsParameters}, cb, err) => await this.onConnectProducer({id: transport.id, dtlsParameters}, cb, err ))
        transport.on('produce', async ({kind, rtpParameters}, cb, err) => await this.onProduce({id: transport.id, kind, rtpParameters}, cb, err))
        transport.on('connectionstatechange', (state) => this.onConnectionStateChange('producer', state))
        // start producing
        const stream = await this.startProducing(transport)
        return stream
    }

    public consume = async () => {
        const remoteStream = new MediaStream()
        // create a consumer transport in server end
        const data = await DurbinTransport.createConsumerTransport()
        // connect consumer transport
        const transport = this.device.createRecvTransport(data)
        transport.on('connect', async ({dtlsParameters}, cb, err) => await this.onConnectConsumer({id: transport.id, dtlsParameters}, cb, err ))
        transport.on('connectionstatechange', (state) => this.onConnectionStateChange('consumer', state))
        await this.startConsuming(transport, remoteStream)
        return remoteStream
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

    private startConsuming = async (transport: MediaSoup.types.Transport, remoteStream: MediaStream ) => {
        const {rtpCapabilities} = this.device
        const consumers = await DurbinTransport.consume({id:'1',rtpCapabilities})
        for(const currentConsumer of consumers) {
            const consumer = await transport.consume({
                id: currentConsumer.id,
                producerId: currentConsumer.producerId,
                // @ts-ignore
                kind: currentConsumer.kind,
                rtpParameters: currentConsumer.rtpParameters,
            })
            remoteStream.addTrack(consumer.track)
        }
        await DurbinTransport.resumeConsume({id:'123'})
    }

    private onConnectProducer = async ({dtlsParameters, id}: {id: string, dtlsParameters: MediaSoup.types.DtlsParameters }, cb: any, err: any) => {
        DurbinTransport.connectProducerTransport({id, dtlsParameters}).then(cb).catch(err)
    }

    private onConnectConsumer = async ({dtlsParameters, id}: {id: string, dtlsParameters: MediaSoup.types.DtlsParameters }, cb: any, err: any) => {
        DurbinTransport.connectConsumerTransport({id, dtlsParameters}).then(cb).catch(err)
    }

    private onProduce = async ({id: transportId, kind, rtpParameters}: {id: string, kind: MediaSoup.types.MediaKind, rtpParameters: MediaSoup.types.RtpParameters},  cb: any, err: any) => {
        DurbinTransport.produce({id: transportId, kind, rtpParameters}).then(id=>cb({id})).catch(err)
    }

    private onConnectionStateChange = (who: string, state: string) => {
        console.warn('->', who, state)
    }
}

export {RTCClient}
