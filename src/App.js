import './App.css';
import React, {Component} from 'react';
import AddAddress from "./components/AddAddress";
import {Col, Container, Row} from 'react-bootstrap';
import './main.css';
import {
    createContainer,
    VictoryArea,
    VictoryAxis,
    VictoryBrushContainer,
    VictoryChart,
    VictoryLine,
    VictoryTooltip
} from 'victory';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            addresses: [],
            error: null,
            datesWithBalances: [],
            currentBalance: null
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
                        datesWithBalance: this.formatData(result),
                        address: address,
                        currentBalance: this.getCurrentBalance(result)
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

    formatData(inputData) {
        for (let i = 0; i < inputData.length; i++) {
            inputData[i]['x'] = new Date(inputData[i]['x'])
            inputData[i]['y'] = Math.round(inputData[i]['y'])
        }
        return inputData
    }

    getCurrentBalance(inputData) {
        return inputData[inputData.length - 1]['y']
    }

    addAddress = (address) => {
        this.fetchBitcoinTranscationDataWithAPI(address)
    }

    handleZoom(domain) {
        this.setState({selectedDomain: domain})
    }

    handleBrush(domain) {
        this.setState({zoomDomain: domain});
    }

    render() {
        const {isLoaded, address, datesWithBalance, currentBalance} = this.state;
        const VictoryZoomVoronoiContainer = createContainer('zoom', 'voronoi')

        if (!isLoaded) {
            return (
                <React.Fragment>
                    <AddAddress addAddress={this.addAddress}/>

                </React.Fragment>)
        }

        return (
            <React.Fragment>
                <div className='height'>
                    <Row>
                        <Col lg={9}>
                            <div className='main-chart'>
                                <div className='chart-title'>Bitcoin Wallet Balance (USD)</div>
                                <div className='small-title'>Address: {this.state.address}</div>
                                <VictoryChart width={1000} height={500} scale={{x: 'time'}} containerComponent={
                                    <VictoryZoomVoronoiContainer zoomDimension='x'
                                                                 zoomDomain={this.state.zoomDomain}
                                                                 onZoomDomainChange={this.handleZoom.bind(this)}
                                                                 labels={({datum}) => `$${datum.y}
${(datum.x).toLocaleString()}`}
                                                                 labelComponent={<VictoryTooltip
                                                                     flyoutStyle={{stroke: '#41b6c4', fill: '#41b6c4'}}
                                                                     flyoutWidth={200}

                                                                 />}
                                    />
                                }
                                >
                                    <VictoryAxis crossAxis
                                                 style={{
                                                     axis: {
                                                         stroke: '#d1d9e0'
                                                     },
                                                     tickLabels: {
                                                         fill: '#d1d9e0',
                                                     },
                                                     grid: {
                                                         stroke: ({tick}) => tick > 1 ? "#adb5bd" : "#adb5bd",
                                                         opacity: 0.1
                                                     }

                                                 }}
                                                 padding={{bottom: 20}}
                                    />
                                    <VictoryAxis dependentAxis crossAxis
                                                 label='USD'
                                                 style={{
                                                     axis: {
                                                         stroke: '#d1d9e0'
                                                     },
                                                     tickLabels: {
                                                         fill: '#d1d9e0'
                                                     },
                                                     grid: {
                                                         stroke: ({tick}) => tick > 5000 ? "#adb5bd" : "#adb5bd",
                                                         opacity: 0.1
                                                     }

                                                 }}/>
                                    <VictoryArea style={{data: {fill: '#7fcdbb', fillOpacity: 0.1, stroke: '#41b6c4'}}}
                                                 data={this.state.datesWithBalance}
                                    />
                                </VictoryChart>


                                <VictoryChart width={1000} height={200} scale={{x: 'time'}} containerComponent={
                                    <VictoryBrushContainer brushDimension='x'
                                                           brushDomain={this.state.selectedDomain}
                                                           onBrushDomainChange={this.handleBrush.bind(this)}
                                                           brushStyle={{fill: '#7fcdbb', opacity: 0.4}}
                                    />
                                }
                                >
                                    <VictoryAxis
                                        tickValues={[new Date('2020-12-12 23:00:00'), new Date('2021-02-25 16:00:00')]}
                                        tickFormat={(x) => new Date(x).getMonth()} style={{
                                        axis: {
                                            stroke: '#d1d9e0'
                                        },
                                        tickLabels: {
                                            fill: '#d1d9e0'
                                        }

                                    }}

                                    />

                                    <VictoryAxis dependentAxis
                                                 style={{
                                                     axis: {
                                                         stroke: '#d1d9e0'
                                                     },
                                                     tickLabels: {
                                                         fill: '#d1d9e0'
                                                     }

                                                 }}/>

                                    <VictoryLine
                                        style={{
                                            data: {stroke: "#41b6c4"},
                                            parent: {border: "1px solid #41b6c4"}
                                        }}
                                        data={this.state.datesWithBalance}

                                    />
                                </VictoryChart>
                            </div>
                        </Col>
                        <Col lg={3}>
                            <div className='main-chart'>
                                <div className='balance'>Current Balance: {this.state.currentBalance} usd</div>
                                <div className='balance'>Current Exchange Rate:</div>
                                <div className='balance'>Hourly:</div>
                                <div className='balance'>Weekly:</div>
                                <div className='balance'>Yearly:</div>
                                <div className='balance'>Transaction History:</div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </React.Fragment>

        )
    }
}


export default App;