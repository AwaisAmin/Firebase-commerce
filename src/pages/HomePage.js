import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { addDoc, collection, getDocs } from "firebase/firestore";
import fireDB from "../fireConfig";
import { fireProducts } from "../products";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const { cartItems } = useSelector((state) => state.cartReducer);
  const [loading, setLoading] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const [filterType, setFilterType] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // async function addData() {
  //     try {
  //         await addDoc(collection(fireDB, "users"), {
  //             name: "Umer",
  //             age: 22
  //         })
  //     } catch (error) {
  //         console.log(error)
  //     }
  // }

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
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // function addProductsData() {
  //     fireProducts.map(async (product) => {
  //         try {
  //             await addDoc(collection(fireDB, "products"), product)
  //         } catch (error) {
  //             console.log(error)
  //         }
  //     })
  // }

  const addToCart = (product) => {
    dispatch({ type: "ADD_TO_CART", payload: product });
  };

  return (
    <Layout loading={loading}>
      <div className="container">
        <div className="d-flex w-50 align-items-center my-3 justify-center-center">
          <input
            type="text"
            className="form-control mx-2"
            placeholder="search items"
            value={searchKey}
            onChange={(e) => {
              setSearchKey(e.target.value);
            }}
          />
          <select
            name=""
            id=""
            className="form-control mt-3"
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
            }}
          >
            <option value="">All</option>
            <option value="electronics">Electronics</option>
            <option value="mobiles">Mobiles</option>
            <option value="fashion">Fashion</option>
          </select>
        </div>
        <div className="row">
          {products.filter((obj) => obj.name.toLowerCase().includes(searchKey))
            .filter((obj) => obj.category.toLowerCase().includes(filterType))
            .map((product) => {
              return (
                <div className="col-md-4">
                  <div className="m-2 p-1 product position-relative">
                    <div className="product-content">
                      <p>{product.name}</p>
                      <div className="text-center">
                        <img
                          src={product.image}
                          alt=""
                          className="productImage"
                        />
                      </div>
                    </div>
                    <div className="product-actions">
                      <h2>{product.price} RS/.</h2>
                      <div className="d-flex">
                        <button
                          className="mx-2"
                          onClick={() => addToCart(product)}
                        >
                          Add to Cart
                        </button>
                        <button
                          onClick={() => {
                            navigate(`/productinfo/${product.id}`);
                          }}
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
