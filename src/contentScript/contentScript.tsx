import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { AppBar, FormControlLabel, ListItem, Menu, ListItemButton, MenuItem, Typography, TextField, Divider, Box, Toolbar, Checkbox, ThemeProvider, createTheme, IconButton, Modal, Button } from '@mui/material'
import { makeStyles } from '@mui/styles'
import MenuIcon from '@mui/icons-material/Menu'
import { LoadingButton } from '@mui/lab'
import { getVODInfo, getChatLogs, returnSearchedArray, checkChannel } from '../utils/api'
import { Virtuoso } from 'react-virtuoso'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import $ from 'jquery'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
  },
})

const colorTheme = createTheme({
  palette: {
    primary: {
      main: '#000000',
    },
    secondary: {
      main: '#ffffff',
    }
  }
})

const useStyles = makeStyles({
  root: {
    flexGrow: 1
  },
  link: {
    textDecoration: 'none',
  }
})

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '38em',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
}

let datum = []
let vodId: string = ''

const Icon = () => {
    const [isInValid, setIsInValid] = useState<null | boolean>(true)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [runText, setRunText] = useState<null | boolean>(true)
    const [loading, setLoading] = useState<null | boolean>(false)
    const [isChecked1, setIsChecked1] = useState<null | boolean>(false)
    const [isChecked2, setIsChecked2] = useState<null | boolean>(false)
    const [textVal, setTextVal] = useState<null | string>('')
    const [textLabel, setTextLabel] = useState<null | string>('')
    const [resultArray, setResultArray] = useState([])
    const [open, setOpen] = useState(false)
    const classes = useStyles()

    const initate = () => {
      let ret = getTwitchTokens()
      if(ret.video_id === vodId) return
      vodId = ret.video_id
      setResultArray([])
      setTextVal('')
      setIsInValid(true)
      setRunText(true)
      if(typeof ret.video_id !== 'undefined') {
          setLoading(true)
          setTextLabel('Fetching...')
          getVODInfo(ret)
          .then((data) => {
          if(typeof data !== 'undefined') {
              checkChannel(data.channel.name)
              .then((doto)=>{
              if(doto.channels.some(e => e.name === data.channel.name)) {
                  getChatLogs(data.created_at, data.length, data.channel.name)
                  .then((dota)=>{
                  datum = dota
                  setTextLabel('Input')
                  setLoading(false)
                  setRunText(false)
                  })
                  .catch((erol)=>{console.log(erol)})
              }
              else {
                  setLoading(false)
                  setTextLabel('Channel is not supported')
              }
              })
              .catch((eror)=>{console.log(eror)})
          }
          })
          .catch((err)=>{console.log(err)})
      }
      else {
          setTextLabel('Go to a Twitch VOD')
      }
    }

    const handleClick = () => {
      if(textVal.length < 3){}
      else{
        setLoading(true)
        if(isChecked2){
          setResultArray(returnSearchedArray(datum, textVal, isChecked1, true))
        }else {
          setResultArray(returnSearchedArray(datum, textVal, isChecked1, false))
        }
           
        setLoading(false)
      }
    }
  
    const handleClose = () => {
      setAnchorEl(null)
    }
  
    const handleMenuClick = (event) => {
      setAnchorEl(event.currentTarget)
    }

    const anan = () => {
      if ($('html').hasClass('tw-root--theme-light')) {
        return 'primary'
      }else {
        return 'secondary'
      }
    }

    return (
        <div>
          <ThemeProvider theme={colorTheme}>
              <Button color={anan()} size="small" variant="outlined" onClick={() => {
                initate();
                setOpen(true)}}>
              Searchsen</Button>
            </ThemeProvider>
            <Modal open={open} onClose={() => setOpen(false)}>
              <div className={classes.root}>
                <ThemeProvider theme={darkTheme}>
                  <Box sx={style}>
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
                                <MenuItem onClick={()=>{window.open('https://github.com/burakdrk/searchsen')}}>
                                  Source code and guide
                                </MenuItem>
                              </Menu>
                                <Typography variant ='h6'
                                  sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                                  noWrap
                                  component='div'
                                  className={classes.link}>Searchsen</Typography>
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
                      sx={{ width: '100%', height: '100%', maxWidth: '38em', bgcolor: 'background.paper' }}>     
                        <Virtuoso 
                          style={{height:'27em', width:'38em'}}
                          totalCount={resultArray.length}
                          itemContent={
                            index => 
                            <ListItem key={index} component='div' disablePadding>
                              <ListItemButton component='a' onClick={()=>{
                                const temp = document.getElementsByTagName('video')
                                temp[0].currentTime = resultArray[index].inSecs
                              }}>
                                <Typography color='secondary'>{`[${resultArray[index].intoVod.substring(3)}] ${resultArray[index].user}: ${resultArray[index].message}`}</Typography>
                              </ListItemButton>
                            </ListItem>}/>
                    </Box>
                  </Box>
                </ThemeProvider>
              </div>
            </Modal>
        </div>
    )
}

export const getTwitchTokens = () => {
  const temp = document.cookie
  return {
      video_id: /twitch\.tv\/videos\/(\d+)/.exec(window.location.href)?.[1],
      api_token: /(?<=api_token\=).+?(?=;)/.exec(temp)?.[0], 
      device_id: /(?<=unique_id\=).+?(?=;)/.exec(temp)?.[0],
      oauth: /(?<=%22authToken%22:%22).+?(?=%22)/.exec(temp)?.[0] ? 'OAuth ' + /(?<=%22authToken%22:%22).+?(?=%22)/.exec(temp)?.[0] : '',
      client_id: /(?<="Client-ID":"|clientId=").+?(?=")/.exec(Array.from(document.getElementsByTagName('script'))?.filter(i=> /(?<="Client-ID":"|clientId=").+?(?=")/.test(i.innerHTML))?.[0].innerHTML)?.[0]
  }
}

const root =  document.createElement('div')
root.style.marginLeft = '0.5rem'
root.style.marginRight = '0.5rem'
root.style.justifyContent = 'center'

const something = $('.top-nav__menu').children();
something[something.length-1].prepend(root);
ReactDOM.render(<Icon/>, root)