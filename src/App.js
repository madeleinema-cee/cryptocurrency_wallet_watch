import './App.css';
import React, {Component} from 'react';
import Addresses from "./components/Addresses";
import AddAddress from "./components/AddAddress";
import {Container, Row, Col, Button} from 'react-bootstrap';
import './main.css';
import {
    VictoryChart,
    VictoryZoomContainer,
    VictoryLine,
    VictoryBrushContainer,
    VictoryAxis,
    VictoryTheme,
    VictoryVoronoiContainer,
    VictoryTooltip,
    createContainer
} from 'victory';
import {XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries} from './index';

import {ResponsiveLine} from '@nivo/line'


const data = [{'x': new Date(2021, 1, 4, 14, 0, 0), 'y': 2695.1389354868006},
    {'x': new Date(2021, 1, 5, 14, 0, 0), 'y': 2395.1389354868006}]


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            addresses: [],
            error: null,
            datesWithBalances: [],
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
                        datesWithBalance: this.formatData(result)
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

    handleZoom(domain) {
        this.setState({selectedDomain: domain})
    }

    handleBrush(domain) {
        this.setState({zoomDomain: domain});
    }


    formatData(inputData) {
        for (let i = 0; i < inputData.length; i++) {
            inputData[i]['x'] = new Date(inputData[i]['x'])
        }

        return inputData
    }


    addAddress = (address) => {
        this.fetchBitcoinTranscationDataWithAPI(address)
    }

    render() {
        const {isLoaded, address, datesWithBalance} = this.state;
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
                    <VictoryChart width={1000} height={500} scale={{x: 'time'}} containerComponent={
                        <VictoryZoomVoronoiContainer responsive={false}
                                                     zoomDimension='x'
                                                     zoomDomain={this.state.zoomDomain}
                                                     onZoomDomainChange={this.handleZoom.bind(this)}
                                                     labels={({datum}) => `y: ${datum.y}, x:${datum.x}`}
                                                     labelComponent={<VictoryTooltip/>}
                        />
                    }
                    >
                        <VictoryLine style={{data: {stroke: 'tomato'}}}
                                     data={this.state.datesWithBalance}
                        />
                    </VictoryChart>

                    <VictoryChart width={1000} height={300} scale={{x: 'time'}} containerComponent={
                        <VictoryBrushContainer responsive={false}
                                               brushDimension='x'
                                               brushDomain={this.state.selectedDomain}
                                               onBrushDomainChange={this.handleBrush.bind(this)}
                        />
                    }
                    >
                        <VictoryAxis tickValues={[new Date('2020-12-12 23:00:00'), new Date('2021-02-25 16:00:00')]}
                                     tickFormat={(x) => new Date(x).getMonth()}

                        />

                        <VictoryLine
                            style={{
                                data: {stroke: "#c43a31"},
                                parent: {border: "1px solid #ccc"}
                            }}
                            data={this.state.datesWithBalance}

                        />
                    </VictoryChart>
                </div>
            </React.Fragment>

        )
    }
}


export default App;