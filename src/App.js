import './App.css';
import React, {Component} from 'react';
import Addresses from "./components/Addresses";
import AddAddress from "./components/AddAddress";
import { Container, Row, Col, Button} from 'react-bootstrap'
import './main.css'
import { ResponsiveAreaBump } from '@nivo/bump'



class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            addresses: [],
            error: null,
            datesWithBalances: null
        }

        this.btcUsdApiBase = 'http://127.0.0.1:5000/api/btc?address='
    }

    fetchBitcoinTranscationDataWithAPI(address) {
        fetch(this.btcUsdApiBase + address)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        datesWithBalance: result,
                    });
                    console.log(this.state.datesWithBalance)
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )

    }

    formatBalances(inputData) {
        let data = {}
        for (let i = 0; i < inputData.length; i++) {
            let dateString = inputData[i]['time']
            let convertedCryptoAmount = inputData[i]['result']
            data[dateString] = convertedCryptoAmount

        }
        return data
    }



    addAddress = (address) => {
        this.fetchBitcoinTranscationDataWithAPI(address)

        // const newAddress = {
        //    address: address,
        // }
        // this.setState({addresses: [...this.state.addresses, newAddress]})

    }

    render() {
        const {isLoaded, address, datesWithBalance} = this.state;

        if (!isLoaded) {
            return (
                <React.Fragment>
                    <AddAddress addAddress={this.addAddress}/>

                </React.Fragment>)
        }

        return (
            <React.Fragment>
                <div className='special'>
                <Container>
                <Addresses addresses={this.state.addresses}/>
                <div>
                    <div>test</div>
                    {Object.keys(this.state.datesWithBalance).map((key, index) => (
                        <p key={key}>{key} | {datesWithBalance[key]}</p>
                    ))
                    }
                </div>
                </Container>
                <Container fluid="md">
  <Row>
    <Col>1 of 1</Col>
  </Row>
</Container>
                </div>

            </React.Fragment>

        )
    }
}


export default App;