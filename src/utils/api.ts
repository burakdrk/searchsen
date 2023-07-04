import moment from 'moment';

export const getVODInfo = async ({video_id, oauth, client_id}): Promise<any> => {
    const res = await fetch(`https://gql.twitch.tv/gql`, {
        'method': 'POST',
        'headers': {
            'authorization': oauth,
            'client-id': client_id,
        },
        body: JSON.stringify({query: `query {video(id: ${video_id}){createdAt lengthSeconds creator {login}}}`})
    });
  
    if(!res.ok) {
        throw new Error('Error retrieving VOD Info')
    }

    const data = await res.json();
    return {channelname: data.data.video.creator.login, created_at: data.data.video.createdAt, length: data.data.video.lengthSeconds};
}

export const checkChannel = async (): Promise<any> => {
    const res = await fetch('https://logs.ivr.fi/channels', {
        'method': 'GET',
        'headers': {
            'accept': 'application/json'
        }
    });

    if(!res.ok) {
        throw new Error('Error retrieving channels');
    }

    const data = await res.json();
    return data;
}

export const getChatLogs = async (creation: string, duration: number, username: string): Promise<any> => {
    const date = new Date(creation);
    const endDate = moment(date).add(duration, 's').toDate();

    const endEpoch = endDate.getTime();
    const startEpoch = date.getTime();
  
    const res = await fetch(`https://logs.ivr.fi/channel/${username}/${date.getUTCFullYear()}/${date.getUTCMonth()+1}/${date.getUTCDate()}?jsonBasic`, {
        'method': 'GET',
    });

    if(!res.ok) {
        throw new Error('Error retrieving chat');
    }

    let data = await res.json();
    let lines = data.messages;

    let newDate = moment(date).add(1, 'd').utc().startOf('d').toDate();
    while(newDate.getTime() < endDate.getTime()) {

        const res2 = await fetch(`https://logs.ivr.fi/channel/${username}/${newDate.getUTCFullYear()}/${newDate.getUTCMonth()+1}/${newDate.getUTCDate()}?jsonBasic`, {
            'method': 'GET',
        });

        if(!res2.ok) {
            throw new Error('Error retrieving chat');
        }

        data = await res2.json();

        lines = lines.concat(data.messages);
        newDate = moment(newDate).add(1, 'd').utc().startOf('d').toDate();
    }
 
    let toRet = [];

    for(let i = 0; i<lines.length; ++i) {
        if(lines[i].id.length > 0) {
            const d = new Date(lines[i].timestamp);
            const f = (d.getTime());
            const inSecs = Math.floor((f-startEpoch)/1000);

            if(f>=startEpoch && f<=endEpoch) {
                toRet.push({
                    'inSecs': inSecs,
                    'intoVod': strDifference(inSecs),
                    'user': lines[i].displayName,
                    'message': lines[i].text,
                    'userColor': lines[i].tags.color ? lines[i].tags.color : '#808080'
                });
            }
        }
    }

    return toRet;
}

export const returnSearchedArray = (origArr: Array<Object|any>, pattern: string, isSensitive: boolean, isName: boolean, isRegex: boolean): Array<Object> => {
    let indexArray = []
    for(let i = 0; i < origArr.length; ++i) {
        if(isRegex) {
            if(origArr[i].message.match(pattern)) {
                indexArray.push(origArr[i]);
            }
        }
        else if(isName)  {
            if(origArr[i].user.toLowerCase() === pattern.toLowerCase()) {
                indexArray.push(origArr[i]);
            }
        }
        else {
            if(isSensitive) {
                if(origArr[i].message.includes(pattern)) {
                    indexArray.push(origArr[i]);
                }
            }
            else {
                if(origArr[i].message.toLowerCase().includes(pattern.toLowerCase())) {
                    indexArray.push(origArr[i]);
                }
            }
        }
    }

    return indexArray;
}

export const strDifference = (secs): string => {
    const h = Math.floor(secs / 3600);
    secs %= 3600;
    const m = Math.floor(secs / 60);
    const s = secs % 60;

    return `${h}h${m}m${s}s`;
}

const zeroOrNot = (time: number): string => {
    if(time < 10) return '0';
    return '';
}
