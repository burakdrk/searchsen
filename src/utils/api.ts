import moment from 'moment';
import eol from 'eol';

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
  
    const res = await fetch(`https://logs.ivr.fi/channel/${username}/${date.getUTCFullYear()}/${date.getUTCMonth()+1}/${date.getUTCDate()}`, {
        'method': 'GET',
    });

    if(!res.ok) {
        throw new Error('Error retrieving chat');
    };

    let data = await res.text();

    let lines = eol.split(data);
    lines.pop();

    let newDate = moment(date).add(1, 'd').toDate();
    while(newDate.getTime() < endDate.getTime()) {
        const res2 = await fetch(`https://logs.ivr.fi/channel/${username}/${newDate.getUTCFullYear()}/${newDate.getUTCMonth()+1}/${newDate.getUTCDate()}`, {
            'method': 'GET',
        });

        data = await res2.text();
        const lines2 = eol.split(data);
        lines2.pop();

        lines = lines.concat(lines2);
        newDate = moment(newDate).add(1, 'd').toDate();
    }
 
    let toRet = [];

    for(let i = 0; i<lines.length; ++i) {
        const c = (lines[i].match(/^[^:]*(?::[^:]*){2}/g)[0].match(/([^ \[\]#]+)/g));
        const e = (lines[i].split(/^[^:]*(?::[^:]*){2}/g)[1].substring(2));
        const g = (c[0].match(/([^-]+)/g));

        if(c.length === 4) {
            const d = new Date(`${g[0]}-${g[1]}-${zeroOrNot(parseInt(g[2]))}${g[2]}T${c[1]}Z`);
            const f = (d.getTime());
            const inSecs = Math.floor((f-startEpoch)/1000);

            if(f>=startEpoch && f<=endEpoch) {
                toRet.push({
                    'epoch': f,
                    'inSecs': inSecs,
                    'intoVod': strDifference(inSecs),
                    'user': c[3],
                    'message': e
                });
            }
        }
    }

    return toRet;
}

export const returnSearchedArray = (origArr: Array<Object|any>, pattern: string, isSensitive: boolean, isName: boolean): Array<Object> => {
    let indexArray = []
    for(let i = 0; i < origArr.length; ++i) {
        if(isName)  {
            if(isSensitive) {
                if(origArr[i].user === pattern) {
                    indexArray.push(origArr[i]);
                }
            }
            else {
                if(origArr[i].user.toLowerCase() === pattern.toLowerCase()) {
                    indexArray.push(origArr[i]);
                }
            }
        }
        else {
            if(isSensitive) {
                if(origArr[i].message.match(pattern)) {
                    indexArray.push(origArr[i]);
                }
            }
            else {
                if(origArr[i].message.toLowerCase().match(pattern.toLowerCase())) {
                    indexArray.push(origArr[i]);
                }
            }
        }
    }

    return indexArray;
}

const strDifference = (secs): string => {
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
