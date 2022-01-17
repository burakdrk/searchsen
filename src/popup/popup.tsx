import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { AppBar, FormControlLabel, ListItem, Menu, ListItemButton, MenuItem, Typography, TextField, Divider, Box, Toolbar, Link, Checkbox, ThemeProvider, createTheme, IconButton } from '@mui/material'
import { makeStyles } from '@mui/styles'
import MenuIcon from '@mui/icons-material/Menu'
import { LoadingButton } from '@mui/lab'
import { getVODInfo, getChatLogs, returnSearchedArray, checkChannel } from '../utils/api'
import { Virtuoso } from 'react-virtuoso'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import './popup.css'

const darkTheme = createTheme({
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

let kato = []
let vodId: string = ''

const App: React.FC<{}> = () => {
  const [isInValid, setIsInValid] = useState<null | boolean>(true)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [runText, setRunText] = useState<null | boolean>(true)
  const [loading, setLoading] = useState<null | boolean>(false)
  const [isChecked1, setIsChecked1] = useState<null | boolean>(false)
  const [isChecked2, setIsChecked2] = useState<null | boolean>(false)
  const [textVal, setTextVal] = useState<null | string>('')
  const [textLabel, setTextLabel] = useState<null | string>('')
  const [resultArray, setResultArray] = useState([])
  const classes = useStyles()
  
  useEffect(() => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if(/twitch\.tv\/videos\/(\d+)/.test(tabs[0].url)) {
        chrome.tabs.sendMessage(tabs[0].id, {type:'runToken'}, (ret) => {
          setLoading(true)
          setTextLabel('Fetching...')
          vodId = ret.video_id
          console.log(ret.api_token)
          getVODInfo(ret)
          .then((data) => {
            if(typeof data !== 'undefined') {
              checkChannel(data.channel.name)
              .then((doto)=>{
                if(doto.channels.some(e => e.name === data.channel.name)) {
                  getChatLogs(data.created_at, data.length, data.channel.name)
                  .then((dota)=>{
                    kato = dota
                    setTextLabel('Input')
                    setLoading(false)
                    setRunText(false)
                  })
                  .catch((erol)=>{console.log(erol)})
                }else {
                  setLoading(false)
                  setTextLabel('Channel is not supported')
                }
              })
              .catch((eror)=>{console.log(eror)})
            }
          })
          .catch((err)=>{console.log(err)})
        })
      }else {
        setTextLabel('Go to a Twitch VOD')
      }
    })
  }, [])

  const handleClick = () => {
    if(textVal.length < 3){}
    else{
      setLoading(true)
      if(isChecked2){
        setResultArray(returnSearchedArray(kato, textVal, isChecked1, true))
      }else {
        setResultArray(returnSearchedArray(kato, textVal, isChecked1, false))
      }
         
      setLoading(false)
    }
  }

  const handleListClick = (urlN: string) => {
    chrome.tabs.create({active: false, url : urlN})
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  return (
    <div className={classes.root}>
      <ThemeProvider theme={darkTheme}>
        <Box sx={{flexGrow: 1}}>
          <AppBar position='static' color='inherit'>
              <Toolbar>
                  <IconButton onClick={handleMenuClick} size='large' edge='start' color='inherit' aria-label='menu' sx={{ mr: 2 }}>
                    <MenuIcon />
                  </IconButton>
                  <Menu id='basic-menu' anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                    <MenuItem > 
                      <FormControlLabel control={<Checkbox color='secondary' checked={isChecked1} onChange={()=>{setIsChecked1(!isChecked1)}}/>} label='Case sensitive' />
                    </MenuItem>
                    <MenuItem >
                      <FormControlLabel control={<Checkbox color='secondary' checked={isChecked2} onChange={()=>{setIsChecked2(!isChecked2)}}/>} label='Search by username' />
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={()=>{handleListClick('https://github.com/snukduruk/searchsen')}}>
                      Source code and guide
                    </MenuItem>
                  </Menu>
                  <Link underline='none' color='inherit' sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                    onClick={() => {
                      const myAudio = new Audio(chrome.runtime.getURL('OH.mp3'))
                      myAudio.play()
                    }}>
                    <Typography variant ='h6'
                      noWrap
                      component='div'
                      className={classes.link}>Searchsen</Typography>
                  </Link>
                  
                  <Box sx={{width: 500, maxWidth: '50%'}}>
                    <TextField fullWidth label={textLabel} id='fullWidth' size='small' color='secondary' disabled={runText} value={textVal} onChange={e=> {
                      if(e.target.value.length < 3){
                          setIsInValid(true)
                      }
                      else{
                        setIsInValid(false)
                      }
                      return setTextVal(e.target.value)}}/>
                  </Box>
                  <Divider sx={{ height: 28, m: 0.5 }} orientation='vertical' />
                  <LoadingButton loading={loading} variant='contained' color='secondary' disabled={isInValid} onClick={async()=>{handleClick()}}>Search</LoadingButton>
              </Toolbar>
          </AppBar>
        </Box>
        <Box
          sx={{ width: '100%', height: '100%', maxWidth: 600, bgcolor: 'background.paper' }}>     
            <Virtuoso 
              style={{height:'435px', width:'600px'}}
              totalCount={resultArray.length}
              itemContent={
                index => 
                <ListItem key={index} component='div' disablePadding>
                  <ListItemButton component='a' onClick={()=>{handleListClick(`https://www.twitch.tv/videos/${vodId}${resultArray[index].intoVod}`)}}>
                    <Typography color='secondary'>{`[${resultArray[index].intoVod.substring(3)}] ${resultArray[index].user}: ${resultArray[index].message}`}</Typography>
                  </ListItemButton>
                </ListItem>}/>
        </Box>
      </ThemeProvider>
    </div>
  )
}

const root = document.createElement('div')
document.body.appendChild(root)
ReactDOM.render(<App/>, root)
