import React from 'react'
import Aux from '../../../hoc/Aux_'
import Logo from '../../Logo/Logo'
import NavigationItems from '../NavigationItems/NavigationItems'
import './SideDrawer.css'
import Backdrop from '../../UI/Backdrop/Backdrop'

const SideDrawer=(props)=>{

    //.......

    let attachedClasses = ["SideDrawer", "Close"]
    if(props.open){
        attachedClasses = ["SideDrawer", "Open"]
    }
    return(
        <Aux>
            <Backdrop show={props.open} clicked={props.closed} />
            <div className={attachedClasses.join(' ')}>
                <Logo height="11%"/>
                <nav>
                    <NavigationItems />
                </nav>
            </div>
        </Aux>
    );
}

export default SideDrawer