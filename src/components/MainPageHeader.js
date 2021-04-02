import logo from "./Logo.png";
import React from "react";

function refreshPage() {
        window.location.reload(false)
    }

function MainPageHeader(props) {
    return (
        <div>
            <img className='image2' src={logo} alt='logo' onClick={refreshPage}/>
            <div className='chart-title' type='button' onClick={refreshPage}>walletwatch.xyz</div>
        </div>
    )
}


export default MainPageHeader