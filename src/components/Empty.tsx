import React from 'react'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import '../assets/Empty.css'

export const Empty = () => {
  return (
    <div className='loading-container'>
      <div className='spinner'></div>
    </div>
 )
}
