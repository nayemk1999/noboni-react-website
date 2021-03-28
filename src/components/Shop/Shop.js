import React, { useState, useEffect } from 'react';
import Cart from '../Cart/Cart';
import Products from '../Products/Products';
import './Shop.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { addToDatabaseCart, getDatabaseCart } from '../../utilities/databaseManager';
import { Link } from 'react-router-dom';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);

    useEffect(() => {
        fetch('https://tranquil-coast-22381.herokuapp.com/products')
            .then(res => res.json())
            .then(data => setProducts(data))
    }, [])

    useEffect(() => {
        const saveCart = getDatabaseCart()
        const productKeys = Object.keys(saveCart)
        fetch('https://tranquil-coast-22381.herokuapp.com/productsKeys', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(productKeys)
        })
        .then(res => res.json())
        .then(data => setCart(data))
    }, [])

    const addedCart = (product) => {
        const toBeAdded = product.key
        const sameProduct = cart.find(pd => pd.key === toBeAdded);
        let count = 1;
        let newCart;
        if (sameProduct) {
            count = sameProduct.quantity + 1;
            sameProduct.quantity = count;
            const others = cart.filter(pd => pd.key !== toBeAdded)
            newCart = [...others, sameProduct]
        }
        else {
            product.quantity = 1;
            newCart = [...cart, product]
        }
        setCart(newCart);
        addToDatabaseCart(product.key, count)
    }
    return (
        <div className='main-container'>
            <div className='searchBox'>
                <input type="text" placeholder="type Here to search" /><span className='fontAwesome'><FontAwesomeIcon icon={faShoppingCart} /> <span className='cartCount'>{cart.length}</span></span>
            </div>
            <div className='product-container'>
                <div className='products'>
                    {
                        products.map(product => <Products
                            showAddToCart={true}
                            addedCart={addedCart}
                            product={product}
                            key={product.key}
                        ></Products>)
                    }
                </div>
                <div>
                    <Cart cart={cart}>
                        <Link to="/order-reviews"><button className="cartBtn">Review Order</button></Link>
                    </Cart>
                </div>
            </div>

        </div>

    );
};

export default Shop;