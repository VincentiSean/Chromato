import React, { useState } from 'react';
import fire from '../config/Fire';

import TextField from '@material-ui/core/TextField';

function LoginPrompt(props) {

    let [formHeader, setHeader] = useState("Welcome back!");
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let [confirmPass, setConfirmPass] = useState("");
    let [loginBtn, setLoginBtn] = useState(true);
    let [fireErrors, setFireErrors] = useState("");
    let [samePass, setSame] = useState(false);
    
    // Changes the submit button depending on the user's current prompt
    let submitBtn = loginBtn
        ?   (<input id="standard-basic" className="onboard-submit" type="submit" onClick={login} value="Login" />)
        :   (<input className="onboard-submit" type="submit" onClick={register} value="Create Account" />);
    

    // Changes the bottom message depending on the user's current prompt
    let loginRegister = loginBtn
        ?   (<div className="onboard-switch-wrapper">
                <p className="onboard-switch-text">Not a member? </p>
                <button className="onboard-switch-btn" onClick={() => getAction('reg')}>Signup Here!</button>
            </div>)
        :   (<div className="onboard-switch-wrapper">
                <p className="onboard-switch-text">Already a member? </p>
                <button className="onboard-switch-btn" onClick={() => getAction('log')}>Login Here!</button>
            </div>);
    

    // Adds password confirm input if user is registering
    let confirmInputs = !loginBtn
        ?   (<div className="onboard-input-wrapper">
                <TextField 
                    id="outlined-password-input"
                    type="password"
                    label="Confirm Password"
                    value={confirmPass}
                    onChange={handleChange}
                    name="confirm-password"
                />
            </div>)
        : (<></>);
    
    
    // Log the user in on a successful email/password attempt
    function login(e) {
        e.preventDefault();
        return fire.auth().signInWithEmailAndPassword(email, password)
            .then(closePrompt())
            .catch((error) => {
                setFireErrors(error.message);
            });
    }
        

    // Register the new user on an error free register
    function register(e) {
        e.preventDefault();
        if (samePass) {
            fire.auth().createUserWithEmailAndPassword(email, password)
                .catch((error) => {
                    setFireErrors(error.message);
                });
        }
    }
    
    
    // Changes the header display depending on login or register
    function getAction(action) {
        if (action === 'reg') {
            setHeader("Let's get started!");
            setLoginBtn(false);
        } else {
            setHeader("Welcome back!");
            setLoginBtn(true);
        }
    }
    
    
    // Sets the state variables depending on the targeted input
    function handleChange(e) {
        if (e.target.name === "email") {
            setEmail(e.target.value);
        } else if (e.target.name === "password") {
            setPassword(e.target.value);
        } else if (e.target.name === "confirm-password") {
            setConfirmPass(e.target.value);
            if (e.target.value !== password) {
                setSame(false);
            } else {
                setSame(true);
            }
        }
    }


    // Closes the login/register prompt
    function closePrompt() {
        props.close(true);
    }
    
    return (
        <div className="login-wrapper">
                    <div className="login-header">
                        <h3 className="onboard-title">
                            {formHeader}
                        </h3>
                        <button className="login-close-btn" onClick={closePrompt}>X</button>
                    </div>
                    <p className="fire-errors">{fireErrors}</p>
                    <form className="onboard-form">
                        <div className="onboard-input-wrapper">
                            <TextField 
                                id="outlined-required"
                                type="email"
                                label="Email"
                                value={email}
                                onChange={handleChange}
                                name="email"
                            />
                        </div>
                        <div className="onboard-input-wrapper">
                            <TextField 
                                id="outlined-password-input"
                                type="password"
                                value={password}
                                label="Password"
                                onChange={handleChange}
                                name="password"
                            />
                        </div>
                        {confirmInputs}
                        {submitBtn}
                    </form>
                    {loginRegister}
                </div>
    )
}

export default LoginPrompt;