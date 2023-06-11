import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { AppBar, FormControlLabel, ListItem, Menu, ListItemButton, MenuItem, Typography, TextField, Divider, Box, Toolbar, Checkbox, IconButton, Modal } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { LoadingButton } from '@mui/lab'
import { getVODInfo, getChatLogs, returnSearchedArray, checkChannel } from '../utils/api';
import { Virtuoso } from 'react-virtuoso';
import $ from 'jquery';
import './contentScript.css';
import Draggable from 'react-draggable';

let logArr = [];
let vodId: string = '';

const Icon = () => {
    const [isInValid, setIsInValid] = useState<boolean>(true);
    const [anchorEl, setAnchorEl] = useState<HTMLElement>(null);
    const [runText, setRunText] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [isChecked1, setIsChecked1] = useState<boolean>(false);
    const [isChecked2, setIsChecked2] = useState<boolean>(false);
    const [textVal, setTextVal] = useState<string>('');
    const [textLabel, setTextLabel] = useState<string>('');
    const [resultArray, setResultArray] = useState([]);
    const [open, setOpen] = useState(false);

    const initate = async () => {
        let ret = getTwitchTokens();

        if(ret.video_id === vodId) return;

        vodId = ret.video_id;
        setResultArray([]);
        setTextVal('');
        setIsInValid(true);
        setRunText(true);

        if(typeof ret.video_id !== 'undefined') {
            setLoading(true);
            setTextLabel('Fetching...');

            const data = await getVODInfo(ret);

            if(typeof data !== 'undefined') {
                const ch = await checkChannel();

                if(ch.channels.some(e => e.name === data.channelname)) {
                    const logs = await getChatLogs(data.created_at, data.length, data.channelname);
                    logArr = logs;
                    setTextLabel('Input');
                    setLoading(false);
                    setRunText(false);
                }
                else {
                    setLoading(false);
                    setTextLabel('Channel is not supported');
                }
            }
        }
        else {
            setTextLabel('Go to a Twitch VOD');
        }
    }

    const handleClick = () => {
        if(textVal.length >= 3) {
           setLoading(true);

            if(isChecked2) {
                setResultArray(returnSearchedArray(logArr, textVal, isChecked1, true));
            }
            else {
                setResultArray(returnSearchedArray(logArr, textVal, isChecked1, false));
            }
            
            setLoading(false); 
        }
    }
  
    const handleClose = () => {
      setAnchorEl(null)
    }
  
    const handleMenuClick = (event) => {
      setAnchorEl(event.currentTarget)
    }

    return (
        <div>
            <div className='searchsen-button'>
                <button onClick={() => {
                    //initate();
                    setOpen(true)}}>Searchsen
                </button>
            </div>
            <Draggable>
                <Modal open={open} onClose={() => setOpen(false)}>
                    <div></div>
                </Modal>
            </Draggable>
            



            {/* <Modal open={open} onClose={() => setOpen(false)}>
              <div>
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
                                  component='div'>Searchsen</Typography>
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
                                <Typography color='secondary'>{`[${resultArray[index].intoVod}] ${resultArray[index].user}: ${resultArray[index].message}`}</Typography>
                              </ListItemButton>
                            </ListItem>}/>
                    </Box>
                  </Box>
              </div>
            </Modal> */}
        </div>
    )
}

const getTwitchTokens = () => {
    const temp = document.cookie;
    return {
        video_id: /twitch\.tv\/videos\/(\d+)/.exec(window.location.href)?.[1],
        oauth: /(?<=%22authToken%22:%22).+?(?=%22)/.exec(temp)?.[0] ? 'OAuth ' + /(?<=%22authToken%22:%22).+?(?=%22)/.exec(temp)?.[0] : '',
        client_id: /(?<="Client-ID":"|clientId=").+?(?=")/.exec(Array.from(document.getElementsByTagName('script'))?.filter(i=> /(?<="Client-ID":"|clientId=").+?(?=")/.test(i.innerHTML))?.[0].innerHTML)?.[0]
    }
}

const root =  document.createElement('div');
root.style.marginLeft = '0.5rem';
root.style.marginRight = '0.5rem';
root.style.justifyContent = 'center';

const something = $('.top-nav__menu').children();
something[something.length-1].prepend(root);
ReactDOM.render(<Icon/>, root);