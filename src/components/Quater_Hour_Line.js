import React from 'react'

const Quater_Hour_Line = ({marginLeft, text}) => {
  return (
    <div className='quarter-hour-line' style={{marginLeft:marginLeft}}>
        <p>{text}</p>
    </div>
  )
}

export default Quater_Hour_Line