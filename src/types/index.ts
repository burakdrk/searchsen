export interface VODInfo {
    channelname: string,
    created_at: string,
    length: number
}

export interface ChannelsResponse {
    channels: {
        name: string,
        id: string
    }[]
}

export interface ChatLog {
    intoVod: string,
    inSecs: number,
    message: string,
    user: string,
    userColor: string
}