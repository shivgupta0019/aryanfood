import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import "../../Components/Style/userotp.css";
import FormValidators from './FormValidators';
import axios from 'axios';


export default function SignupPage() {
    let [data, setData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        cpassword: "",
    })

    let [errorMessage, setErrorMessage] = useState({
        name: "Name Field is Mendatory",
        email: "Email Address Field is Mendatory",
        phone: "Phone Number Field is Mendatory",
        password: "Password Field is Mendatory",
    })

    let [show, setShow] = useState(false)
    let navigate = useNavigate()

    function getInputData(e) {
        let { name, value } = e.target
        setData({ ...data, [name]: value })
        setErrorMessage({ ...errorMessage, [name]: FormValidators(e) })
    }




async function postData(e) {
    e.preventDefault();

    let error = Object.values(errorMessage).find(x => x !== "");
    if (error) {
        setShow(true);
        return;
    }

    if (data.password !== data.cpassword) {
        newFunction();
        return;
    }

    try {
        let res = await axios.post("http://localhost:5000/api/signup", {
            name: data.name,
            email: data.email,
            phone: data.phone,
            password: data.password
        });

        alert(res.data.message);
        navigate("/");

    } catch (err) {
        alert(err.response?.data?.message || "Error");
    }

    function newFunction() {
        setShow(true);
    }
}
    return (
        <>
            <section className="login  footer-padding">
                <div className="col-lg-6 col-sm-10 col-md-8 m-auto bg-light p-5  rounded my-5">
                    <h5 className="text-center mb-3">Create Your Free Account</h5>
                    <form onSubmit={postData}>
                        <div className='row'>

                            <div className='col-md-6 mb-3'>
                                <label>Name*</label>
                                <input type='text' name='name' onChange={getInputData}
                                    className={`form-control ${show && errorMessage.name ? 'border-danger' : 'myborder'}`}
                                    placeholder='Full Name' />
                                {show && errorMessage.name ? <p className='text-danger'>{errorMessage.name}</p> : null}
                            </div>

                            <div className='col-md-6 mb-3'>
                                <label>Phone*</label>
                                <input type='text' name='phone' onChange={getInputData}
                                    className={`form-control ${show && errorMessage.phone ? 'border-danger' : 'myborder'}`}
                                    placeholder='Phone Number' />
                                {show && errorMessage.phone ? <p className='text-danger'>{errorMessage.phone}</p> : null}
                            </div>

                            <div className='col-12 mb-3'>
                                <label>Email*</label>
                                <input type='email' name='email' onChange={getInputData}
                                    className={`form-control ${show && errorMessage.email ? 'border-danger' : 'myborder'}`}
                                    placeholder='Email Address' />
                                {show && errorMessage.email ? <p className='text-danger'>{errorMessage.email}</p> : null}
                            </div>

                            <div className='col-md-6 mb-3'>
                                <label>Possword*</label>
                                <input type='password' name='password' onChange={getInputData}
                                    className={`form-control ${show && errorMessage.password ? 'border-danger' : 'myborder'}`}
                                    placeholder='Enter Password' />
                                {show && errorMessage.password ? <p className='text-danger'>{errorMessage.password}</p> : null}
                            </div>

                            <div className='col-md-6 mb-3'>
                                <label>Confirm Possword*</label>
                                <input type='password' name='cpassword' onChange={getInputData}
                                    className={`form-control ${show && errorMessage.password ? 'border-danger' : 'myborder'}`}
                                    placeholder='Confirm Password' />
                            </div>

                        </div>

                        <div className="col-12 text-center">
                            <button type='submit'
                                className="btn btn-primary mybackground btn-lg rounded-pill p-3 my-3 w-50"
                                style={{ border: "none" }}>
                                Create an Account
                            </button>

                            <span className="shop-account d-block"><Link to="/">Already have an account ?</Link></span>
                           
                        </div>

                    </form>
                </div>
            </section>
        </>
    )
}