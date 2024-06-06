import React from 'react'
import { useSelector } from 'react-redux'

const Shift_Hours = () => {

   //useSelector for Shift Selected
   const shift_selected = useSelector((state) => state.shift.shift_selected);
   let hours = ['7:00', '8:00','9:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00' ]
 
   if(shift_selected === 'First Shift'){
    hours = ['7:00', '8:00','9:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00' ];
   }else if(shift_selected === 'Second Shift'){
    hours = ['19:00', '20:00','21:00','22:00','23:00','00:00','01:00','02:00','03:00','04:00','05:00','06:00' ];
   }

    
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