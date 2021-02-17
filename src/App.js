import './App.css';
import React, {Component} from 'react';
import moment from "moment";
import Addresses from "./components/Addresses";
import AddAddress from "./components/AddAddress";


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            addresses: [],
            error: null,
            balances: [],
            dates: null,
            datesWithBalances: null
        }

        this.apiBase = 'https://blockchain.info/rawaddr/'
    }

    fetchBitcoinTranscationDataWithAPI(address) {
        fetch('https://api.allorigins.win/raw?url=' + this.apiBase + address)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        balances: this.formatBalances(result.txs),
                        datesWithBalance: this.insertValueToDates(this.formatBalances(result.txs),
                            this.generateDates(moment(new Date(result.txs[(result.txs).length - 1].time * 1000))
                                .format("YYYY-MM-DD HH:00:00")))
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
        let transactionHistory = []
        let balanceHistory = []
        let newDates = []
        let c = []
        let data = {}
        for (let i = 0; i < inputData.length; i++) {
            let dateString = moment(new Date(inputData[i]['time'] * 1000)).format("YYYY-MM-DD HH:00:00")
            let convertedCryptoAmount = inputData[i]['result'] / 100000000
            transactionHistory.push(convertedCryptoAmount)
            transactionHistory.reverse()
            newDates.push(dateString)
        }
        newDates.reverse()
        for (let i = 0; i < transactionHistory.length; i++) {
            c.push(transactionHistory[i])
            balanceHistory.push((c.reduce((a, b) => a + b)))
        }
        newDates.forEach((newDate, i) => data[newDate] = balanceHistory[i])
        return data
    }

    generateDates(inputData) {
        let dates = {}
        let startDate = new Date(inputData);
        let endDate = new Date();
        let hoursBetween = (endDate - startDate) / (1000 * 60 * 60)
        for (let i = 0; i <= hoursBetween; i++) {
            const newdate = new Date(new Date(startDate).getTime() + (i * 1000 * 60 * 60));
            const formatedDate = moment(newdate).format("YYYY-MM-DD HH:00:00")
            dates[formatedDate] = 0
        }
        return dates
    }

    insertValueToDates(balances, dates) {
        let balanceKeys = Object.keys(balances)
        let dateKeys = Object.keys(dates)
        for (const [key, value] of Object.entries(dates)) {
            if (balanceKeys.includes(key)) {
                dates[key] = balances[key]
            } else {
                if (dates[key] === 0) {
                    let lastHourTime = moment(new Date(key).getTime()- (1000*60*60)).format("YYYY-MM-DD HH:00:00")
                    let value = dates[lastHourTime]
                    dates[key] = value
                }
            }

        }
        return dates
    }

    addAddress = (address) => {
        this.fetchBitcoinTranscationDataWithAPI(address)

        // const newAddress = {
        //    address: address,
        // }
        // this.setState({addresses: [...this.state.addresses, newAddress]})

    }
    render() {
        const {isLoaded, address, balances, datesWithBalance} = this.state;

        if (!isLoaded) {
            return (
                <React.Fragment>
                    <AddAddress addAddress={this.addAddress}/>

                </React.Fragment>)
        }

        return (
            <React.Fragment>
                <Addresses addresses={this.state.addresses}/>
                <div>
                    {address}
                    {Object.keys(this.state.datesWithBalance).map((key, index) => (
                        <p key={key}>{key} | {datesWithBalance[key]}</p>
                    ))
                    }
                </div>
            </React.Fragment>
        )
    }
}


export default App;