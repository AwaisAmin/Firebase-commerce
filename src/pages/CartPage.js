import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../components/Layout';
import { FaTrash } from 'react-icons/fa';
import { Button, Modal } from 'react-bootstrap';
import { addDoc, collection } from 'firebase/firestore';
import fireDB from '../fireConfig'
import { toast } from 'react-toastify';

const CartPage = () => {
  const {cartItems} = useSelector(state=>state.cartReducer)
  const [totalAmount, setTotalAmount] = useState(0)
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState()
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(()=> {
    let temp = 0;
    cartItems.forEach((cartItem) => {
      temp = temp+cartItem.price
    })
    setTotalAmount(temp)
  },[cartItems])

  useEffect(()=> {
    localStorage.setItem('cartItems', JSON.stringify(cartItems))
  },[cartItems])

  const deleteFromCart =(product) => {
    dispatch({type: 'DELETE_FROM_CART', payload: product})
  }

  const placeOrder = async() => {
    const addressInfo = {
      name,
      address,
      pincode,
      phoneNumber
    }
    console.log(addressInfo)
    const orderInfo = {
      cartItems,
      addressInfo,
      email: JSON.parse(localStorage.getItem('currentUser')).user.email,
      userid: JSON.parse(localStorage.getItem('currentUser')).user.uid,
    }

    try {
      setLoading(true);
      const result = await addDoc(collection(fireDB, "orders"), orderInfo)
      setLoading(false);
      toast.success("Order Placed Successfully")
      handleClose()
    } catch (error) {
      setLoading(false);
      toast.error("Order Failed")
    }
  }

  return (
    <Layout loading={loading} >
      <table className='table mt-3'>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map(item=> {
            return <tr>
              <td><img src={item.image} height="80" width="80" alt="" /></td>
              <td>{item.name}</td>
              <td>{item.price}</td>
              <td><FaTrash  className='del' onClick={()=>deleteFromCart(item)} /></td>
            </tr>
          })}
        </tbody>
      </table>
      <div className="d-flex justify-content-end">
          <h1 className='total-amount'>Total Amount = {totalAmount} RS/-</h1>
      </div>
      <div className="d-flex justify-content-end mt-3">
          <button onClick={handleShow}>PLACE ORDER</button>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add your address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div className="register-form">
            <h2>Register</h2>
            <hr />
            <input type="text" 
              className="form-control" 
              placeholder="name" 
              value={name} 
              onChange={(e) => {setName(e.target.value)}} />
            <textarea type="text"
              rows={2} 
              className="form-control" 
              placeholder="address" 
              value={address} 
              onChange={(e) => {setAddress(e.target.value)}} />
            <input type="number" 
              className="form-control" 
              placeholder="pincode" 
              value={pincode} 
              onChange={(e) => {setPincode(e.target.value)}} />
            <input type="number" 
              className="form-control" 
              placeholder="phone number" 
              value={phoneNumber} 
              onChange={(e) => {setPhoneNumber(e.target.value)}} />

              <hr />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button onClick={handleClose}>
            Close
          </button>
          <button onClick={placeOrder}>
            Order
          </button>
        </Modal.Footer>
      </Modal>
    </Layout>
  )
}

export default CartPage