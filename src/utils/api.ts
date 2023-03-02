import moment from 'moment'
import eol from 'eol'

export const getVODInfo = async (params): Promise<any> => {
  const {video_id, oauth, client_id} = params
  const res = await fetch(`https://gql.twitch.tv/gql`, {
    'method': 'POST',
    'headers': {
      'authorization': oauth,
      'client-id': client_id,
    },
    body: JSON.stringify({
      query: `query {video(id: ${video_id}){createdAt lengthSeconds creator {login}}}`
    })
  })
  
  if(!res.ok) {
      throw new Error('Error retrieving VOD Info')
  }

  const data = await res.json();
  return {channelname: data.data.video.creator.login, created_at: data.data.video.createdAt, length: data.data.video.lengthSeconds};
}

export const checkChannel = async (username: string): Promise<any> => {
  const res = await fetch('https://logs.ivr.fi/channels', {
    'method': 'GET',
    'headers': {
      'accept': 'application/json'
    }
  })

  if(!res.ok) {
    throw new Error('Error retrieving channels')
  }

  const data = await res.json()
  return data
}

export const getChatLogs = async (creation: string, duration: number, username: string): Promise<any> => {
  const date = new Date(creation)
  const a = /([^hms]+)/g
  const endDate = moment(date).add(duration, 's').toDate()
 
  const endEpoch = endDate.getTime()
  const startEpoch = date.getTime()
  
  const res = await fetch(`https://logs.ivr.fi/channel/${username}/${date.getUTCFullYear()}/${date.getUTCMonth()+1}/${date.getUTCDate()}`, {
    'method': 'GET',
  })

  if(!res.ok) {
    throw new Error('Error retrieving chat')
  }

  const data = await res.text()

  let lines2 = []
  if(date.getUTCDate() !== endDate.getUTCDate()) {
    const newDate = moment(date).add(1, 'd').toDate()

    const res2 = await fetch(`https://logs.ivr.fi/channel/${username}/${newDate.getUTCFullYear()}/${newDate.getUTCMonth()+1}/${newDate.getUTCDate()}`, {
      'method': 'GET',
    })

    const data2 = await res2.text()
    lines2 = eol.split(data2)
    lines2.pop()

  }
 
  let toRet = []

  let lines = eol.split(data)
  lines.pop()
  lines = lines.concat(lines2)
  lines2 = null

  for(let i = 0; i<lines.length; ++i) {
    const c = (lines[i].match(/^[^:]*(?::[^:]*){2}/g)[0].match(/([^ \[\]#]+)/g))
    const e = (lines[i].split(/^[^:]*(?::[^:]*){2}/g)[1].substring(2))
    const g = (c[0].match(/([^-]+)/g))
    if(c.length === 4) {
      const d = new Date(`${g[0]}-${g[1]}-${zeroOrNot(parseInt(g[2]))}${g[2]}T${c[1]}Z`)
      const f= (d.getTime())
      if(f>=startEpoch && f<=endEpoch)  {
        toRet.push({
          'epoch': f,
          'inSecs': inSecs(f-startEpoch),
          'intoVod': epochDifference(f-startEpoch),
          'user': c[3],
          'message': e
        })
      }
    }
  }
  lines = null
  return toRet
}

export const returnSearchedArray = (origArr: Array<Object | any>, pattern: string, isSensitive: boolean, isName: boolean): Array<Object> => {
  let indexArray = []
  for(let i = 0; i < origArr.length; ++i) {
    if(isName)  {
      if(isSensitive) {
        if(origArr[i].user === pattern){
          indexArray.push(origArr[i])
        }
      }else {
        if(origArr[i].user.toLowerCase() === pattern.toLowerCase()){
          indexArray.push(origArr[i])
        }
      }
    }else {
      if(isSensitive) {
        if(origArr[i].message.match(pattern)){
          indexArray.push(origArr[i])
        }
      }else {
        if(origArr[i].message.toLowerCase().match(pattern.toLowerCase())){
          indexArray.push(origArr[i])
        }
      }
    }
  }
  return indexArray
}

const epochDifference = (diff: number): string => {
  const differenceDate = new Date(diff)
  return `?t=${differenceDate.getUTCHours()}h${differenceDate.getUTCMinutes()}m${differenceDate.getUTCSeconds()}s`
}

const inSecs = (diff: number): number => {
  const differenceDate = new Date(diff)
  const hrs = differenceDate.getUTCHours()
  const mins = differenceDate.getUTCMinutes()
  const secs = differenceDate.getUTCSeconds()
  return (hrs) * 60 * 60 + (mins) * 60 + (secs)
}

const zeroOrNot = (time: number): string => {
  if(time < 10) return '0'
  return ''
}
