import React from 'react'

const ProducePart = ({producePartTime, currentHour, isDummy}) => {
    console.log('Produce part time: ', producePartTime)
    const secondHour = 3600;
    const durationPercentage = Number(producePartTime) * .0276
    //const durationPercentage = 100*(Number(producePartTime) / Number(secondHour));
    console.log(isDummy);
  return (
    producePartTime && isDummy === 0 ?
    <div className='circle' style={{left:`${Number(durationPercentage)}%`, cursor:'pointer'}}>
      
    </div> :
    <></>
  )
}

export default ProducePart