import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import fireDB from "../fireConfig";
import { FaTrash, FaEdit } from "react-icons/fa";
import { Modal, Tab, Tabs } from "react-bootstrap";
import { toast } from "react-toastify";

const AdminPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState({
    name: "",
    price: 0,
    image: "",
    category: "",
  });

  const [show, setShow] = useState(false);
  const [add, setAdd] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    try {
      setLoading(true);
      const users = await getDocs(collection(fireDB, "products"));
      const productsArray = [];
      users.forEach((doc) => {
        const obj = {
          id: doc.id,
          ...doc.data(),
        };
        productsArray.push(obj);
        setLoading(false);
      });
      setProducts(productsArray);
      // console.log(productsArray)
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    getOrdersData();
  }, []);

  async function getOrdersData() {
    try {
      setLoading(true);
      const result = await getDocs(collection(fireDB, "orders"));
      const ordersArray = [];
      result.forEach((doc) => {
        ordersArray.push(doc.data());
        setLoading(false);
      });
      setOrders(ordersArray);
      // console.log(ordersArray)
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  const editHandler = (item) => {
    setProduct(item);
    setShow(true);
  };

  const updateProduct = async () => {
    try {
      setLoading(true);
      await setDoc(doc(fireDB, "products", product.id), product);
      handleClose();
      toast.success("Product Updated Successfully");
      window.location.reload();
    } catch (error) {
      toast.error("Error Updating Product");
      setLoading(false);
    }
  };

  const addHandler = () => {
    setAdd(true);
    handleShow();
  };

  const addProduct = async () => {
    try {
      setLoading(true);
      await addDoc(collection(fireDB, "products"), product);
      handleClose();
      toast.success("Product Added Successfully");
      window.location.reload();
    } catch (error) {
      toast.error("Error Adding Product");
      setLoading(false);
    }
  };

  const deleteProduct = async (item) => {
    try {
      setLoading(true);
      await deleteDoc(doc(fireDB, "products", item.id));
      toast.success("Product Deleted Successfully");
      getData();
    } catch (error) {
      toast.error("Error Deleting Product");
      setLoading(false);
    }
  };

  return (
    <Layout loading={loading}>
      <Tabs
        defaultActiveKey="products"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="products" title="Products">
          <div className="d-flex justify-content-between">
            <h3>Products Lists</h3>
            <button onClick={addHandler}>ADD PRODUCT</button>
          </div>
          <table className="table mt-3">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => {
                return (
                  <tr>
                    <td>
                      <img src={item.image} height="80" width="80" alt="" />
                    </td>
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td>{item.price}</td>
                    <td>
                      <FaTrash
                        className="del"
                        size={20}
                        onClick={() => deleteProduct(item)}
                      />
                      <FaEdit
                        className="edit"
                        size={25}
                        onClick={() => editHandler(item)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>
                {add === true ? "Add a Product" : "Edit Product"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {" "}
              <div className="register-form">
                <input
                  type="text"
                  className="form-control"
                  placeholder="name"
                  value={product.name}
                  onChange={(e) => {
                    setProduct({ ...product, name: e.target.value });
                  }}
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="image url"
                  value={product.image}
                  onChange={(e) => {
                    setProduct({ ...product, image: e.target.value });
                  }}
                />
                <input
                  type="number"
                  className="form-control"
                  placeholder="price"
                  value={product.price}
                  onChange={(e) => {
                    setProduct({ ...product, price: e.target.value });
                  }}
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="category"
                  value={product.category}
                  onChange={(e) => {
                    setProduct({ ...product, category: e.target.value });
                  }}
                />

                <hr />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <button>Close</button>
              {add ? (
                <button onClick={addProduct}>SAVE</button>
              ) : (
                <button onClick={updateProduct}>UPDATE</button>
              )}
            </Modal.Footer>
          </Modal>
        </Tab>
        <Tab eventKey="orders" title="Orders">
          {orders
            .map((order) => {
              return (
                <table className="table mt-3 order">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.cartItems.map((item) => {
                      return (
                        <tr>
                          <td>
                            <img
                              src={item.image}
                              height="80"
                              width="80"
                              alt=""
                            />
                          </td>
                          <td>{item.name}</td>
                          <td>{item.price}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              );
            })}
        </Tab>
        <Tab eventKey="users" title="Users" disabled></Tab>
      </Tabs>
    </Layout>
  );
};

export default AdminPage;
