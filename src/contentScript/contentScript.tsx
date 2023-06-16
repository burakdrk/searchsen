import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { getVODInfo, getChatLogs, returnSearchedArray, checkChannel, getChatLogsFromTwitch } from '../utils/api';
import { Virtuoso } from 'react-virtuoso';
import Switch from "react-switch";
import './contentScript.css';
import $ from 'jquery';
import Draggable from 'react-draggable';

let logArr = [];
let vodId: string = '';

const Icon = () => {
    const [isInValid, setIsInValid] = useState<boolean>(true);
    const [runText, setRunText] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [isChecked1, setIsChecked1] = useState<boolean>(false);
    const [isChecked2, setIsChecked2] = useState<boolean>(false);
    const [isChecked3, setIsChecked3] = useState<boolean>(false);
    const [textVal, setTextVal] = useState<string>('');
    const [textLabel, setTextLabel] = useState<string>('');
    const [resultArray, setResultArray] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

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
                    logArr = await getChatLogs(data.created_at, data.length, data.channelname, setTextLabel);
                    setTextLabel('Input');
                    setLoading(false);
                    setRunText(false);
                }
                else {
                    await getChatLogsFromTwitch(data.created_at, data.length, data.channelname, setTextLabel);
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
        if(textVal.length >= 2) {
            setResultArray(returnSearchedArray(logArr, textVal, isChecked1, isChecked2, isChecked3));
        }
    }

    return (
        <div>
            <div className='searchsen-button'>
                <button onClick={() => {
                    if (!isOpen) initate();
                    setIsOpen(!isOpen)}}>
                        Searchsen
                </button>
            </div>
            {isOpen && 
            <Draggable handle='.searchsen-logo-top'>
                <div className='searchsen-container'>
                    <div className='searchsen-logo'>
                        <div className='searchsen-logo-top'>
                            <span className='searchsen-menu-logo' onClick={() => setIsMenuOpen(!isMenuOpen)}>⚙</span>
                            Searchsen
                            <span onClick={() => setIsOpen(false)}>ⓧ</span>
                        </div>
                        <div className='searchsen-menu' style={{display: isMenuOpen ? 'flex' : 'none', maxHeight: isMenuOpen ? '500px' : '0px'}}>
                            <label>
                                <Switch onColor="#9047ff"
                                    onHandleColor="#6e36c2"
                                    handleDiameter={18}
                                    uncheckedIcon={false}
                                    checkedIcon={false}
                                    boxShadow="0px 1px 2.5px rgba(0, 0, 0, 0.6)"
                                    activeBoxShadow="0px 0px 1px 5px rgba(0, 0, 0, 0.2)"
                                    height={15}
                                    width={32} checked={isChecked1} onChange={() => (setIsChecked1(!isChecked1), setIsChecked3(false))}/>
                                <span>Case sensitive</span>
                            </label>
                            <label>
                                <Switch onColor="#9047ff"
                                    onHandleColor="#6e36c2"
                                    handleDiameter={18}
                                    uncheckedIcon={false}
                                    checkedIcon={false}
                                    boxShadow="0px 1px 2.5px rgba(0, 0, 0, 0.6)"
                                    activeBoxShadow="0px 0px 1px 5px rgba(0, 0, 0, 0.2)"
                                    height={15}
                                    width={32} checked={isChecked2} onChange={() => (setIsChecked2(!isChecked2), setIsChecked3(false))}/>
                                <span>Search by username</span>
                            </label>
                            <label>
                                <Switch onColor="#9047ff"
                                    onHandleColor="#6e36c2"
                                    handleDiameter={18}
                                    uncheckedIcon={false}
                                    checkedIcon={false}
                                    boxShadow="0px 1px 2.5px rgba(0, 0, 0, 0.6)"
                                    activeBoxShadow="0px 0px 1px 5px rgba(0, 0, 0, 0.2)"
                                    height={15}
                                    width={32} checked={isChecked3} onChange={() => (setIsChecked3(!isChecked3), setIsChecked1(false), setIsChecked2(false))}/>
                                <span>Regex search</span>
                            </label>
                            <div onClick={() => window.open('https://github.com/burakdrk/searchsen', '_blank')}>Guide and source code</div>
                        </div>
                    </div>
                    <div className='searchsen-search' style={{padding: isMenuOpen ? '10px' : '4px 10px 10px'}}>
                        <input disabled={runText} type='text' value={textVal} placeholder='Input' onChange={e => {
                            setTextVal(e.target.value);
                            e.target.value.length < 2 ? setIsInValid(true) : setIsInValid(false);
                            }}></input>
                        <button onClick={() => handleClick()} disabled={isInValid}>SEARCH</button>
                    </div>
                    <div className='searchsen-results' style={{display: runText ? 'none' : 'block'}}>
                        <Virtuoso
                            totalCount={resultArray.length}
                            style={{height: isMenuOpen ? '229.5px' : '363.5px'}}
                            itemContent = {(index) => {
                                return (
                                    <div className='searchsen-result-box' onClick={() => {
                                        const temp = document.getElementsByTagName('video')
                                        temp[0].currentTime = resultArray[index].inSecs}}>
                                        <span style={{fontSize: '10px', color:'#ffffffbf'}}>{`[${resultArray[index].intoVod}] `}</span><span style={{fontWeight: '600', color: resultArray[index].userColor}}>{`${resultArray[index].user}:`}</span>{` ${resultArray[index].message}`}
                                    </div>
                                )}
                            }
                        />
                    </div>
                    <div className='searchsen-loading'>
                        <div className='searchsen-loader' style={{display: loading ? 'block' : 'none'}}>
                            <svg width="38" height="38" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#fff">
                                <g fill="none" fillRule="evenodd">
                                    <g transform="translate(1 1)" strokeWidth="2">
                                        <circle strokeOpacity=".5" cx="18" cy="18" r="18"/>
                                        <path d="M36 18c0-9.94-8.06-18-18-18">
                                            <animateTransform
                                                attributeName="transform"
                                                type="rotate"
                                                from="0 18 18"
                                                to="360 18 18"
                                                dur="1s"
                                                repeatCount="indefinite"/>
                                        </path>
                                    </g>
                                </g>
                            </svg>
                        </div>
                        <div className='searchsen-loading-text' style={{display: runText ? 'block' : 'none'}}>{textLabel}</div>
                    </div>
                </div>
            </Draggable>}
        </div>
    );
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