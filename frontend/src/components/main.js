import React from 'react';
import Axios from 'axios';
import './css/styles.css';
import './css/main.css';

class Container extends React.Component {
    constructor(props) {
        super(props);
        this.colors = {
            'Yes': 'yesBackground',
            'En Route': 'enrouteBackground',
            'No': 'noBackground',
            'None': 'grayedBackground',
        }
    }

    render() {
        if (this.props.textAndColor !== '') {
            return (
                <div className={`container ${this.props.status === this.props.textAndColor ? this.colors[this.props.textAndColor] : this.colors['None']}`}>
                    <p>{this.props.textAndColor}</p>
                    <p>{this.props.status === this.props.textAndColor && this.props.subStatus}</p>
                </div>
            )
        }  else {
            return (
                <div className={`container ${this.colors[this.props.status]}`}>
                    <p>{this.props.status}</p>
                    <p>{this.props.subStatus}</p>
                </div>
            )
        }
    }
}

class Main extends React.Component {
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
            this.setState({mobile: window.matchMedia("(max-width: 768px").matches})
            console.log(window.matchMedia("(max-width: 768px").matches)
            console.log("MOBILE: " + this.state.mobile)
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
            <div>
                <h1>Is Leo at Think Coffee?</h1>
                <div className={"statusContainer"}>
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

export default Main;