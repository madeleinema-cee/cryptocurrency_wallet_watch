import logo from "./Logo.png";
import React from "react";
import {Link} from "react-router-dom";

function refreshPage() {
    window.location.reload(false)

}

function MainPageHeader(props) {
    return (
        <div>
            <Link to={{pathname: `/`,
            state: {address: '',
                currency: ''
            }}}>
                <img className='image2' src={logo} alt='logo' />
                <div className='chart-title' type='button'>walletwatch.xyz</div>
            </Link>
        </div>
    )
}


export default MainPageHeader