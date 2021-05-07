import {Chart, ChartArea, ChartAxis, ChartLine, createContainer} from "@patternfly/react-charts";
import moment from "moment";
import {VictoryBrushContainer, VictoryTooltip} from "victory";
import React, {Component} from "react";


class Charts extends Component {
    constructor(props) {
        super(props);
        this.state =
            {};

    }

    handleZoom(domain) {
        this.setState({selectedDomain: domain})
    }

    handleBrush(domain) {
        this.setState({zoomDomain: domain});
    }

    render(props) {
        const ZoomVoronoiContainer = createContainer('zoom', 'voronoi');

        return (
            <div className='main-chart'>
                <div className='chart'>
                    <Chart padding={{top: 50, bottom: 50, left: 70, right: 50}}
                           width={950} height={350} scale={{x: 'time'}}
                           containerComponent={
                               <ZoomVoronoiContainer zoomDimension='x'
                                                           zoomDomain={this.state.zoomDomain}
                                                           onZoomDomainChange={this.handleZoom.bind(this)}
                                                           mouseFollowTooltips
                                                           voronoiDimension="x"
                                                           labels={({datum}) => `$${datum.y}
                                                                 
${moment(datum.x).format('YYYY-M-DD')}`}
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
                            data={this.props.datesWithBalance}
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
                        data={this.props.datesWithBalance}

                    />
                </Chart>
            </div>

        )
    }
}


export default Charts