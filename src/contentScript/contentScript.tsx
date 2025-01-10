import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { getVODInfo, getChatLogs, returnSearchedArray, checkChannel, strDifference } from '../utils/api';
import { Virtuoso } from 'react-virtuoso';
import { GetTwitchTokens } from '../utils/Tokens';
import Switch from 'react-switch';
import './contentScript.css';
import $ from 'jquery';
import { ChatLog } from '../types';
import Draggable from 'react-draggable';

let logArr: ChatLog[] = [];
let VodId: string = '';
let isLoading: boolean = false;
let isCalled: boolean = false;
let ret = GetTwitchTokens();

const Icon = () => {
  const [isInValid, setIsInValid] = useState<boolean>(true);
  const [runText, setRunText] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [isChecked1, setIsChecked1] = useState<boolean>(false);
  const [isChecked2, setIsChecked2] = useState<boolean>(false);
  const [isChecked3, setIsChecked3] = useState<boolean>(false);
  const [textVal, setTextVal] = useState<string>('');
  const [textLabel, setTextLabel] = useState<string>('');
  const [resultArray, setResultArray] = useState<ChatLog[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    function handleURLChangeWhenLoading(request, sender, sendResponse) {
      if (isLoading) {
        isLoading = false;
        VodId = '';
        setLoading(false);
        setTextLabel('You left the VOD. Download cancelled.');
      }
    }
    chrome.runtime.onMessage.addListener(handleURLChangeWhenLoading);
  }, []);

  const initate = async () => {
    if (ret.video_id === VodId) return;
    VodId = ret.video_id;
    setResultArray([]);
    setTextVal('');
    setIsInValid(true);
    setTextLabel('');
    setRunText(true);
    setLoading(false);
    logArr = [];

    if (typeof ret.video_id !== 'undefined') {
      setLoading(true);
      isLoading = true;
      setTextLabel('Fetching...');

      const data = await getVODInfo(ret);

      if (typeof data !== 'undefined') {
        const ch = await checkChannel();

        if (ch.channels.some((e) => e.name === data.channelname)) {
          setTextLabel(`Downloading logs...`);
          logArr = await getChatLogs(data.created_at, data.length, data.channelname);
          if (!isLoading) return;
          isLoading = false;
          setLoading(false);
          setRunText(false);
          setTextLabel(`Done.`);
        } else {
          let temp: any = await chrome.runtime.sendMessage({ command: 'get_logs_from_twitch', data: { params: ret, offset: 0, cursor: null } });
          if (temp?.status === 'error') {
            setTextLabel('Error retrieving logs. Try again later.');
            isLoading = false;
            setLoading(false);
            return;
          }
          try {
            const comments = temp?.data?.[0]?.data?.video?.comments;
            comments.edges.forEach((e: any) => {
              const commenter = e?.node?.commenter;
              const messageFragments = e?.node?.message?.fragments;

              if (!commenter || !messageFragments?.[0]) return;

              logArr.push({
                inSecs: e.node.contentOffsetSeconds,
                intoVod: strDifference(e.node.contentOffsetSeconds),
                user: e.node.commenter.login,
                message: e.node.message.fragments.map((f: any) => f.text).join(''),
                userColor: e.node.message.userColor,
              });
            });
          } catch (e) {
            console.error(e);
            console.log('Error in fetching logs');
            isLoading = false;
            setLoading(false);
            setTextLabel('Failed.');
            return;
          }

          setTextLabel('Fetching... ' + Math.round((logArr.at(-1).inSecs * 100) / data.length) + '%');

          let cursor = null;
          if (temp.data[0].data.video.comments.pageInfo.hasNextPage) {
            cursor = temp.data[0].data.video.comments.edges.at(-1).cursor;
          }

          while (true) {
            if (!isLoading) return;

            temp = await chrome.runtime.sendMessage({ command: 'get_logs_from_twitch', data: { params: ret, offset: null, cursor: cursor } });
            if (temp.status === 'error') {
              setTextLabel('Error retrieving logs. Try again later.');
              isLoading = false;
              setLoading(false);
              return;
            }

            try {
              temp?.data?.[0]?.data?.video?.comments?.edges?.forEach((e) => {
                if (e?.node?.commenter == null) return;
                if (e?.node?.message?.fragments?.[0] == null) return;

                logArr.push({
                  inSecs: e.node.contentOffsetSeconds,
                  intoVod: strDifference(e.node.contentOffsetSeconds),
                  user: e.node.commenter.login,
                  message: e.node.message.fragments.map((f) => f.text).join(''),
                  userColor: e.node.message.userColor,
                });
              });
            } catch (e) {
              console.error(e);
              isLoading = false;
              setLoading(false);
              setTextLabel('Failed.');
              setRunText(false);
              return;
            }

            if (isLoading) setTextLabel('Fetching... ' + Math.round((logArr.at(-1).inSecs * 100) / data.length) + '%');

            if (temp?.data?.[0]?.data?.video?.comments?.pageInfo?.hasNextPage) {
              cursor = temp.data[0].data.video.comments.edges.at(-1).cursor;
            } else {
              break;
            }
          }
          setTextLabel('Done.');
          isLoading = false;
          setLoading(false);
          setRunText(false);
        }
      } else {
        isLoading = false;
        setLoading(false);
        setTextLabel('Could not retrieve VOD info. Try again later.');
      }
    } else {
      setTextLabel('Go To a Twitch Vod');
    }
  };
  const handleClick = () => {
    if (textVal.length >= 2) {
      setResultArray(returnSearchedArray(logArr, textVal, isChecked1, isChecked2, isChecked3));
    }
  };
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleClick();
    }
  };

  const CopyUserName = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    const MouseOver = e.currentTarget.innerText;
    navigator.clipboard.writeText(MouseOver.includes(':') ? MouseOver.split(':')[0] : MouseOver);
    isCalled = true;
  };

  if (ret.video_id) {
    initate();
  }
  return (
    <div>
      <div className="searchsen-button">
        <button
          style={{ display: 'flex', alignItems: 'center', placeContent: 'center' }}
          onClick={() => {
            !isOpen ? initate() && setIsOpen(!isOpen) : setIsOpen(!isOpen);
          }}
        >
          Searchsen
        </button>
      </div>
      {isOpen && (
        <Draggable handle=".searchsen-logo-top">
          <div className="searchsen-container">
            <div className="searchsen-logo">
              <div className="searchsen-logo-top">
                <span className="searchsen-menu-logo" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                  ⚙
                </span>
                Searchsen
                <span onClick={() => setIsOpen(false)}>ⓧ</span>
              </div>
              <div className="searchsen-menu" style={{ display: isMenuOpen ? 'flex' : 'none', maxHeight: isMenuOpen ? '500px' : '0px' }}>
                <label>
                  <Switch
                    onColor="#9047ff"
                    onHandleColor="#6e36c2"
                    handleDiameter={18}
                    uncheckedIcon={false}
                    checkedIcon={false}
                    boxShadow="0px 1px 2.5px rgba(0, 0, 0, 0.6)"
                    activeBoxShadow="0px 0px 1px 5px rgba(0, 0, 0, 0.2)"
                    height={15}
                    width={32}
                    checked={isChecked1}
                    onChange={() => (setIsChecked1(!isChecked1), setIsChecked3(false))}
                  />
                  <span>Case sensitive</span>
                </label>
                <label>
                  <Switch
                    onColor="#9047ff"
                    onHandleColor="#6e36c2"
                    handleDiameter={18}
                    uncheckedIcon={false}
                    checkedIcon={false}
                    boxShadow="0px 1px 2.5px rgba(0, 0, 0, 0.6)"
                    activeBoxShadow="0px 0px 1px 5px rgba(0, 0, 0, 0.2)"
                    height={15}
                    width={32}
                    checked={isChecked2}
                    onChange={() => (setIsChecked2(!isChecked2), setIsChecked3(false))}
                  />
                  <span>Search by username</span>
                </label>
                <label>
                  <Switch
                    onColor="#9047ff"
                    onHandleColor="#6e36c2"
                    handleDiameter={18}
                    uncheckedIcon={false}
                    checkedIcon={false}
                    boxShadow="0px 1px 2.5px rgba(0, 0, 0, 0.6)"
                    activeBoxShadow="0px 0px 1px 5px rgba(0, 0, 0, 0.2)"
                    height={15}
                    width={32}
                    checked={isChecked3}
                    onChange={() => (setIsChecked3(!isChecked3), setIsChecked1(false), setIsChecked2(false))}
                  />
                  <span>Regex search</span>
                </label>
                <div onClick={() => window.open('https://github.com/burakdrk/searchsen', '_blank')}>Guide and source code</div>
                {!runText && (
                  <div
                    onClick={() => {
                      const a = document.createElement('a');
                      const file = new Blob([JSON.stringify(logArr)], { type: 'text/plain;charset=utf-8' });
                      a.href = URL.createObjectURL(file);
                      a.download = `searchsen_${VodId}.json`;
                      a.click();
                    }}
                  >
                    Download Chat JSON
                  </div>
                )}
              </div>
            </div>
            <div className="searchsen-search" style={{ padding: isMenuOpen ? '10px' : '4px 10px 10px' }}>
              <input
                disabled={runText}
                type="text"
                value={textVal}
                placeholder={isChecked2 ? 'Search By Username' : 'Search Chat Logs'}
                onKeyDown={handleKeyPress}
                onChange={(e) => {
                  setTextVal(e.target.value);
                  e.target.value.length < 2 ? setIsInValid(true) : setIsInValid(false);
                }}
              ></input>
              <button onClick={() => handleClick()} disabled={isInValid}>
                SEARCH
              </button>
            </div>
            <div className="searchsen-results" style={{ display: runText ? 'none' : 'block' }}>
              <Virtuoso
                totalCount={resultArray.length}
                style={{ height: isMenuOpen ? '200px' : '363.5px' }}
                itemContent={(index) => {
                  return (
                    <div
                      className="searchsen-result-box"
                      onClick={() => {
                        if (!isCalled) {
                          const temp = document.getElementsByTagName('video');
                          temp[0].currentTime = resultArray[index].inSecs;
                        } else {
                          isCalled = false;
                        }
                      }}
                    >
                      <span style={{ fontSize: '10px', fontFamily: 'sans-serif', color: '#ffffffbf' }}>{`[${resultArray[index].intoVod}] `}</span>
                      <span
                        onClick={(e) => {
                          CopyUserName(e);
                        }}
                        style={{ fontWeight: '600', fontFamily: 'sans-serif', color: resultArray[index].userColor }}
                      >
                        {`${resultArray[index].user.charAt(0).toUpperCase() + resultArray[index].user.slice(1)}:`}{' '}
                      </span>
                      {` ${resultArray[index].message}`}
                    </div>
                  );
                }}
              />
            </div>
            <div className="searchsen-loading">
              <div className="searchsen-loader" style={{ display: loading ? 'block' : 'none' }}>
                <svg width="38" height="38" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#fff">
                  <g fill="none" fillRule="evenodd">
                    <g transform="translate(1 1)" strokeWidth="2">
                      <circle strokeOpacity=".5" cx="18" cy="18" r="18" />
                      <path d="M36 18c0-9.94-8.06-18-18-18">
                        <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite" />
                      </path>
                    </g>
                  </g>
                </svg>
              </div>
              <div className="searchsen-loading-text" style={{ display: runText ? 'block' : 'none' }}>
                {textLabel}
              </div>
            </div>
          </div>
        </Draggable>
      )}
    </div>
  );
};

const root = document.createElement('div');
root.style.marginLeft = '0.5rem';
root.style.marginRight = '0.5rem';
root.style.justifyContent = 'center';

const something = $('.top-nav__menu').children();
something[something.length - 1].prepend(root);
ReactDOM.render(<Icon />, root);
