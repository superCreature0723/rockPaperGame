import React from 'react'
import ControllerItem from './ControllerItem'

const Controller = () => {
    return (
        <div className='w-full mt-28 md:mt-12 flex gap-4 md:gap-8 items-center justify-center'>
            <ControllerItem path='/images/rock-user.png' />
            <ControllerItem path='/images/paper-user.png' />
            <ControllerItem path='/images/scissors-user.png' />
        </div>
    )
}

export default Controller