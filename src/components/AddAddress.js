import React, {Component} from 'react';
import './mainForm.css';
import HomePage from "./HomePage";
import {Container} from 'react-bootstrap';


export class AddAddress extends Component {
    constructor(props) {
        super(props);
        // const query = new URLSearchParams(this.props.location.search)
        this.state = {
            isLoaded: false,
            error: null,
            address: '',
            currency: 'btc',
            redirect: false
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    onChange(val) {
        this.setState({
            'address': val.target.value,
        })
    }

    handleChange(val) {
        this.setState({
            'currency': val.target.value,
        })
    }

    onSubmit = (event) => {
        event.preventDefault();
        this.props.addAddress(this.state.currency, this.state.address)
        this.setState({
            address: '',
            currency: '',
            isLoaded: true
        })
    }

    changeUrl = () => {
        this.props.history.push(`/address?address=${this.state.address}&currency=${this.state.currency}`)
    }

    inputAddress = () => {
        let address = document.getElementById('address1').textContent
        let currency = 'btc'
        this.props.history.push(`/address?address=${address}&currency=${currency}`)
    }

    inputAddress2 = () => {
        let address = document.getElementById('address2').textContent
        let currency = 'btc'
        this.props.history.push(`/address?address=${address}&currency=${currency}`)
    }

    inputAddress3 = () => {
        let address = document.getElementById('address3').textContent
        let currency = 'eth'
        this.props.history.push(`/address?address=${address}&currency=${currency}`)
    }


    render() {
        const options = [
            {value: 'btc', label: 'BTC'},
            {value: 'eth', label: 'ETH'}
        ];
        return (
            <React.Fragment>
                <div className='background'>
                    <Container className="my-auto">
                        <div className='center'>
                            <div>
                                <HomePage/>
                                <div onSubmit={this.onSubmit}>

                                    <div>
                                        <form>
                                            <input type='text' name='address' placeholder='Add wallet address'
                                                   value={this.state.address} onChange={this.onChange} required/>
                                            <select className='selectForm'
                                                    value={this.state.currency}
                                                    onChange={this.handleChange}>
                                                <option value='btc'>BTC</option>
                                                <option value='eth'>ETH</option>
                                            </select>
                                            <div className='form-submit' onClick={this.changeUrl}>
                                                <input type="submit" value="Submit"/>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div>
                                    <div className='example'>
                                        EXAMPLE ADDRESSES:
                                    </div>
                                    <div className='address'>
                                        <a type='button' id='address1' onClick={this.inputAddress}
                                        >3E1jAe14xLtRhJDmBgQCu98fiV7A3eq211</a>
                                        <br/>
                                        <a type='button' id='address2' onClick={this.inputAddress2}
                                        >3JBqbYDLnQA7u2sNHraPL4yJSTjS3JUEa3</a>
                                        <br/>
                                        <a type='button' id='address3' onClick={this.inputAddress3}
                                        >0x302d29399e287EFd15e37850909a8F5F4762B304</a>
                                    </div>
                                        <div className='main-page-copyright'>
                                            <small>Made by <a className="copy-link"
                                                              href="https://madeleinema.com/">Madeleine
                                                Ma</a> @Copyright 2021</small>
                                        </div>
                                </div>
                            </div>
                        </div>
                    </Container>
                </div>
            </React.Fragment>
        )
    }
}

export default AddAddress

