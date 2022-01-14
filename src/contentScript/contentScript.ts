const getTwitchTokens = () => {
    const temp = document.cookie
    return {
        video_id: /twitch\.tv\/videos\/(\d+)/.exec(window.location.href)?.[1],
        api_token: /(?<=api_token\=).+?(?=;)/.exec(temp)?.[0], 
        device_id: /(?<=unique_id\=).+?(?=;)/.exec(temp)?.[0],
        oauth: /(?<=%22authToken%22:%22).+?(?=%22)/.exec(temp)?.[0] ? 'OAuth ' + /(?<=%22authToken%22:%22).+?(?=%22)/.exec(temp)?.[0] : '',
        client_id: /(?<="Client-ID":"|clientId=").+?(?=")/.exec(Array.from(document.getElementsByTagName('script'))?.filter(i=> /(?<="Client-ID":"|clientId=").+?(?=")/.test(i.innerHTML))?.[0].innerHTML)?.[0]
    }
}

chrome.runtime.onMessage.addListener((msg, sender, response) => {
    if(msg.type === 'runToken') {
        response(getTwitchTokens())
    }
})
