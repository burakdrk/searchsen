import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { AppBar, ListItem, ListItemButton, ListItemText, Typography, TextField, Divider, Box, Toolbar, Link, List, ThemeProvider, createTheme } from '@mui/material'
import { makeStyles } from '@mui/styles';
import { LoadingButton } from '@mui/lab'
import { getVODInfo, getChatLogs, returnSearchedArray } from '../utils/api'
import { FixedSizeList, ListChildComponentProps } from 'react-window'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import './popup.css'

var darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
  },
})

const useStyles = makeStyles({
  root: {
    flexGrow: 1
  },
  link: {
    textDecoration: 'none',
    
  }
})
var kato = []
var vodId: string = ''

const App: React.FC<{}> = () => {
  const [isInValid, setIsInValid] = useState(true)
  const [runText, setRunText] = useState(true)
  const [loading, setLoading] = useState(false)
  const [textVal, setTextVal] = useState('')
  const [resultArray, setResultArray] = useState([])
  const classes = useStyles()
  
  useEffect(() => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if(/twitch\.tv\/videos\/(\d+)/.test(tabs[0].url)) {
          chrome.tabs.sendMessage(tabs[0].id, {type:'runToken'}, (ret) => {
            setLoading(true)
            vodId = ret.video_id
            getVODInfo(ret)
            .then((data) => {
              if(typeof data !== 'undefined') {
                getChatLogs(data.created_at, data.length, data.channel.name)
                .then((dota)=>{
                  kato = dota
                  setLoading(false)
                  setRunText(false)
                })
                .catch((erol)=>{console.log(erol)})
              }
            })
            .catch((err)=>{console.log(err)})
          })
      }
    })
  }, [])

  const handleClick = () => {
    if(textVal.length < 3){}
    else{
      setLoading(true)
      setResultArray(returnSearchedArray(kato, textVal))   
      setLoading(false)
    }
  }

  const handleListClick = (urlN: string) => {
    chrome.tabs.create({active: false, url : urlN})
  }

  const renderRow = (props: ListChildComponentProps) => {
    const { index, style } = props;
  
    return (
      <ListItem style={style} key={index} component="div" disablePadding>
        <ListItemButton component='a'
        onClick={()=>{handleListClick(`https://www.twitch.tv/videos/${vodId}${resultArray[index].intoVod}`)}}
        >
          <ListItemText primary={`[${resultArray[index].intoVod.substring(3)}] ${resultArray[index].user}: ${resultArray[index].message}`} primaryTypographyProps={{ 
              variant: 'subtitle2', 
              style: {
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  color: 'whitesmoke'
              }
          }}/>
        </ListItemButton>
      </ListItem>
    );
  }

  return (
    <div className={classes.root}>
      <ThemeProvider theme={darkTheme}>
        <Box sx={{flexGrow: 1}}>
          <AppBar position='static' color='inherit'>
              <Toolbar>
                  <Link underline='none' color='inherit' sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                    onClick={() => {
                      const myAudio = new Audio(chrome.runtime.getURL('OH.mp3'))
                      myAudio.play()
                    }}
                    
                  >
                    <Typography variant ="h6"
                      noWrap
                      component="div"
                      className={classes.link}>Searchsen</Typography>
                  </Link>
                  
                  <Box
                    sx={{
                    width: 500,
                    maxWidth: '50%',
                  }}>
                    <TextField fullWidth label="Input" id="fullWidth" size='small' color='secondary' disabled={runText} value={textVal} onChange={e=> {
                      if(e.target.value.length < 3){
                          setIsInValid(true)
                      }
                      else{
                        setIsInValid(false)
                      }
                      return setTextVal(e.target.value)}}/>
                  </Box>
                  <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                  <LoadingButton loading={loading} variant='contained' color='secondary' disabled={isInValid} onClick={async()=>{handleClick()}}>Search</LoadingButton>
              </Toolbar>
          </AppBar>
        </Box>
        <Box
        sx={{ width: '100%', height: '100%', maxWidth: 600, bgcolor: 'background.paper' }}>
          <FixedSizeList
            height={435}
            width={600}
            itemSize={40}
            itemCount={resultArray.length}
          >
          {renderRow}
          </FixedSizeList>
        </Box>
      </ThemeProvider>
    </div>
  )
}

const root = document.createElement('div')
document.body.appendChild(root)
ReactDOM.render(<App/>, root)
