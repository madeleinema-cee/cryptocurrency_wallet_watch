import './App.css';
import React, {Component, useEffect, useState} from 'react';
import { ArrowRight } from 'react-bootstrap-icons';
import { FaArrowCircleLeft } from 'react-icons/fa';
import { BsFillAlarmFill } from "react-icons/bs";
import AddAddress from "./components/AddAddress";
import HomePage from "./components/HomePage";
import LoadingAnimation from "./components/LoadingAnimation";
import MainPageHeader from "./components/MainPageHeader";
import Examples from "./components/Examples";
import Charts from "./components/Charts";
import TransactionHistory from "./components/TransactionHistory";
import ErrorAlert from "./components/ErrorAlert";
import {Col, Container, Row} from 'react-bootstrap';
import './main.css';

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
            width: window.innerWidth,
        }

        this.btcUsdApiBase = 'http://localhost:3000/api/btc?address=';
    }

    componentWillMount() {
        window.addEventListener('resize', this.handleWindowSizeChange);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowSizeChange)
    }

    refreshPage() {
        window.location.reload(false)
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
                        currentBalance: this.handelBalance(result.final_balance * result.tousd),
                        currencyExchangeRate: result.tousd,
                        topFiveTransactionHistory: this.getTopFiveTransactionHistory(result.transactionhistory).topFive,
                        restTransactionHistory: this.getTopFiveTransactionHistory(result.transactionhistory).rest,
                        totalInvested: result.total_invested,
                        btcBalance: this.handelBalance(result.final_balance),
                        profit: result.total_profit,
                        profitMargin: result.profit_margin
                    });
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
                    console.log(this.state.error)
                }
            )
    }

    handelBalance(data) {
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
        console.log(inputData)
        return inputData
    }

    inputAddress = () => {
        let address = document.getElementById('address1').textContent
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
                                <div className='error'>╮(╯﹏╰)╭ No information for this address. Please specify a valid address.</div>
                                <br/>
                                <div type='button' onClick={this.refreshPage} className='icon'><FaArrowCircleLeft /></div>
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
                        <React.Fragment>
                            <div className='mobile-background'>
                                <Container className="my-auto">
                                    <div className='mobile-center'>
                                        <HomePage/>
                                        <AddAddress addAddress={this.addAddress}/>
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
                                                >3KYwVvvvfNApEDjnVjgQU4swmSPhNKCzwD</a>
                                            </div>
                                            <div className='copy-right-center'>
                                                <div className='copyright'>
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
                                                    ${this.state.currentBalance}
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
                                                <p className='mobile-balance'>BTC PRICE</p><p
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
                        <React.Fragment>
                            <div className='background'>
                                <Container className="my-auto">
                                    <div className='center'>
                                        <div>
                                            <HomePage/>
                                            <AddAddress addAddress={this.addAddress}/>
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
                                                    >3KYwVvvvfNApEDjnVjgQU4swmSPhNKCzwD</a>
                                                </div>
                                                <div className='copy-right-center'>
                                                    <div className='copyright'>
                                                        <small>Made by <a className="copy-link"
                                                                          href="https://madeleinema.com/">Madeleine
                                                            Ma</a> @Copyright 2021</small>
                                                    </div>
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
                                                <p className='balance'>CURRENT BALANCE</p><p
                                                className='small-tag'>USD</p>
                                                <p className='currentBalance'> ${this.state.currentBalance}</p>
                                            </div>
                                            <div>
                                                <p className='balance'>BTC BALANCE</p><p
                                                className='small-tag'>BTC</p>
                                                <p className='data'>{this.state.btcBalance}</p>
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
                                                <p className='balance'>BTC PRICE</p><p className='small-tag'>USD</p>
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
