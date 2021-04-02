import React from "react";


function Examples(props) {

    return (
        <div>
            <div className='example'>
                EXAMPLE ADDRESSES:
            </div>
            <div className='address'>
                <a type='button' id='address1'
                   >3E1jAe14xLtRhJDmBgQCu98fiV7A3eq211</a>
                <br/>
                <a type='button' id='address2'
                   >3JBqbYDLnQA7u2sNHraPL4yJSTjS3JUEa3</a>
                <br/>
                <a type='button' id='address3'
                   >3KYwVvvvfNApEDjnVjgQU4swmSPhNKCzwD</a>
            </div>
            <div className='copy-right-center'>
                <div className='copyright'>
                    <small>Made by <a className="copy-link" href="https://madeleinema.com/">Madeleine
                        Ma</a> @Copyright 2021</small>
                </div>
            </div>
        </div>
    )
}

export default Examples

