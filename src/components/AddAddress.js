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
            mycar: 'volvo'
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onChange(val){
        this.setState({
            address: val.address,
            currency: val.currency
        })
    }

    onSubmit = (event) => {
        event.preventDefault();
        this.props.addAddress(this.state.currency, this.state.address)
        this.setState({
            address: '',
            currency: '',
            isLoaded: true
        })
        console.log(this.state.address)
    }

    render() {
      const options = [
       {value: 'one', label: 'One' },
       {value: 'two', label: 'Two' }
    ];
        return (
            <div onSubmit={this.onSubmit}>
                <div>
                    <form>
                        <input type='text' name='address' placeholder='Add blockchain.com wallet address'
                               value={this.state.address} onChange={this.onChange} required/>
                               <Select
                                 value = {this.state.currency}
                               onchange = {this.onChange}
                               options={options}/>
                        <div className='form-submit'>
                            <input type="submit" value="Submit"/>
                        </div>
                    </form>
                </div>

            </div>

        )
    }
}

// constructor(){
//      super();
//      this.state = {value: ''}
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
//           onChange={this.logChange.bind(this)}
//       />
//
//     )
//   }
// }

export default AddAddress