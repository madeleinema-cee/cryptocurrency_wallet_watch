import React, {useEffect} from 'react';

function setTimeout() {

}

function ErrorAlert(props) {
    return (
        <div>
            setTimeout(() => {
  console.log('Hello, World!')
}, 3000);
        </div>
    );
}

export default ErrorAlert;