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
            status: "",
            substatus: "",
            statusError: "",
            successMessage: "",
        }

        this.usernameFocus = React.createRef();
        this.passwordFocus = React.createRef();
    }

    async componentDidMount() {
        try {
            await Axios.get("backend/checkSession");
            this.setState({"loggedIn": true,});
        } catch(err) {
            if (err.response.status !== 400) {
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
        } else {
            try {
                await Axios.post("backend/login", {
                    username: this.state.username.trim(),
                    password: this.state.password.trim(),
                });
                this.setState({username: "", password: "", usernameError: "", passwordError: "", loggedIn: true})

            } catch (err) {
                if (err.response.status === 400) {
                    this.setState({usernameError: "User does not exist!", passwordError: "",});
                    this.usernameFocus.current.focus();
                } else if (err.response.status === 401) {
                    this.setState({usernameError: "", passwordError: "Incorrect password!"});
                    this.passwordFocus.current.focus();
                } else {
                    console.log(err)
                }
            }
        }
    }

    statusSubmit = async (event) => {
        event.preventDefault();

        var validStatuses = ["Yes", "En Route", "No"]

        if (this.state.status === "") {
            this.setState({statusError: "Status can't be empty!", successMessage: "",})
        } else if (validStatuses.findIndex(status => {return status === this.state.status}) === -1) {
            this.setState({statusError: "Not a valid status!", successMessage: "",})
        } else {
            this.setState({status: "", substatus: "", statusError: "",})
            try {
                await Axios.post("backend/statusUpdate", {
                    status: this.state.status,
                    substatus: this.state.substatus,
                })
                this.setState({successMessage: "Successfully sent status!"})
            } catch(err) {
                if (err.response.status === 401) {
                    this.setState({loggedIn: false, status: "", substatus: "", statusError: "", successMessage: "",})
                } else {
                    console.log(err)
                }
            }
        }
    }

    logout = async (event) => {
        event.preventDefault();

        try {
            await Axios.get("backend/logout")
        } catch(err) {
            if (err.response.status === 500) {
                console.log(err)
            }
        }
        this.setState({loggedIn: false})
    }

    render() {
        let usernameErrorMessage = this.state.usernameError
        let passwordErrorMessage = this.state.passwordError
        let statusErrorMessage = this.state.statusError
        let statusSuccessMessage = this.state.successMessage
        if (this.state.loggedIn === false) {
            return (
                <div>
                    <h1>Admin Login</h1>
                    <div className={"formContainer"}>
                        <form onSubmit={this.credentialSubmit}>
                            <h2>Login Here</h2>
                            <input type={"text"} placeholder={"Username"} value={this.state.username} ref={this.usernameFocus}
                                   onChange={(event) => this.setState({username: event.target.value})}/>
                            <div className={"errorMessage"}>{usernameErrorMessage}</div>
                            <input type={"password"} placeholder={"Password"} value={this.state.password} ref={this.passwordFocus}
                                   onChange={(event) => this.setState({password: event.target.value})}/>
                            <div className={"errorMessage"}>{passwordErrorMessage}</div>
                            <button>Login</button>
                        </form>
                    </div>
                </div>
            )
        } else {
            return (
                <div>
                    <h1>Admin Panel</h1>
                    <div className={"formContainer"}>
                        <form onSubmit={this.statusSubmit}>
                            <h2>Submit Information</h2>
                            <div className={"successMessage"}>{statusSuccessMessage}</div>
                            <input type={"text"} placeholder={"Status [Yes / En Route / No]"} value={this.state.status}
                                   onChange={(event) => this.setState({status: event.target.value})}/>
                            <div className={"errorMessage"}>{statusErrorMessage}</div>
                            <input type={"text"} placeholder={"Substatus"} value={this.state.substatus}
                                   onChange={(event) => this.setState({substatus: event.target.value})}/>
                            <div className={"multipleButtons"}>
                                <button>Submit</button>
                                <button onClick={this.logout}>Logout</button>
                            </div>
                        </form>
                    </div>
                </div>
            )
        }
    }
}

export default Admin;