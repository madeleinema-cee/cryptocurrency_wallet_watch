import './App.css';
import React, {Component} from 'react';
import AddAddress from "./components/AddAddress";
import HomePage from "./components/HomePage";
import MainPageHeader from "./components/MainPageHeader";
import TransactionHistory from "./components/TransactionHistory";
import LoadingAnimation from "./components/LoadingAnimation";
import {Col, Container, Row} from 'react-bootstrap';
import './main.css';
import {
    Chart,
    createContainer,
    ChartArea,
    ChartAxis,
    ChartLine,
} from '@patternfly/react-charts';

import {VictoryBrushContainer, VictoryTooltip} from "victory";
import moment from "moment";
import {MeteorRainLoading} from 'react-loadingg'


import Examples from "./components/Examples";


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: 'form',
            addresses: [],
            error: null,
            datesWithBalances: [],
            currentBalance: null,
            currencyExchangeRate: null,
            topFiveTransactionHistory: null,
            profitMargin: null,
            totalInvested: null,
            btcBalance: null,
            profit: null,
            width: window.innerWidth
        }

        this.btcUsdApiBase = 'http://127.0.0.1:5000/api/btc?address=';
    }

    componentWillMount() {
        window.addEventListener('resize', this.handleWindowSizeChange);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowSizeChange)
    }

    fetchBitcoinTransactionDataWithAPI(address) {
        this.setState({
            isLoaded: 'spinner'
        })
        fetch(this.btcUsdApiBase + address)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: 'result',
                        datesWithBalance: this.formatData(result.balance),
                        address: address,
                        currentBalance: this.handelBalance(result.btcbalance * result.btctousd),
                        currencyExchangeRate: result.btctousd,
                        topFiveTransactionHistory: this.getTopFiveTransactionHistory(result.transactionhistory).topFive,
                        restTransactionHistory: this.getTopFiveTransactionHistory(result.transactionhistory).rest,
                        totalInvested: result.totalinvested.toFixed(2),
                        btcBalance: this.handelBalance(result.btcbalance).toFixed(8),
                        profit: result.totalprofit,
                        profitMargin: result.profitmargin
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

    handelBalance(data) {
        if (data < 0) {
            data = 0
            console.log(data)
            return data
        } else {
            return data
        }
    }

    handleWindowSizeChange = () => {
        this.setState(
            {
                width: window.innerWidth
            }
        );
        console.log(this.state.width)
    }

    formatData(inputData) {
        for (let i = 0; i < inputData.length; i++) {
            inputData[i]['x'] = new Date(inputData[i]['x'])
            inputData[i]['y'] = Math.round(inputData[i]['y'])
        }
        return inputData
    }

    inputAddress = (address) => {
        this.fetchBitcoinTransactionDataWithAPI(address)
    }

    inputAddress2 = () => {
        let address = document.getElementById('address2').textContent
        this.fetchBitcoinTransactionDataWithAPI(address)
    }

    inputAddress3 = () => {
        let address = document.getElementById('address3').textContent
        this.fetchBitcoinTransactionDataWithAPI(address)
    }

    addAddress = (address) => {
        this.fetchBitcoinTransactionDataWithAPI(address)
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

        return transactionHistory
    }

    render() {
        const {width} = this.state;
        const isMobile = width <= 600
        const ZoomVoronoiCursorContainer = createContainer('zoom', 'voronoi');

        if (isMobile) {
            if (this.state.isLoaded === 'form') {
                return (
                    <React.Fragment>
                        <div className='mobile-background'>
                            <Container className="my-auto">
                                <div className='mobile-center'>
                                    <HomePage/>
                                    <AddAddress addAddress={this.addAddress}/>
                                    <Examples/>
                                </div>
                            </Container>
                        </div>
                    </React.Fragment>
                )
            }
            if (this.state.isLoaded === 'spinner') {
                return (
                    <LoadingAnimation/>
                )

            }
            return (
                <React.Fragment>
                    <div className='mobile-height'>
                        <div className='mobile-center'>
                            <MainPageHeader/>
                            <div className='small-title2'>Address: {this.state.address}</div>
                            <div className='search-bar'>
                                <AddAddress addAddress={this.addAddress}/>
                            </div>
                        </div>

                        <div className='mobile-main-chart'>
                            <div className='mobile-section'>
                                <Row>
                                    <Col style={{borderLeft: '2px solid grey', borderRight: '2px solid grey'}}>
                                        <div>
                                            <p className='mobile-balance'>BALANCE</p><p
                                            className='mobile-small-tag'>USD</p>
                                            <p className='mobile-currentBalance'>
                                                ${this.state.currentBalance.toFixed(2)}
                                            </p>
                                        </div>
                                    </Col>
                                    <Col>
                                        <div>
                                            <p className='mobile-balance'>BTC BALANCE</p><p
                                            className='mobile-small-tag'>BTC</p>
                                            <p className='mobile-data'>{this.state.btcBalance}</p>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                            <div className='mobile-section'>
                                <Row>
                                    <Col style={{borderLeft: '2px solid grey', borderRight: '2px solid grey'}}>
                                        <div>
                                            <p className='mobile-balance'>PROFIT MARGIN</p><p
                                            className='mobile-small-tag'> </p>
                                            <p className='mobile-data'>{this.state.profitMargin.toFixed(3)} %</p>
                                        </div>
                                    </Col>
                                    <Col>
                                        <div>
                                            <p className='mobile-balance'>PROFIT</p><p
                                            className='mobile-small-tag'>USD</p>
                                            <p className='mobile-data'>${this.state.profit.toFixed(2)}</p>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                            <div className='mobile-section'>
                                <Row>
                                    <Col style={{borderLeft: '2px solid grey', borderRight: '2px solid grey'}}>
                                        <div>
                                            <p className='mobile-balance'>TOTAL INVESTED</p><p
                                            className='mobile-small-tag'>USD</p>
                                            <p className='mobile-data'>${this.state.totalInvested}</p>
                                        </div>
                                    </Col>
                                    <Col>
                                        <div>
                                            <p className='mobile-balance'>BTC PRICE</p><p
                                            className='mobile-small-tag'>USD</p>
                                            <p className='mobile-data'>${this.state.currencyExchangeRate}</p>
                                        </div>
                                    </Col>
                                </Row>
                            </div>


                        </div>

                        <div className='mobile-chart'>
                            <div className='chart'>
                                <Chart padding={{top: 50, bottom: 50, left: 70, right: 50}}
                                       width={600} height={350} scale={{x: 'time'}}
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
                                               tickFormat={(t) => `$${(t)}`}
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
                                        style={{
                                            data: {
                                                fill: '#CB4A8F',
                                                fillOpacity: 0.1,
                                                stroke: '#CB4A8F',
                                                padding: 100
                                            }
                                        }}
                                        data={this.state.datesWithBalance}
                                    />
                                </Chart>
                            </div>

                            <Chart width={600} height={150} scale={{x: 'time'}} containerComponent={
                                <VictoryBrushContainer brushDimension='x'
                                                       brushDomain={this.state.selectedDomain}
                                                       onBrushDomainChange={this.handleBrush.bind(this)}
                                                       brushStyle={{fill: '#CB4A8F', opacity: 0.2}}
                                />
                            }
                            >
                                <ChartAxis
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
                                        data: {stroke: "#CB4A8F"},
                                        parent: {border: "1px solid #41b6c4"}
                                    }}
                                    data={this.state.datesWithBalance}
                                />
                            </Chart>
                        </div>

                        <div className='mobile-center'>
                            <TransactionHistory topFiveTransactionHistory = {this.state.topFiveTransactionHistory}
                                                restTransactionHistory = {this.state.restTransactionHistory}/>

                        </div>
                        <div className='main-page-copyright'>
                            <small>Made by <a className="copy-link" href="https://madeleinema.com/">Madeleine
                                Ma</a> @Copyright 2021</small>
                        </div>
                    </div>

                </React.Fragment>
            )
        } else {
            if (this.state.isLoaded === 'form') {
                return (
                    <React.Fragment>
                        <div className='background'>
                            <Container className="my-auto">
                                <div className='center'>
                                    <div>
                                        <HomePage/>
                                        <AddAddress addAddress={this.addAddress}/>
                                        <Examples/>
                                    </div>
                                </div>
                            </Container>
                        </div>
                    </React.Fragment>
                )
            }
            if (this.state.isLoaded === 'spinner') {
                return (
                    <div className='height'>
                        <LoadingAnimation/>
                    </div>
                )
            }

            return (
                <React.Fragment>
                    <div className='height'>
                        <Container>
                            <div className='center'>
                                <MainPageHeader/>
                            </div>
                            <div className='address-part'>
                                <div className='small-title'>Address: {this.state.address}</div>
                            </div>
                            <div className='addaddress'>
                                <AddAddress addAddress={this.addAddress}/>
                            </div>


                            <div className='main-chart'>
                                <Row>
                                    <Col>
                                        <div>
                                            <p className='balance'>CURRENT BALANCE</p><p className='small-tag'>USD</p>
                                            <p className='currentBalance'> ${this.state.currentBalance.toFixed(2)}</p>
                                        </div>
                                        <div>
                                            <p className='balance'>BTC BALANCE</p><p className='small-tag'>BTC</p>
                                            <p className='data'>{this.state.btcBalance}</p>
                                        </div>
                                    </Col>
                                    <Col style={{borderLeft: '2px solid grey', borderRight: '2px solid grey'}}>
                                        <div>
                                            <div className='balance'>PROFIT MARGIN</div>
                                            <p className='data'>{this.state.profitMargin.toFixed(3)} %</p>
                                        </div>
                                        <div>
                                            <p className='balance'>TOTAL INVESTED</p><p className='small-tag'>USD</p>
                                            <p className='data'>${this.state.totalInvested}</p>
                                        </div>
                                    </Col>
                                    <Col>
                                        <div>
                                            <p className='balance'>PROFIT</p><p className='small-tag'>USD</p>
                                            <p className='data'>${this.state.profit.toFixed(2)}</p>
                                        </div>
                                        <div>
                                            <p className='balance'>BTC PRICE</p><p className='small-tag'>USD</p>
                                            <p className='data'>${this.state.currencyExchangeRate}</p>
                                        </div>
                                    </Col>

                                </Row>
                            </div>
                            <br/>

                            <div className='main-chart'>
                                <div className='chart'>
                                    <Chart padding={{top: 50, bottom: 50, left: 70, right: 50}}
                                           width={950} height={350} scale={{x: 'time'}}
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
                                                   tickFormat={(t) => `$${(t)}`}
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
                                            style={{
                                                data: {
                                                    fill: '#CB4A8F',
                                                    fillOpacity: 0.1,
                                                    stroke: '#CB4A8F',
                                                    padding: 100
                                                }
                                            }}
                                            data={this.state.datesWithBalance}
                                        />
                                    </Chart>
                                </div>

                                <Chart width={950} height={150} scale={{x: 'time'}} containerComponent={
                                    <VictoryBrushContainer brushDimension='x'
                                                           brushDomain={this.state.selectedDomain}
                                                           onBrushDomainChange={this.handleBrush.bind(this)}
                                                           brushStyle={{fill: '#CB4A8F', opacity: 0.2}}
                                    />
                                }
                                >
                                    <ChartAxis
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
                                            data: {stroke: "#CB4A8F"},
                                            parent: {border: "1px solid #41b6c4"}
                                        }}
                                        data={this.state.datesWithBalance}

                                    />
                                </Chart>
                            </div>
                            <br/>




                            <TransactionHistory topFiveTransactionHistory = {this.state.topFiveTransactionHistory}
                                                restTransactionHistory = {this.state.restTransactionHistory}/>











                            <div className='main-page-copyright'>
                                <small>Made by <a className="copy-link" href="https://madeleinema.com/">Madeleine
                                    Ma</a> @Copyright 2021</small>
                            </div>
                        </Container>

                    </div>

                </React.Fragment>
            )
        }
    }
}

export default App;