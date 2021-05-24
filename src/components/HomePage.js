import logo from "./Logo.png";
import React from "react";

function HomePage(props) {
    return (
        <div>
            <img className='image' src={logo} alt='logo'/>
            <h1 className='title'>WALLETWATCH.XYZ</h1>
            <div className='subtitle'>Tracking the Progress of Your Cryptocurrency
                Investment
            </div>
        </div>
    )
}



export default HomePage
