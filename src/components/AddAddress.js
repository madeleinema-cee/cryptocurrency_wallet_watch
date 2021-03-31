import React, {Component} from 'react';
import {Container, Row, Col, Button, Form, InputGroup, FormControl} from 'react-bootstrap';
import './mainForm.css';
import logo from './Logo.png'

export class AddAddress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            error: null,
            address: '',
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onChange(event) {
        this.setState({'address': event.target.value})
    }

    onSubmit = (event) => {
        //在 React 中另一个不同点是你不能通过返回 false 的方式阻止默认行为。你必须显式的使用 preventDefault 。
        event.preventDefault();
        this.props.addAddress(this.state.address)
        //this.state is like self.state
        this.setState({
            address: '',
            isLoaded: true
        })
    }

    render() {
        return (
            <Form onSubmit={this.onSubmit} inline>
                    <div className='special-form'>
                        <div className='input-area'>

                    <Form.Control type='text' name='address' placeholder='Add blockchain.com wallet address'
                           value={this.state.address} onChange={this.onChange}/>
                        </div>

                    <div className='form-submit'>
                        <div type='button'>Submit</div>
                    </div>
                    </div>


            </Form>

        )
    }
}

export default AddAddress