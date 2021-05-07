import React, {Component} from 'react';
import './mainForm.css';

export class AddAddress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            error: null,
            address: '',
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onChange(event) {
        this.setState({'address': event.target.value})
    }

    onSubmit = (event) => {
        event.preventDefault();
        this.props.addAddress(this.state.address)
        this.setState({
            address: '',
            isLoaded: true
        })
    }

    render() {
        return (
            <div onSubmit={this.onSubmit}>
                <div>
                    <form>
                        <input type='text' name='address' placeholder='Add blockchain.com wallet address'
                               value={this.state.address} onChange={this.onChange} required/>
                               <select>
                                <option value="BTH">BTH</option>
                                <option value="ETH">ETH</option>
                                </select>
                        <div className='form-submit'>
                            <input type="submit" value="Submit"/>
                        </div>
                    </form>
                </div>

            </div>

        )
    }
}

export default AddAddress