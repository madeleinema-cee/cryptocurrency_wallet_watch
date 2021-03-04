import './App.css';
import React, {Component} from 'react';
import AddAddress from "./components/AddAddress";
import {Button, Col, Container, Form, Row, Accordion, Card, NavLink} from 'react-bootstrap';
import './main.css';
import {
    Chart,
    createContainer,
    ChartArea,
    ChartAxis,
    ChartLine, ChartTooltip
} from '@patternfly/react-charts';

import {VictoryBrushContainer, VictoryTooltip} from "victory";
import moment from "moment";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {Search} from 'react-bootstrap-icons';


import logo from './components/LogoMakr-9QWe9O.png'


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            addresses: [],
            error: null,
            datesWithBalances: [],
            currentBalance: null,
            monthRange: [],
            currencyExchangeRate: null,
            topFiveTransactionHistory: null,
            profitMargin: null,
            totalInvested: null,
            btcBalance: null,
            newAddress: '',
        }

        this.btcUsdApiBase = 'http://127.0.0.1:5000/api/btc?address=';

    }


    fetchBitcoinTranscationDataWithAPI(address) {
        fetch(this.btcUsdApiBase + address)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        datesWithBalance: this.formatData(result.balance),
                        address: address,
                        currentBalance: result.balance[result.balance.length - 1]['y'],
                        monthRange: this.getMonthRange(result.balance),
                        currencyExchangeRate: result.btctousd,
                        topFiveTransactionHistory: this.getTopFiveTransactionHistory(result.transactionhistory).topFive,
                        restTransactionHistory: this.getTopFiveTransactionHistory(result.transactionhistory).rest,
                        totalInvested: result.totalinvested.toFixed(2),
                        btcBalance: (result.btcbalance).toFixed(8)

                    });
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

    getMonthRange(inputData) {
        let startDate = moment(inputData[0]['x'])
        let endDate = moment(inputData[inputData.length - 1]['x'])
        let result = []
        while (startDate.isBefore(endDate)) {
            result.push(new Date(startDate.format()).getTime());
            startDate.add(1, "month")
        }
        return result
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

    getTopFiveTransactionHistory(inputData) {
        let transactionHistory = {}
        let topFiveTransactionHistory = {}
        let restOfTransactionHistory = {}
        for (let i = 0; i < 5; i++) {
            let key = Object.keys(inputData)[i]
            topFiveTransactionHistory[key] = inputData[key]
        }

        for (let i = 5; i < Object.keys(inputData).length; i++) {
            let key = Object.keys(inputData)[i]
            restOfTransactionHistory[key] = inputData[key]
        }
        transactionHistory['topFive'] = topFiveTransactionHistory
        transactionHistory['rest'] = restOfTransactionHistory


        // console.log(topFiveTransactionHistory)
        console.log(restOfTransactionHistory)
        return transactionHistory
    }


    render() {
        const {
            isLoaded, address, datesWithBalance, currentBalance, monthRange, currencyExchangeRate,
            topFiveTransactionHistory, totalInvested, btcBalance, restTransactionHistory
        } = this.state;
        const ZoomVoronoiCursorContainer = createContainer('zoom', 'voronoi');
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        if (!isLoaded) {
            return (
                <React.Fragment>
                    <div className='background'>
                        <Container className="my-auto">
                            <div className='center'>
                                <div>
                                    <img className='image' src={logo} alt='logo'/>
                                    <h1 className='title'>Cryptocurrency Wallet Watch</h1>
                                    <AddAddress addAddress={this.addAddress}/>
                                </div>
                            </div>
                        </Container>
                    </div>

                </React.Fragment>
            )
        }
        if (restTransactionHistory) {
            return (
                <React.Fragment>
                    <div className='height'>
                        <Container>
                            <div className='center'>
                                <img className='image2' src={logo} alt='logo'/>
                                <div className='chart-title'>walletwatch.xyz</div>
                            </div>
                            <br/>
                            <div className='addressSection'>
                                <div className='small-title'>Address: {this.state.address}</div>

                                <div style={{
                                    position: 'absolute',
                                    right: '13%',
                                    top: '8%',
                                    height: '50%',
                                    display: 'inline-block'
                                }}>
                                    <AddAddress addAddress={this.addAddress}/>
                                </div>
                                <br/>
                            </div>


                            <div className='main-chart'>
                                <Row>
                                    <Col>
                                        <div>
                                            <p className='balance'>CURRENT BALANCE</p><p className='small-tag'>USD</p>
                                            <p className='currentBalance'> {this.state.currentBalance}</p>
                                        </div>
                                        <div>
                                            <p className='balance'>BTC BALANCE</p><p className='small-tag'>BTC</p>
                                            <p className='data'>{this.state.btcBalance}</p>
                                        </div>
                                    </Col>
                                    <Col style={{borderLeft: '2px solid grey', borderRight: '2px solid grey'}}>
                                        <div>
                                            <p className='balance'>TOTAL INVESTED</p><p className='small-tag'>USD</p>
                                            <p className='data'>{this.state.totalInvested}</p>
                                        </div>
                                        <div>
                                            <div className='balance'>PROFIT MARGIN</div>
                                            <p className='data'>{((this.state.currentBalance - this.state.totalInvested) / this.state.currentBalance * 100)
                                                .toFixed(2)} %</p>
                                        </div>
                                    </Col>
                                    <Col>
                                        <div>
                                            <p className='balance'>PROFIT</p><p className='small-tag'>USD</p>
                                            <p className='data'>{(this.state.currentBalance - this.state.totalInvested).toFixed(2)}</p>
                                        </div>
                                        <div>
                                            <p className='balance'>BTC PRICE</p><p className='small-tag'>USD</p>
                                            <p className='data'>{this.state.currencyExchangeRate}</p>
                                        </div>
                                    </Col>

                                </Row>
                            </div>
                            <br/>

                            <div className='main-chart'>
                                <div className='chart'>
                                    <Chart width={950} height={350} scale={{x: 'time'}}
                                           containerComponent={
                                               <ZoomVoronoiCursorContainer zoomDimension='x'
                                                                           zoomDomain={this.state.zoomDomain}
                                                                           onZoomDomainChange={this.handleZoom.bind(this)}
                                                                           mouseFollowTooltips
                                                                           voronoiDimension="x"
                                                                           labels={({datum}) => `$${datum.y}
                                                                 
${moment(datum.x).format('YYYY-M-DD H:mm')}`}
                                                                           labelComponent={
                                                                               <VictoryTooltip
                                                                                   cornerRadius={3}
                                                                                   flyoutWidth={250}
                                                                                   flyoutStyle={{
                                                                                       fill: '#392f41',
                                                                                       opacity: 0.8
                                                                                   }}
                                                                                   style={{
                                                                                       fontSize: '20px',
                                                                                       fontFamily: 'Istok Web',
                                                                                       fill: 'white',
                                                                                       textAlign: 'left'
                                                                                   }}
                                                                               />
                                                                           }
                                               />
                                           }
                                    >
                                        <ChartAxis crossAxis
                                                   style={{
                                                       axis: {
                                                           stroke: '#d1d9e0'
                                                       },
                                                       tickLabels: {
                                                           fill: '#d1d9e0',
                                                           fontFamily: 'Istok Web',
                                                       },
                                                       grid: {
                                                           stroke: ({tick}) => tick > 1 ? "#adb5bd" : "#adb5bd",
                                                           opacity: 0.1
                                                       }

                                                   }}
                                                   padding={{bottom: 20}}
                                        />
                                        <ChartAxis dependentAxis crossAxis
                                                   style={{
                                                       axis: {
                                                           stroke: '#d1d9e0',

                                                       },
                                                       tickLabels: {
                                                           fill: '#d1d9e0',
                                                           fontFamily: 'Istok Web'
                                                       },
                                                       grid: {
                                                           stroke: ({tick}) => tick > 5000 ? "#adb5bd" : "#adb5bd",
                                                           opacity: 0.1
                                                       }

                                                   }}/>
                                        <ChartArea
                                            animate={{
                                                duration: 2000,
                                                onLoad: {duration: 1000}
                                            }}
                                            style={{data: {fill: '#F6D245', fillOpacity: 0.1, stroke: '#EC862F'}}}
                                            data={this.state.datesWithBalance}
                                        />
                                    </Chart>
                                </div>

                                <Chart width={950} height={150} scale={{x: 'time'}} containerComponent={
                                    <VictoryBrushContainer brushDimension='x'
                                                           brushDomain={this.state.selectedDomain}
                                                           onBrushDomainChange={this.handleBrush.bind(this)}
                                                           brushStyle={{fill: '#F6D245', opacity: 0.4}}
                                    />
                                }
                                >
                                    <ChartAxis
                                        tickValues={this.state.monthRange}
                                        tickFormat={(x) => monthNames[new Date(x).getMonth()]}
                                        style={{
                                            axis: {
                                                stroke: '#d1d9e0'
                                            },
                                            tickLabels: {
                                                fill: '#d1d9e0',
                                                fontFamily: 'Istok Web'
                                            }
                                        }}

                                    />


                                    <ChartLine
                                        animate={{
                                            duration: 2000,
                                            onLoad: {duration: 1000}
                                        }}
                                        style={{
                                            data: {stroke: "#EC862F"},
                                            parent: {border: "1px solid #41b6c4"}
                                        }}
                                        data={this.state.datesWithBalance}

                                    />
                                </Chart>
                            </div>
                            <br/>
                            <div className='main-chart'>
                                <div className='balance'>TRANSACTION HISTORY</div>
                                {Object.keys(this.state.topFiveTransactionHistory).map((key, index) => (
                                    <Row>
                                        <Col xs={5}>
                                            <p className='time'>{moment(key).format('YYYY-M-DD H:mm')}</p>
                                        </Col>
                                        <Col xs={3}>
                                            <p className='history'>{(topFiveTransactionHistory[key]).toFixed(8)}</p>
                                        </Col>
                                    </Row>
                                ))}

                                <Accordion>

                                    <Accordion.Toggle as={NavLink} eventKey="0">
                                        <div className='toggle'>
                                        See More
                                        </div>
                                    </Accordion.Toggle>


                                    <Accordion.Collapse eventKey="0">
                                        <div>{Object.keys(this.state.restTransactionHistory).map((key, index) => (
                                            <Row>
                                                <Col xs={5}>
                                                    <p className='time'>{moment(key).format('YYYY-M-DD H:mm')}</p>
                                                </Col>
                                                <Col xs={3}>
                                                    <p className='history'>{(restTransactionHistory[key]).toFixed(8)}</p>
                                                </Col>
                                            </Row>
                                        ))}</div>
                                    </Accordion.Collapse>


                                </Accordion>

                            </div>
                        </Container>

                    </div>
                </React.Fragment>
            )

        }

        return (
            <React.Fragment>
                <div className='height'>
                    <Container>
                        <div className='center'>
                            <img className='image2' src={logo} alt='logo'/>
                            <div className='chart-title'>walletwatch.xyz</div>
                        </div>
                        <br/>
                        <div className='addressSection'>
                            <div className='small-title'>Address: {this.state.address}</div>

                            <div style={{
                                position: 'absolute',
                                right: '13%',
                                top: '8%',
                                height: '50%',
                                display: 'inline-block'
                            }}>
                                <AddAddress addAddress={this.addAddress}/>
                            </div>
                            <br/>
                        </div>


                        <div className='main-chart'>
                            <Row>
                                <Col>
                                    <div>
                                        <p className='balance'>CURRENT BALANCE</p><p className='small-tag'>USD</p>
                                        <p className='currentBalance'> {this.state.currentBalance}</p>
                                    </div>
                                    <div>
                                        <p className='balance'>BTC BALANCE</p><p className='small-tag'>BTC</p>
                                        <p className='data'>{this.state.btcBalance}</p>
                                    </div>
                                </Col>
                                <Col style={{borderLeft: '2px solid grey', borderRight: '2px solid grey'}}>
                                    <div>
                                        <p className='balance'>TOTAL INVESTED</p><p className='small-tag'>USD</p>
                                        <p className='data'>{this.state.totalInvested}</p>
                                    </div>
                                    <div>
                                        <div className='balance'>PROFIT MARGIN</div>
                                        <p className='data'>{((this.state.currentBalance - this.state.totalInvested) / this.state.currentBalance * 100)
                                            .toFixed(2)} %</p>
                                    </div>
                                </Col>
                                <Col>
                                    <div>
                                        <p className='balance'>PROFIT</p><p className='small-tag'>USD</p>
                                        <p className='data'>{(this.state.currentBalance - this.state.totalInvested).toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <p className='balance'>BTC PRICE</p><p className='small-tag'>USD</p>
                                        <p className='data'>{this.state.currencyExchangeRate}</p>
                                    </div>
                                </Col>

                            </Row>
                        </div>
                        <br/>

                        <div className='main-chart'>
                            <div className='chart'>
                                <Chart width={950} height={350} scale={{x: 'time'}}
                                       containerComponent={
                                           <ZoomVoronoiCursorContainer zoomDimension='x'
                                                                       zoomDomain={this.state.zoomDomain}
                                                                       onZoomDomainChange={this.handleZoom.bind(this)}
                                                                       mouseFollowTooltips
                                                                       voronoiDimension="x"
                                                                       labels={({datum}) => `$${datum.y}
                                                                 
${moment(datum.x).format('YYYY-M-DD H:mm')}`}
                                                                       labelComponent={
                                                                           <VictoryTooltip
                                                                               cornerRadius={3}
                                                                               flyoutWidth={250}
                                                                               flyoutStyle={{
                                                                                   fill: '#392f41',
                                                                                   opacity: 0.8
                                                                               }}
                                                                               style={{
                                                                                   fontSize: '20px',
                                                                                   fontFamily: 'Istok Web',
                                                                                   fill: 'white',
                                                                                   textAlign: 'left'
                                                                               }}
                                                                           />
                                                                       }
                                           />
                                       }
                                >
                                    <ChartAxis crossAxis
                                               style={{
                                                   axis: {
                                                       stroke: '#d1d9e0'
                                                   },
                                                   tickLabels: {
                                                       fill: '#d1d9e0',
                                                       fontFamily: 'Istok Web',
                                                   },
                                                   grid: {
                                                       stroke: ({tick}) => tick > 1 ? "#adb5bd" : "#adb5bd",
                                                       opacity: 0.1
                                                   }

                                               }}
                                               padding={{bottom: 20}}
                                    />
                                    <ChartAxis dependentAxis crossAxis
                                               style={{
                                                   axis: {
                                                       stroke: '#d1d9e0',

                                                   },
                                                   tickLabels: {
                                                       fill: '#d1d9e0',
                                                       fontFamily: 'Istok Web'
                                                   },
                                                   grid: {
                                                       stroke: ({tick}) => tick > 5000 ? "#adb5bd" : "#adb5bd",
                                                       opacity: 0.1
                                                   }

                                               }}/>
                                    <ChartArea
                                        animate={{
                                            duration: 2000,
                                            onLoad: {duration: 1000}
                                        }}
                                        style={{data: {fill: '#F6D245', fillOpacity: 0.1, stroke: '#EC862F'}}}
                                        data={this.state.datesWithBalance}
                                    />
                                </Chart>
                            </div>

                            <Chart width={950} height={150} scale={{x: 'time'}} containerComponent={
                                <VictoryBrushContainer brushDimension='x'
                                                       brushDomain={this.state.selectedDomain}
                                                       onBrushDomainChange={this.handleBrush.bind(this)}
                                                       brushStyle={{fill: '#F6D245', opacity: 0.4}}
                                />
                            }
                            >
                                <ChartAxis
                                    tickValues={this.state.monthRange}
                                    tickFormat={(x) => monthNames[new Date(x).getMonth()]}
                                    style={{
                                        axis: {
                                            stroke: '#d1d9e0'
                                        },
                                        tickLabels: {
                                            fill: '#d1d9e0',
                                            fontFamily: 'Istok Web'
                                        }
                                    }}

                                />


                                <ChartLine
                                    animate={{
                                        duration: 2000,
                                        onLoad: {duration: 1000}
                                    }}
                                    style={{
                                        data: {stroke: "#EC862F"},
                                        parent: {border: "1px solid #41b6c4"}
                                    }}
                                    data={this.state.datesWithBalance}

                                />
                            </Chart>
                        </div>
                        <br/>
                        <div className='main-chart'>
                            <div className='balance'>TRANSACTION HISTORY</div>
                            {Object.keys(this.state.topFiveTransactionHistory).map((key, index) => (
                                <Row>
                                    <Col xs={5}>
                                        <p className='time'>{moment(key).format('YYYY-M-DD H:mm')}</p>
                                    </Col>
                                    <Col xs={3}>
                                        <p className='history'>{(topFiveTransactionHistory[key]).toFixed(8)}</p>
                                    </Col>
                                </Row>
                            ))}

                        </div>
                    </Container>

                </div>
            </React.Fragment>

        )

    }
}

export default App;