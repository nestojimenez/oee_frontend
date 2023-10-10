import React, { useEffect } from 'react'

//Set up the use of the Reducer
import { useSelector } from "react-redux/es/hooks/useSelector";

const Output_Hour_Frame = () => {
    //const output = [150, 155, 110, 210, 180, 190, 210, 210, 225, 250, 250, 250 ]
    const target = 250

    const output_hour = useSelector((state)=> state.output_hour)
    //console.log(output_hour);

  return (
    <div className='output-hours-frame'>
       {output_hour && Object.values(output_hour).map((hour, index)=>{
        //console.log(hour)
        return(<div key={index} className='output-target' index={index}>
            <p>{`${hour}/${target}`}</p>
        </div>)
       })}
        
    </div>
  )
}

export default Output_Hour_Frame