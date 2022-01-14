import moment from 'moment'
import eol from 'eol'

export const getVODInfo = async (params): Promise<any> => {
  const {video_id, oauth, client_id, api_token, device_id} = params;
  const res = await fetch(`https://api.twitch.tv/v5/videos/${video_id}/`, {
    'method': 'GET',
    'headers': {
      'accept': 'application/vnd.twitchtv.v5+json; charset=UTF-8',
      'authorization': oauth,
      'client-id': client_id,
      'content-type': 'application/json; charset=UTF-8',
      'twitch-api-token': api_token,
      'x-device-id': device_id,
      'x-requested-with': 'XMLHttpRequest'
  },
  })

  if(!res.ok) {
      throw new Error('Error retrieving VOD Info')
  }

  const data = await res.json()
  return data
}

export const getChatLogs = async (creation: string, duration: number, username: string): Promise<any> => {
  const date = new Date(creation)
  const a = /([^hms]+)/g

  const endDate = moment(date).add(duration, 's').toDate()
 
  const endEnoch = endDate.getTime()
  const startEnoch = date.getTime()
  const res = await fetch(`https://logs.ivr.fi/channel/${username}/${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}`, {
    'method': 'GET',
  })

  if(!res.ok) {
    throw new Error('Error retrieving VOD Info')
  }

  const data = await res.text()
 
  let toRet = []
  
  let lines = eol.split(data)
  lines.pop()
  for(let i = 0; i<lines.length; ++i) {
    const c = (lines[i].match(/^[^:]*(?::[^:]*){2}/g)[0].match(/([^ \[\]#]+)/g))
    const e = (lines[i].split(/^[^:]*(?::[^:]*){2}/g)[1].substring(2))
    const g = (c[0].match(/([^-]+)/g))
    if(c.length === 4) {
      const d = new Date(`${g[0]}-${g[1]}-${zeroOrNot(parseInt(g[2]))}${g[2]}T${c[1]}Z`)
      const f= (d.getTime())
      if(f>=startEnoch && f<=endEnoch)  {
        toRet.push({
          'enoch': f,
          'intoVod': enochDifference(f-startEnoch),
          'user': c[3],
          'message': e
        })
      }
    }
  }
  return toRet
}

export const returnSearchedArray = (origArr: Array<Object | any>, pattern: string): Array<Object> => {
  let indexArray = []
  for(let i = 0; i < origArr.length; ++i) {
    if(origArr[i].message.toLowerCase().match(pattern.toLowerCase())){
      indexArray.push(origArr[i])
    }
  }
  return indexArray
}

const enochDifference = (diff: number): string => {
  const differenceDate = new Date(diff);
  const a = differenceDate.getUTCHours();
  const c = differenceDate.getUTCMinutes();
  const d = differenceDate.getUTCSeconds();

  return `?t=${a}h${c}m${d}s`
}

const zeroOrNot = (time: number): string => {
  if(time < 10) {
    return '0'
  }else {
    return ''
  }
}
