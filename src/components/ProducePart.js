import React from 'react'

const ProducePart = ({producePartTime, currentHour}) => {
    console.log('Produce part time: ', producePartTime)
    const secondHour = 3600;
    const durationPercentage = Number(producePartTime) * .0276
    //const durationPercentage = 100*(Number(producePartTime) / Number(secondHour));
    console.log(durationPercentage, currentHour)
  return (
    producePartTime ?
    <div className='circle' style={{left:`${Number(durationPercentage)}%`}}></div> :
    <></>
  )
}

export default ProducePart