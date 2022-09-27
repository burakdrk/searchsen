import React from 'react'
import ReactDOM from 'react-dom'

const App: React.FC<{}> = () => {
  return (
    <div>
      <h1>YOU CAN NOW ACCESS THE EXTENSION FROM TWITCH'S TOP BAR. USE DARK MODE ON TWITCH IF YOU CANNOT SEE IT.</h1>
    </div>
  )
}

const root = document.createElement('div')
document.body.appendChild(root)
ReactDOM.render(<App/>, root)
