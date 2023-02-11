import React from 'react';
import Axios from 'axios';
import './css/styles.css';
import './css/coffeeMain.css';

class Container extends React.Component {
    constructor(props) {
        super(props);
        this.colors = {
            'Yes': 'coffee_yes_background',
            'En Route': 'coffee_enroute_background',
            'No': 'coffee_no_background',
            'None': 'coffee_gray_background',
        }
    }

    render() {
        if (this.props.textAndColor !== '') {
            return (
                <div className={`coffee_container ${this.props.status === this.props.textAndColor ? this.colors[this.props.textAndColor] : this.colors['None']}`}>
                    <p>{this.props.textAndColor}</p>
                    <p>{this.props.status === this.props.textAndColor && this.props.subStatus}</p>
                </div>
            )
        }  else {
            return (
                <div className={`coffee_container ${this.colors[this.props.status]}`}>
                    <p>{this.props.status}</p>
                    <p>{this.props.subStatus}</p>
                </div>
            )
        }
    }
}

class CoffeeMain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mobile: true,
            status: '',
            subStatus: '',
        };
    };

    async componentDidMount() {
        if (window.matchMedia("(min-width: 769px)").matches) {
            this.setState({mobile: false})
        }

        window.addEventListener('resize', (event) => {
            window.innerWidth < 768 ? this.setState({mobile: true}) : this.setState({mobile: false})
        });

        try {
            var data
            await Axios.get("/backend/retrieveStatus")
                .then(function (response) {
                    data = response.data
                })
            this.setState({status: data.status, subStatus: data.substatus})
        } catch(err) {
            console.log(err)
        }
    };

    render() {
        return (
            <div className={"coffee_main"}>
                <h1>Is Leo at Think Coffee?</h1>
                <div className={"coffee_status_container"}>
                    {this.state.mobile ?
                        <div>
                            <Container status={this.state.status} subStatus={this.state.subStatus} textAndColor={'Yes'}/>
                            <Container status={this.state.status} subStatus={this.state.subStatus} textAndColor={'En Route'}/>
                            <Container status={this.state.status} subStatus={this.state.subStatus} textAndColor={'No'}/>
                        </div>
                        :
                        <div>
                            <Container status={this.state.status} subStatus={this.state.subStatus} textAndColor={''}/>
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default CoffeeMain;