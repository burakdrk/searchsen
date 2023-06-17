chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    (async function() {
        if (message.command === 'get_logs_from_twitch') {
            sendResponse(await getChatLogsFromTwitch(message.data.params, message.data.offset, message.data.cursor));
        }
    })();

    return true;
});
  
const getChatLogsFromTwitch = async ({video_id, oauth, client_id, unique_id}, offset: number, cursor: string): Promise<any> => {
    const gqlQuery = (offset !== null ? ("[{\"operationName\":\"VideoCommentsByOffsetOrCursor\"," +
    "\"variables\":{\"videoID\":\"" + video_id + "\",\"contentOffsetSeconds\":" + offset + "}," +
    "\"extensions\":{\"persistedQuery\":{\"version\":1,\"sha256Hash\":\"b70a3591ff0f4e0313d126c6a1502d79a1c02baebb288227c582044aa76adf6a\"}}}]")
    :
    ("[{\"operationName\":\"VideoCommentsByOffsetOrCursor\"," +
    "\"variables\":{\"videoID\":\"" + video_id + "\",\"cursor\":\"" + cursor + "\"}," +
    "\"extensions\":{\"persistedQuery\":{\"version\":1,\"sha256Hash\":\"b70a3591ff0f4e0313d126c6a1502d79a1c02baebb288227c582044aa76adf6a\"}}}]"));

    // @ts-ignore
    const storedIntegrityObj: any = await chrome.storage.local.get('integrity');

    const res = await fetch(`https://gql.twitch.tv/gql`, {
        'method': 'POST',
        'headers': {
            'authorization': oauth,
            'client-id': client_id,
            'X-Device-Id': unique_id,
            'Client-Integrity': storedIntegrityObj.integrity
        },
        body: gqlQuery
    });
  
    if(!res.ok) {
        return {status: 'error'};
    }

    const data = await res.json();
    return {status: 'done', data: data};
}

chrome.webRequest.onBeforeSendHeaders.addListener(
    (details) => {
        if(!(details.initiator.startsWith('chrome-extension'))) {
            if(details.requestHeaders.find(obj => obj.name === "Client-Integrity")) {
                const token = details.requestHeaders.find(obj => obj.name === "Client-Integrity").value;
                // @ts-ignore
                chrome.storage.local.get('integrity').then((data) => {
                    if((Object.keys(data).length === 0) || (data.integrity !== token)) {
                        // @ts-ignore
                        chrome.storage.local.set({ integrity: token }).then(() => {
                            console.log("Token is set");
                        });
                    }  
                });
            }
        }
    },
    {urls: [ "https://gql.twitch.tv/gql" ]},
    ['requestHeaders']);
  