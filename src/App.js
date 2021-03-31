import './App.css';
import React, {Component} from 'react';
import AddAddress from "./components/AddAddress";
import {Col, Container, Row, Accordion, NavLink} from 'react-bootstrap';
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


import logo from './components/Logo.png'


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
            hideDiv: false,
            width: window.innerWidth
        }

        this.btcUsdApiBase = 'http://127.0.0.1:5000/api/btc?address=';
        this.handleClick = this.handleClick.bind(this)
    }

    componentWillMount() {
        window.addEventListener('resize', this.handleWindowSizeChange);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowSizeChange)
    }

    handleClick() {
        this.setState({
            hideDiv: true
        })
    }

    refreshPage() {
        window.location.reload(false)

    }

    fetchBitcoinTranscationDataWithAPI(address) {
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
                        currentBalance: result.btcbalance * result.btctousd,
                        currencyExchangeRate: result.btctousd,
                        topFiveTransactionHistory: this.getTopFiveTransactionHistory(result.transactionhistory).topFive,
                        restTransactionHistory: this.getTopFiveTransactionHistory(result.transactionhistory).rest,
                        totalInvested: result.totalinvested.toFixed(2),
                        btcBalance: (result.btcbalance).toFixed(8),
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

    inputAddress = () => {
        let address = document.getElementById('address1').textContent
        this.fetchBitcoinTranscationDataWithAPI(address)
    }

    inputAddress2 = () => {
        let address = document.getElementById('address2').textContent
        this.fetchBitcoinTranscationDataWithAPI(address)
        console.log(address)
    }

    inputAddress3 = () => {
        let address = document.getElementById('address3').textContent
        this.fetchBitcoinTranscationDataWithAPI(address)
        console.log(address)
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

        return transactionHistory
    }

    render() {
        const {
            isLoaded, address, datesWithBalance, currentBalance, monthRange, currencyExchangeRate,
            topFiveTransactionHistory, totalInvested, btcBalance, restTransactionHistory, loading, profit,
            profitMargin, hideDiv, width
        } = this.state;
        const isMobile = width <= 600
        const ZoomVoronoiCursorContainer = createContainer('zoom', 'voronoi');

        if (isMobile) {
            if (this.state.isLoaded === 'form') {
                return (
                    <React.Fragment>
                        <div className='mobile-background'>
                            <Container className="my-auto">
                                <div className='mobile-center'>
                                    <div>
                                        <img className='mobile-image' src={logo} alt='logo'/>
                                        <h1 className='mobile-title'>WALLETWATCH.XYZ</h1>
                                        <div className='mobile-subtitle'>Tracking the Progress of Your Bitcoin
                                            Investment
                                        </div>
                                        <AddAddress addAddress={this.addAddress}/>

                                        <div className='mobile-example'>
                                            EXAMPLE ADDRESSES:
                                        </div>
                                        <div className='address'>
                                            <a type='button' id='address1'
                                               onClick={this.inputAddress}>3E1jAe14xLtRhJDmBgQCu98fiV7A3eq211</a>
                                            <br/>
                                            <a type='button' id='address2'
                                               onClick={this.inputAddress2}>3JBqbYDLnQA7u2sNHraPL4yJSTjS3JUEa3</a>
                                            <br/>
                                            <a type='button' id='address3'
                                               onClick={this.inputAddress3}>3KYwVvvvfNApEDjnVjgQU4swmSPhNKCzwD</a>
                                        </div>
                                        <div className='copy-right-center'>
                                            <div className='mobile-copyright'>
                                                <small>Made by <a className="copy-link" href="https://madeleinema.com/">Madeleine
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
            if (this.state.isLoaded === 'spinner') {
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
            return (
                <React.Fragment>
                    <div className='mobile-height'>
                        <div className='mobile-center' onClick={this.refreshPage}>
                            <img className='image2' src={logo} alt='logo'/>
                            <div className='chart-title' type='button'>walletwatch.xyz</div>
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
                                        <p className='mobile-balance'>BALANCE</p><p className='mobile-small-tag'>USD</p>
                                        <p className='mobile-currentBalance'> ${this.state.currentBalance.toFixed(2)}</p>
                                    </div>
                                </Col>
                                <Col>
                                    <div>
                                        <p className='mobile-balance'>BTC BALANCE</p><p className='mobile-small-tag'>BTC</p>
                                        <p className='mobile-data'>{this.state.btcBalance}</p>
                                    </div>
                                </Col>
                                </Row>
                            </div>
                            <div className='mobile-section'>
                                <Row>
                                <Col style={{borderLeft: '2px solid grey', borderRight: '2px solid grey'}}>
                                    <div>
                                        <p className='mobile-balance'>PROFIT MARGIN</p><p className='mobile-small-tag'></p>
                                        <p className='mobile-data'>{this.state.profitMargin.toFixed(3)} %</p>
                                    </div>
                                </Col>
                                <Col>
                                    <div>
                                        <p className='mobile-balance'>PROFIT</p><p className='mobile-small-tag'>USD</p>
                                        <p className='mobile-data'>${this.state.profit.toFixed(2)}</p>
                                    </div>
                                </Col>
                                </Row>
                            </div>
                            <div className='mobile-section'>
                                <Row>
                                <Col style={{borderLeft: '2px solid grey', borderRight: '2px solid grey'}}>
                                    <div>
                                        <p className='mobile-balance'>TOTAL INVESTED</p><p className='mobile-small-tag'>USD</p>
                                        <p className='mobile-data'>${this.state.totalInvested}</p>
                                    </div>
                                </Col>
                                <Col>
                                    <div>
                                        <p className='mobile-balance'>BTC PRICE</p><p className='mobile-small-tag'>USD</p>
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

                        <div className='mobile-main-chart mobile-center'>
                            <div className='balance'>TRANSACTION HISTORY</div>
                            {Object.keys(this.state.topFiveTransactionHistory).map((key, index) => (
                                <Row>
                                    <Col xs={5}>
                                        <p className='mobile-time'>{moment(key).format('YYYY-M-DD H:mm')}</p>
                                    </Col>
                                    <Col xs={5}>
                                        {topFiveTransactionHistory[key] > 0 &&
                                        <p className='mobile-history'>+ {topFiveTransactionHistory[key]}</p>
                                        }
                                        {topFiveTransactionHistory[key] < 0 &&
                                        <p className='mobile-negative'>- {Math.abs(topFiveTransactionHistory[key])}</p>
                                        }
                                    </Col>
                                </Row>
                            ))}
                            {Object.keys(restTransactionHistory).length >= 1 &&

                            <Accordion>
                                <Accordion.Toggle as={NavLink} eventKey="0" hidden={this.state.hideDiv}>
                                    <div className='toggle' onClick={this.handleClick}>
                                        Show More
                                    </div>
                                </Accordion.Toggle>

                                <Accordion.Collapse eventKey="0">
                                    <div>{Object.keys(this.state.restTransactionHistory).map((key, index) => (
                                        <Row>
                                            <Col xs={5}>
                                                <p className='mobile-time'>{moment(key).format('YYYY-M-DD H:mm')}</p>
                                            </Col>
                                            <Col xs={5}>
                                                {restTransactionHistory[key] > 0 &&
                                                <p className='mobile-history'>+ {restTransactionHistory[key]}</p>
                                                }
                                                {restTransactionHistory[key] < 0 &&
                                                <p className='mobile-negative'>- {Math.abs(restTransactionHistory[key])}</p>
                                                }
                                            </Col>
                                        </Row>
                                    ))}</div>
                                </Accordion.Collapse>
                            </Accordion>}

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
                                        <img className='image' src={logo} alt='logo'/>
                                        <h1 className='title'>WALLETWATCH.XYZ</h1>
                                        <div className='subtitle'>Tracking the Progress of Your Bitcoin Investment</div>
                                        <AddAddress addAddress={this.addAddress}/>

                                        <div className='example'>
                                            EXAMPLE ADDRESSES:
                                        </div>
                                        <div className='address'>
                                            <a type='button' id='address1'
                                               onClick={this.inputAddress}>3E1jAe14xLtRhJDmBgQCu98fiV7A3eq211</a>
                                            <br/>
                                            <a type='button' id='address2'
                                               onClick={this.inputAddress2}>3JBqbYDLnQA7u2sNHraPL4yJSTjS3JUEa3</a>
                                            <br/>
                                            <a type='button' id='address3'
                                               onClick={this.inputAddress3}>3KYwVvvvfNApEDjnVjgQU4swmSPhNKCzwD</a>
                                        </div>
                                        <div className='copy-right-center'>
                                            <div className='copyright'>
                                                <small>Made by <a className="copy-link" href="https://madeleinema.com/">Madeleine
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
            if (this.state.isLoaded === 'spinner') {
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

            return (
                <React.Fragment>
                    <div className='height'>
                        <Container>
                            <div className='center' onClick={this.refreshPage}>
                                <img className='image2' src={logo} alt='logo'/>
                                <div className='chart-title' type='button'>walletwatch.xyz</div>
                            </div>
                            <br/>
                            <div className='addressSection'>
                                <Row>

                                    <Col xs={6}>
                                        <div className='small-title'>Address: {this.state.address}</div>
                                    </Col>
                                    <Col xs={6}>
                                        <AddAddress addAddress={this.addAddress}/>
                                    </Col>
                                </Row>
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
                            <div className='main-chart'>
                                <div className='balance'>TRANSACTION HISTORY</div>
                                {Object.keys(this.state.topFiveTransactionHistory).map((key, index) => (
                                    <Row>
                                        <Col xs={5}>
                                            <p className='time'>{moment(key).format('YYYY-M-DD H:mm')}</p>
                                        </Col>
                                        <Col xs={3}>
                                            {topFiveTransactionHistory[key] > 0 &&
                                            <p className='history'>+ {topFiveTransactionHistory[key]}</p>
                                            }
                                            {topFiveTransactionHistory[key] < 0 &&
                                            <p className='negative'>- {Math.abs(topFiveTransactionHistory[key])}</p>
                                            }
                                        </Col>
                                    </Row>
                                ))}
                                {Object.keys(restTransactionHistory).length >= 1 &&

                                <Accordion>
                                    <Accordion.Toggle as={NavLink} eventKey="0" hidden={this.state.hideDiv}>
                                        <div className='toggle' onClick={this.handleClick}>
                                            Show More
                                        </div>
                                    </Accordion.Toggle>


                                    <Accordion.Collapse eventKey="0">
                                        <div>{Object.keys(this.state.restTransactionHistory).map((key, index) => (
                                            <Row>
                                                <Col xs={5}>
                                                    <p className='time'>{moment(key).format('YYYY-M-DD H:mm')}</p>
                                                </Col>
                                                <Col xs={3}>
                                                    {restTransactionHistory[key] > 0 &&
                                                    <p className='history'>+ {restTransactionHistory[key]}</p>
                                                    }
                                                    {restTransactionHistory[key] < 0 &&
                                                    <p className='negative'>- {Math.abs(restTransactionHistory[key])}</p>
                                                    }
                                                </Col>
                                            </Row>
                                        ))}</div>
                                    </Accordion.Collapse>
                                </Accordion>}

                            </div>
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