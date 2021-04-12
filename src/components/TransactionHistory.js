import {Chart, ChartAxis} from "@patternfly/react-charts";
import React, {Component} from "react";
import {Accordion, Col, NavLink, Row} from "react-bootstrap";
import moment from "moment";


class TransactionHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hideDiv: false
        }
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick() {
        this.setState({
            hideDiv: true
        })
    }
    render(props) {
        return (
            <div className='main-chart'>
                <div className='balance'>TRANSACTION HISTORY</div>
                {Object.keys(this.props.topFiveTransactionHistory).map((key, index) => (
                    <Row>
                        <Col xs={6}>
                            <p className='time'>{moment(key).format('YYYY-M-DD H:mm')}</p>
                        </Col>
                        <Col xs={3}>
                            {this.props.topFiveTransactionHistory[key] > 0 &&
                            <p className='history'>+ {this.props.topFiveTransactionHistory[key]}</p>
                            }
                            {this.props.topFiveTransactionHistory[key] < 0 &&
                            <p className='negative'>- {Math.abs(this.props.topFiveTransactionHistory[key])}</p>
                            }
                        </Col>
                    </Row>
                ))}
                {Object.keys(this.props.restTransactionHistory).length >= 1 &&
                <Accordion>
                    <Accordion.Toggle as={NavLink} eventKey="0" hidden={this.state.hideDiv}>
                        <div className='toggle' onClick={this.handleClick}>
                            Show More
                        </div>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                        <div>{Object.keys(this.props.restTransactionHistory).map((key, index) => (
                            <Row>
                                <Col xs={6}>
                                    <p className='time'>{moment(key).format('YYYY-M-DD H:mm')}</p>
                                </Col>
                                <Col xs={3}>
                                    {this.props.restTransactionHistory[key] > 0 &&
                                    <p className='history'>+ {this.props.restTransactionHistory[key]}</p>
                                    }
                                    {this.props.restTransactionHistory[key] < 0 &&
                                    <p className='negative'>- {Math.abs(this.props.restTransactionHistory[key])}</p>
                                    }
                                </Col>
                            </Row>
                        ))}</div>
                    </Accordion.Collapse>
                </Accordion>}

            </div>
        )
    }
}

export default TransactionHistory