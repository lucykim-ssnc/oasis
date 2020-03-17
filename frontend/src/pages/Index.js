import React, { Component } from 'react';
import { Badge, CardFooter, InputGroup, Input, CardBody } from 'reactstrap';
import { NavLink, Route } from "react-router-dom";
import { inject, observer } from 'mobx-react';
import logo from "../assets/img/oasis_logo_login.png";
import LoginForm from "../components/common/LoginForm";
import AdminLoginForm from "../components/common/AdminLoginForm";
// import Main from './Main'

import '../assets/scss/Login.scss';

// 인덱스 페이지(login)
@inject('signInStore')
@observer
class Index extends Component {
    componentDidMount() {
        const { signInStore, onUpdate } = this.props;
        onUpdate();
    }

    login = async () => {
        const { history, signInStore } = this.props;
        try {
            await signInStore.signIn();
            if (localStorage.getItem('jwtToken')) {
                signInStore.root.setAuthToken();
                await signInStore.root.myPageStore.identities();
                await signInStore.root.companyStore.preferences();
                localStorage.setItem('userName', signInStore.root.myPageStore.name);
                localStorage.setItem('userRole', signInStore.root.myPageStore.role);
                localStorage.setItem('featureEnabled', JSON.stringify(signInStore.root.companyStore.featureEnabled));
                if (signInStore.root.myPageStore.role === 'STAFF') {
                    history.push({
                        pathname: '/admin/commute/staff/',
                    });
                } else {
                    history.push({
                        pathname: '/admin/dashboard',
                    });
                }
            }
        } catch (e) {
            signInStore.root.isLoading = false;
            signInStore.handleErrorMessage('아이디와 비밀번호를 확인하세요.');
        }
    };

    render() {
        const { signInStore } = this.props;
        return (
            <div>
                <div className="oasis-img">
                    <div className="login-logo">
                        <img src={logo} alt="logo" />
                    </div>
                </div>

                <div className="login">
                    <div className='form-signin'>
                        <h2 className="form-logo"> Login </h2>

                        <div className='login-select'>
                            <ul className='login-ul'>
                                <NavLink exact to="/auth/login" className="item" activeClassName="active">
                                    <li>User Login</li>
                                </NavLink>
                                <NavLink to="/auth/login/admin" className="item" activeClassName="active">
                                    <li>Admin Login</li>
                                </NavLink>
                            </ul>
                        </div>

                        {/*<div className='user-login'>*/}
                        {/*    <Route exact path="/auth/login" component={LoginForm} />*/}
                        {/*    <Route path="/auth/login/admin" component={AdminLoginForm} />*/}
                        {/*</div>*/}
                        <CardBody>
                            <InputGroup>
                                <Input
                                    placeholder="E-mail"
                                    type="text"
                                    autoComplete="off"
                                    name="loginName"
                                    className="form-input"
                                    onChange={signInStore.handleChange}
                                    onKeyPress={this.keyPressInputId}
                                />
                            </InputGroup>
                            <InputGroup>
                                <Input
                                    placeholder="PW"
                                    type="password"
                                    autoComplete="off"
                                    name="password"
                                    className="form-input"
                                    onChange={signInStore.handleChange}
                                    onKeyPress={this.keyPressPassword}
                                />
                            </InputGroup>
                            <Badge className="errorBadge" color="danger">
                                {signInStore.errorMessage}
                            </Badge>
                        </CardBody>
                        <CardFooter>
                            <button type="button" className="login-button" color="default" onClick={this.login}>
                                로그인
                            </button>
                        </CardFooter>
                    </div>
                </div>
            </div>
        );
    }
}

export default Index;