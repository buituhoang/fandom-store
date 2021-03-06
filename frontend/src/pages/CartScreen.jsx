import React from "react";
import { Row, Col, Typography, Button, Divider, Empty, Result, notification, Avatar } from "antd";
const { Title } = Typography;

const openSuccessRemoveNotification = (type) => {
    notification[type]({
        message: 'Removed Item',
    });
};

class CartScreen extends React.Component {
    state = {
        currentUser: {
            email: window.localStorage.getItem("email"),
            id: window.localStorage.getItem("id"),
            is_admin: "false"
        },
        placedOrderSuccess: false,
        cart_id: undefined,
        cart_items: [],
        numItem: 0,
        totalCost: 0,
    }

    adminCheck = () => {
        if (this.state.currentUser.email) {
            fetch("http://localhost:3001/api/users/checkAdmin", {
                credentials: "include",
                method: "GET"
            })
                .then(res => {
                    return res.json();
                })
                .then(data => {
                    this.setState({
                        currentUser: {
                            ...this.state.currentUser,
                            is_admin: data.data.is_admin
                        }
                    })
                })
        }
    }

    componentWillMount() {
        this.adminCheck()
    }

    componentDidMount() {
        // verify login
        if (!this.state.currentUser.id) {
            window.alert('Access Denied, Please Login')
            window.location.pathname = `/`
        } else { // fetch cart info
            fetch(`http://localhost:3001/api/users/cart`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((res) => {
                    return res.json();
                })
                .then((data) => {
                    this.setState({
                        cart_id: data.cart_id,
                        cart_items: data.data,
                    })
                    console.log(data.data);
                    let cnt = 0
                    let total = 0

                    this.state.cart_items.forEach((item) => {
                        cnt++
                        total = total + (item.quantity * item.price);
                    })

                    this.setState({
                        numItem: cnt,
                        totalCost: total,
                    })
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }

    handleProductClick = (prod_id) => {
        window.location.pathname = `/product/${prod_id}`;
    }

    handleRemoveItem = (id) => {
        fetch(`http://localhost:3001/api/users/removeFromCart`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                cart_items_id: id,
            }),
        })
            .then((res) => {
                return res.json()
            })
            .then((data) => {
                if (!data.success) {
                    window.alert(data.message)
                } else {
                    openSuccessRemoveNotification('success')
                    this.componentDidMount();
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    handlePlaceOrder = (event) => {
        event.preventDefault();
        if (this.state.numItem == 0) {
            window.alert('Your cart is empty, cannot place empty order')
            window.location.pathname = `/`
        } else {
            fetch(`http://localhost:3001/api/users/makeOrder`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then((res) => {
                    return res.json()
                })
                .then((data) => {
                    if (!data.success) {
                        window.alert(data.message)
                    } else {

                        fetch(`http://localhost:3001/api/users/clearCart`, {
                            method: 'POST',
                            credentials: 'include',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                            .then((resp) => {
                                return resp.json()
                            })
                            .then((data2) => {
                                if (!data2.success) {
                                    console.log(data2.message)
                                } else {
                                    this.componentDidMount()
                                    this.setState({
                                        placedOrderSuccess: true,
                                    })
                                }
                            })
                            .catch((e) => {
                                console.log(e)
                            })
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }

    render() {
        return (
            <div style={{
                backgroundImage: "linear-gradient(to bottom, #001529, #FCAE58)", minHeight: '100vh'
            }}>
                {this.state.placedOrderSuccess ? (
                    <Result
                        status="success"
                        title="Successfully Purchased!"
                        subTitle="Thank you for your patronage"
                        extra={[
                            <Button type="primary" key="console" onClick={() => window.location.pathname = `/`}>
                                Back Home
                            </Button>,
                            <Button key="buy" onClick={() => window.location.pathname = `/history`}>Order History</Button>,
                        ]}
                    />
                ) : (
                        <Row align='top'>
                            <Col span={5}></Col>
                            <Col span={19}>
                                <Title level={2} style={{}} >Here your cart:</Title>
                            </Col>
                            <Col span={5}></Col>
                            <Col span={14}>
                                <Row
                                    align="middle"
                                    style={{ borderWidth: "2px", borderStyle: "solid", borderColor: "#f2f2f2", lineHeight: '0', borderBottom: 'none', backgroundColor: '#fdfdfd', height: "50px", paddingTop: '5px' }}>
                                    <Col span={5}>
                                        <Title level={4} style={{ textAlign: 'center' }} > </Title>
                                    </Col>
                                    <Col span={8}>
                                        <Title level={4} style={{ textAlign: 'center' }} > Product Name </Title>
                                    </Col>
                                    <Col span={3}>
                                        <Title level={4} style={{ textAlign: 'center' }} > Quantity </Title>
                                    </Col>
                                    <Col span={4}>
                                        <Title level={4} style={{ textAlign: 'center' }} > Price </Title>
                                    </Col>
                                    <Col span={4} style={{}}>
                                        <Title level={4} style={{ textAlign: 'center' }} > </Title>
                                    </Col>
                                </Row>
                                {(this.state.numItem === 0) ? (
                                    (
                                        <div style={{ marginTop: '25px', backgroundColor: '#fdfdfd' }}>
                                            <Empty description='Your Cart Is Empty'>
                                                <Button type="primary" onClick={() => window.location.pathname = `/`}>Browse Products</Button>
                                            </Empty>
                                        </div>
                                    )
                                ) : null}
                                {this.state.cart_items.map((item) => {
                                    return (

                                        <Row align="middle" style={{ borderWidth: "2px", borderStyle: "solid", borderColor: '#f2f2f2', backgroundColor: '#fdfdfd' }}>
                                            <Col span={5} align="center">
                                                <Avatar shape="square" style={{ width: "100%", paddingLeft: "5px" }} src={item.image_url[0]} size={100} />
                                            </Col>
                                            <Col span={8}>
                                                <Title level={4} style={{ textAlign: 'center' }} ><a onClick={(event) => { this.handleProductClick(item.prod_id) }}>{item.prod_name}</a> </Title>
                                            </Col>
                                            <Col span={3}>
                                                <Title level={4} style={{ textAlign: 'center' }} >{item.quantity}</Title>
                                            </Col>
                                            <Col span={4}>
                                                <Title level={4} style={{ textAlign: 'center', color: 'green' }} >${item.price}</Title>
                                            </Col>
                                            <Col span={4} align="center">
                                                <Button danger ghost onClick={(event) => { this.handleRemoveItem(item.id) }}>Remove</Button>
                                            </Col>
                                        </Row>
                                    )
                                })}
                                <Row
                                    justify="right"
                                    style={{ borderWidth: "2px", borderStyle: "solid", borderColor: "#f2f2f2", lineHeight: '0', borderBottom: 'none', backgroundColor: '#fdfdfd', paddingTop: '5px' }}>
                                        {(this.state.numItem === 0) ? null : (
                                            <Col>
                                                <Title level={3} style={{ textAlign: 'right' }}>Total: ${this.state.totalCost}</Title>
                                                <Button type='primary' onClick={this.handlePlaceOrder} style={{ float: 'right' }}>Place Order</Button>
                                            </Col>
                                        )}
                
                                </Row>
                            </Col>
                            <Col span={5}></Col>
                        </Row>
                    )
                }
            </div>
        )
    }
}

export default CartScreen;