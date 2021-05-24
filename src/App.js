import './App.css';
import React, {Component} from 'react';
import {FaArrowCircleLeft} from 'react-icons/fa';
import LoadingAnimation from "./components/LoadingAnimation";
import MainPageHeader from "./components/MainPageHeader";
import Charts from "./components/Charts";
import TransactionHistory from "./components/TransactionHistory";
import {Col, Container, Row} from 'react-bootstrap';
import './main.css';


class App extends Component {
    constructor(props) {
        super(props);
        const query = new URLSearchParams(this.props.location.search)
        this.state = {
            isLoaded: 'form',
            address: query.get('address'),
            error: null,
            datesWithBalances: [],
            currentBalance: null,
            currencyExchangeRate: null,
            topFiveTransactionHistory: null,
            profitMargin: null,
            totalInvested: null,
            Balance: null,
            profit: null,
            width: window.innerWidth,
            currency: query.get('currency'),
        }

        this.btcUsdApiBase = 'http://127.0.0.1:5000/api/';
        if (this.state.currency !== null) {
            this.fetchBitcoinTransactionDataWithAPI(this.state.currency, this.state.address)
            console.log('test')
        }
        console.log(this.state.address)
        console.log(this.state.currency)
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleWindowSizeChange);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowSizeChange)
    }

    refreshPage() {
        window.location.reload(false)
    }

    fetchBitcoinTransactionDataWithAPI(currency, address) {
        fetch(this.btcUsdApiBase + currency + '?address=' + address)
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result)
                    this.setState({
                        isLoaded: 'result',
                        datesWithBalance: this.formatData(result.balance),
                        address: address,
                        currency: currency.toUpperCase(),
                        currentBalance: this.handleBalance(result.final_balance * result.tousd).toFixed(2),
                        currencyExchangeRate: result.tousd,
                        topFiveTransactionHistory: this.getTopFiveTransactionHistory(result.transactionhistory).topFive,
                        restTransactionHistory: this.getTopFiveTransactionHistory(result.transactionhistory).rest,
                        totalInvested: result.total_invested.toFixed(2),
                        Balance: this.handelBalance(result.final_balance).toFixed(6),
                        profit: result.total_profit.toFixed(2),
                        profitMargin: result.profit_margin.toFixed(2)
                    });
                    console.log(this.state.currentBalance)
                },

                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                        isLoaded: 'error',
                        address: address,
                        error
                    });
                }
            )
    }

    handleBalance(data) {
        if (data < 0) {
            data = 0
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
    }

    formatData(inputData) {
        for (let i = 0; i < inputData.length; i++) {
            inputData[i]['x'] = new Date(inputData[i]['x'])
            inputData[i]['y'] = Math.round(inputData[i]['y'])
        }
        return inputData
    }

    // addAddress = (currency, address) => {
    //     this.fetchBitcoinTransactionDataWithAPI(currency, address)
    // }

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
        const {width, error} = this.state;
        const isMobile = width <= 830

        if (this.state.error) {
            return (
                <React.Fragment>
                    <div className='mobile-background'>
                        <Container className="my-auto">
                            <div className='mobile-center'>
                                <div className='error'>╮(╯﹏╰)╭ No information for this address. Please specify a valid
                                    address.
                                </div>
                                <br/>
                                <div type='button' onClick={this.refreshPage} className='icon'><FaArrowCircleLeft/>
                                </div>
                                <div type='button' className='go-back' onClick={this.refreshPage}>Go Back</div>
                            </div>
                        </Container>
                    </div>
                </React.Fragment>
            )
        } else {


            if (isMobile) {
                if (this.state.isLoaded === 'form') {
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
                            </div>

                            <div className='mobile-main-chart'>
                                <div className='mobile-section'>
                                    <Row>
                                        <Col style={{borderLeft: '2px solid grey', borderRight: '2px solid grey'}}>
                                            <div>
                                                <p className='mobile-balance'>BALANCE</p><p
                                                className='mobile-small-tag'>USD</p>
                                                <p className='mobile-currentBalance'>
                                                    ${this.state.currentBalance}
                                                </p>
                                            </div>
                                        </Col>
                                        <Col>
                                            <div>
                                                <p className='mobile-balance'>{this.state.currency} BALANCE</p><p
                                                className='mobile-small-tag'>{this.state.currency}</p>
                                                <p className='mobile-data'>{this.state.Balance}</p>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                                <div className='mobile-section'>
                                    <Row>
                                        <Col style={{borderLeft: '2px solid grey', borderRight: '2px solid grey'}}>
                                            <div>
                                                <p className='mobile-balance'>PROFIT MARGIN</p><p
                                                className='mobile-small-tag'></p>
                                                <p className='mobile-data'>{this.state.profitMargin} %</p>
                                            </div>
                                        </Col>
                                        <Col>
                                            <div>
                                                <p className='mobile-balance'>PROFIT</p><p
                                                className='mobile-small-tag'>USD</p>
                                                <p className='mobile-data'>${this.state.profit}</p>
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
                                                <p className='mobile-balance'>{this.state.currency} PRICE</p><p
                                                className='mobile-small-tag'>USD</p>
                                                <p className='mobile-data'>${this.state.currencyExchangeRate}</p>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                            <Charts datesWithBalance={this.state.datesWithBalance}/>
                            <div className='mobile-center'>
                                <TransactionHistory topFiveTransactionHistory={this.state.topFiveTransactionHistory}
                                                    restTransactionHistory={this.state.restTransactionHistory}/>
                            </div>
                            <div className='mobile-copyright'>
                                <small>Made by <a className="copy-link" href="https://madeleinema.com/">Madeleine
                                    Ma</a> @Copyright 2021</small>
                            </div>
                        </div>
                    </React.Fragment>
                )
            } else {
                if (this.state.isLoaded === 'form') {
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

                                <div className='main-chart'>
                                    <Row>
                                        <Col>
                                            <div>
                                                <p className='balance'>CURRENT BALANCE</p><p
                                                className='small-tag'>USD</p>
                                                <p className='currentBalance'> ${this.state.currentBalance}</p>
                                            </div>
                                            <div>
                                                <p className='balance'>{this.state.currency} BALANCE</p><p
                                                className='small-tag'>{this.state.currency}</p>
                                                <p className='data'>{this.state.Balance}</p>
                                            </div>
                                        </Col>
                                        <Col style={{borderLeft: '2px solid grey', borderRight: '2px solid grey'}}>
                                            <div>
                                                <div className='balance'>PROFIT MARGIN</div>
                                                <p className='data'>{this.state.profitMargin} %</p>
                                            </div>
                                            <div>
                                                <p className='balance'>TOTAL INVESTED</p><p
                                                className='small-tag'>USD</p>
                                                <p className='data'>${this.state.totalInvested}</p>
                                            </div>
                                        </Col>
                                        <Col>
                                            <div>
                                                <p className='balance'>PROFIT</p><p className='small-tag'>USD</p>
                                                <p className='data'>${this.state.profit}</p>
                                            </div>
                                            <div>
                                                <p className='balance'>{this.state.currency} PRICE</p><p
                                                className='small-tag'>USD</p>
                                                <p className='data'>${this.state.currencyExchangeRate}</p>
                                            </div>
                                        </Col>

                                    </Row>
                                </div>
                                <br/>

                                <Charts datesWithBalance={this.state.datesWithBalance}/>
                                <br/>

                                <TransactionHistory topFiveTransactionHistory={this.state.topFiveTransactionHistory}
                                                    restTransactionHistory={this.state.restTransactionHistory}/>

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
}

export default App
