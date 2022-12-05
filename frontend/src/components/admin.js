import React from 'react';
import Axios from 'axios';
import './css/styles.css';
import './css/admin.css';

class Admin extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loggedIn: false,
            username: "",
            password: "",
            usernameError: "",
            passwordError: "",
        }

        this.usernameFocus = React.createRef();
        this.passwordFocus = React.createRef();
    }

    async componentDidMount() {
        try {
            await Axios.get("backend/checkSession");
            this.setState({"loggedIn": true,});
        } catch(err) {
            if (err !== 400) {
                console.log(err);
            }
            this.usernameFocus.current.focus();
        }
    }

    credentialSubmit = async (event) => {
        event.preventDefault();

        if (this.state.username === "") {
            this.setState({usernameError: "Username can't be empty!", passwordError: "",});
            this.usernameFocus.current.focus();
        } else if (this.state.password === "") {
            this.setState({usernameError: "", passwordError: "Password can't be empty!",});
            this.passwordFocus.current.focus();
        }

        try {
            await Axios.post("backend/login", {
                username: this.state.username,
                password: this.state.password,
            });
            this.setState({username: "", password: "", usernameError: "", passwordError: "", loggedIn: true})

        } catch(err) {
            if (err === 400) {
                this.setState({usernameError: "User does not exist!", passwordError: "",});
                this.usernameFocus.current.focus();
            } else if (err === 401) {
                this.setState({usernameError: "", passwordError: "Incorrect password!"});
                this.passwordFocus.current.focus();
            } else {
                console.log(err)
            }
        }
    }


    render() {
        let usernameErrorMessage = this.state.usernameError
        let passwordErrorMessage = this.state.passwordError
        if (this.state.loggedIn === false) {
            return (
                <div>
                    <h1>Admin Login</h1>
                    <div className={"formContainer"}>
                        <form onSubmit={this.credentialSubmit}>
                            <h2>Login Here</h2>
                            <input type={"text"} placeholder={"Username"} value={this.state.username} ref={this.usernameFocus}
                                   onChange={(event) => this.setState({username: event.target.value})}/>
                            <div className={'errorMessage'}>{usernameErrorMessage}</div>
                            <input type={"password"} placeholder={"Password"} value={this.state.password} ref={this.passwordFocus}
                                   onChange={(event) => this.setState({password: event.target.value})}/>
                            <div className={'errorMessage'}>{passwordErrorMessage}</div>
                            <button>Login</button>
                        </form>
                    </div>
                </div>
            )
        } else {
            return (
                <div>
                    <h1>Admin Panel</h1>
                </div>
            )
        }
    }
}

export default Admin;