import React, {useEffect, useState} from 'react'
import { loadShift, outputHour } from '../redux'
import { useSelector, useDispatch } from 'react-redux';
import { changeDayShift, changeNightShift, changeShift } from '../redux/output_hour/output_hourActions';

const Shift_Shift = () => {

  const [shift, selectShift] = useState('First Shift');
  const shiftSelector = useSelector((state) => state.shift.shift_selected);
  



  const dispath = useDispatch();

  const selectShiftFun = (e) => {
    selectShift(e.target.value);
    dispath(loadShift({shift:e.target.value}))


    //change output hours according to the shift selected
    if(e.target.value === 'Second Shift' || e.target.value === 'Fourth Shift'){
      console.log('Night Shift Selected', e.target.value)
      dispath(changeNightShift({
        shift:e.target.value
      }))
    }else{
      console.log('Day Shift Selected')
      dispath(changeDayShift({
        shift:e.target.value
      }))
    }


    
  }

  useEffect(() => {
    console.log('Shift Selected', shiftSelector)
  },[shiftSelector])

  return (
    <div>
      <select onChange={selectShiftFun} className='months-picker'>
        <option className='select-option' value="First Shift" >First Shift</option>
        <option className='select-option' value="Second Shift" >Second Shift</option>
        <option className='select-option' value="Third Shift" >Third Shift</option>
        <option className='select-option' value="Fourth Shift" >Fourth Shift</option>
      </select>
      
    </div>
  )
}

export default Shift_Shift