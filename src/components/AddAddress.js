import React, {Component} from 'react';
import {Container, Row, Col, Button, Form} from 'react-bootstrap';
import './mainForm.css'

export class AddAddress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            error: null,
            address: null,
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
            <div className='background'>
            <Container>
                <div className='center'>
                    <h1 className='title'>Cryptocurrency Wallet Watch</h1>
                    <br />
                    <br />
                    <Form onSubmit={this.onSubmit}>
                        <Form.Row>
                            <Col xs={10}>
                            <Form.Control className='form-inline' type='text' name='address' placeholder='Add blockchain.com wallet address'
                                   value={this.state.address} onChange={this.onChange}/>
                            </Col>
                            <Col xs={2}>

                            <Button variant="danger" type='submit'>Submit</Button>
                            </Col>
                        </Form.Row>
                    </Form>
                    </div>
            </Container>
            </div>
        )
    }
}

export default AddAddress