import React, {Component} from 'react';
import './mainForm.css';
import Select from "react-select";

export class AddAddress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            error: null,
            address: '',
            currency: 'btc',
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.handleChange = this.handleChange.bind(this)
    }

    onChange(event) {
        this.setState({
            'address': event.target.value,
        })
    }

    handleChange(val) {
        this.setState({
            'currency': val.value,
        })
        console.log(val)

    }

    onSubmit = (event) => {
        event.preventDefault();
        this.props.addAddress(this.state.currency, this.state.address)
        this.setState({
            address: '',
            currency: '',
            isLoaded: true
        })
    }

    render() {
        const options = [
            {value: 'btc', label: 'BTC'},
            {value: 'eth', label: 'ETH'}
        ];
        return (
            <div onSubmit={this.onSubmit}>
                <div>
                    <form>
                        <input type='text' name='address' placeholder='Add blockchain.com wallet address'
                               value={this.state.address} onChange={this.onChange} required/>
                        <Select
                            defaultValue={options[0]}
                            value={this.state.value}
                            onChange={this.handleChange}
                            options={options} />
                        <div className='form-submit'>
                            <input type="submit" value="Submit"/>
                        </div>
                    </form>
                </div>

            </div>

        )
    }

// constructor(){
//      super();
//      this.state = {value: ''}
//     this.logChange=this.logChange.bind(this)
//   }
//
//   logChange(val) {
//     console.log("Selected: " + val.value);
//     this.setState({value: val.value});
//   }
//
//   render(){
//     var options = [
//        {value: 'one', label: 'One' },
//        {value: 'two', label: 'Two' }
//     ];
//     return(
//
//       <Select
//           name="form-field-name"
//           value={this.state.value}
//           options={options}
//           onChange = {this.logChange}
//
//       />
//
//     )
//   }

}

export default AddAddress