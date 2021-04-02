import {MeteorRainLoading} from "react-loadingg";
import React from "react";

function LoadingAnimation(props) {
    return (
        <div className='height'>
            <div className='loading-title'>Loading might take some time...</div>
            <br/>
            <div>
                <MeteorRainLoading size={'large'} color={'#18DCD6'}/>
            </div>
        </div>
    )
}
export default LoadingAnimation
