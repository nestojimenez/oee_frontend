import React from 'react'

const Shift_Hours = () => {

    const hours = ['7:00', '8:00','9:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00' ]
    const color = ['#151515', '#101010']
  return (
    <div className='shift-hours'>
       {hours.map((hour, index)=>{
        return(<div className='hours' key={index}>
            <p>{hour}</p>
        </div>)
       })}
        
    </div>
  )
}

export default Shift_Hours