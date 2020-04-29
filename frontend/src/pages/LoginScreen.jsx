import React from "react";
import { Form, Input, Button, Alert} from "antd";
//import { UserOutlined, LockOutlined } from '@ant-design/icons';

import './LoginScreen.css';

class LoginScreen extends React.Component {
    state = {
        email: '',
        password: '',
        err: '',
    };

    handleEmailChange = (event) => {
        this.setState({
            email: event.target.value,
        });
    };

    handlePasswordChange = (event) => {
        this.setState({
            password: event.target.value,
        });
        
    };

    handleFormSubmit = (event) => {
        //event.preventDefault();
        fetch(`http://localhost:3001/api/users/login`, {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password,
            }),
        })
            .then((res) => {
                //console.log(res.json);
                return res.json();
            })
            .then((data) => {
                if (!data.success) {
                  this.setState({
                    err: data.message,
                });
                } else {
                    // save current user to local storage
                    window.localStorage.setItem('email', data.data.email);
                    window.localStorage.setItem('fullName', data.data.fullName);
                    
                    // redirect user
                    window.location.href = '/HomeScreen';
                }
            })
            .catch((error) => {
                console.log(error);
                this.setState({
                  err: error.message,
              });
            });
    };
    render() {
        const layout = {
            labelCol: {
              span: 7,
            },
            wrapperCol: {
              span: 16,
            },
          };
          const tailLayout = {
            wrapperCol: {
              offset: 8,
              span: 16,
            },
          };
          //const onFinish = values => {
            //console.log('Success:', values);
          //};
        
          const onFinishFailed = errorInfo => {
            //console.log('Failed:', errorInfo);
          };
        
          return (
            <div className='pageLogin'>
              <div className="loginBox">
                <div className='greeting'>
                  Wellcome
                </div>
                <div className='inputLogin'>
                <Form 
              onFinish={this.handleFormSubmit}
                {...layout}
                name="basic"
                initialValues={{
                  remember: true,
                }}
                //onFinish={onFinish}
                onFinishFailed={onFinishFailed}
              >
                <Form.Item
                  label="E-mail"
                  name="email"
                  rules={[
                    {
                      type: 'email',
                      message: 'The input is not valid E-mail!',
                    },
                    {
                      required: true,
                      message: 'Please input your email!',
                    },
                  ]}
                >
                  <Input 
                      placeholder="Email"
                      onChange={this.handleEmailChange}
                  />
                </Form.Item>
          
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your password!',
                    },
                  ]}
                >
                  <Input.Password 
                      placeholder="Password"
                      onChange={this.handlePasswordChange}
                  />
                </Form.Item>

                <div className='errorLogin'>
                  {this.state.err ? (
                    <Alert
                    message={this.state.err}
                    type="error"
                    showIcon
                  />
                  ): null}
                </div>

                <Form.Item {...tailLayout}>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
              </Form>
                </div>
              </div>
            </div>
          );
    }
}

export default LoginScreen;

