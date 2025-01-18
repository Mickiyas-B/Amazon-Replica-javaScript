import { cart, removeFromcart, updateCheckout, updateDeliveryOption, updateQuantity, } from "../../data/cart.js";
import { products, getProduct} from "../../data/products.js";
import { formatCurrency } from "../utility/money.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import {deliveryOptions} from '../../data/deliveryOptions.js';


export function renderOrderSummary(){
let cartSummaryHTML = '';

cart.forEach((item) =>{

    const productId = item.productId;

    const matcheingProduct = getProduct(productId);

    const deliveryOptionsId = item.deliveryOptionsId;

        let deliveryOption;

        deliveryOptions.forEach((option) => {
            if (option.id === deliveryOptionsId){
                deliveryOption = option;
            }
        });
        
        const today = dayjs()
        const deliverydate = today.add(deliveryOptions.deliveryDays, 'days');

        const dateString = deliverydate.format('dddd, MMMM D');
        
    console.log('i did')

    cartSummaryHTML += `
    <div class="cart-item-container js-cart-item-container-${matcheingProduct.id}">
            <div class="delivery-date">
            Delivery date: ${dateString}
        </div>

        <div class="cart-item-details-grid">
            <img class="product-image"
            src="${matcheingProduct.image}">

            <div class="cart-item-details">
            <div class="product-name">
                ${matcheingProduct.name}
            </div>
            <div class="product-price">
                $${formatCurrency(matcheingProduct.priceCents)}
            </div>
            <div class="product-quantity">
                <span>
                Quantity:<span class="quantity-label js-quantity-label-${matcheingProduct.id}">${item.quantity}</span>
                </span>
                <span class="update-quantity-link link-primary js-update-quantity" data-product-id="${matcheingProduct.id}">
                Update
                </span>
                <input type="number" class="quantity-input js-quantity-input-${matcheingProduct.id}">
                <span class="save-quantity-link link-primary js-save-link"
                data-product-id="${matcheingProduct.id}">
                Save
                </span>
                <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matcheingProduct.id}">
                Delete
                </span>
            </div>
            </div>

            <div class="delivery-options">
            <div class="delivery-options-title">
                Choose a delivery option:
            </div>
            ${deliveryOptionsHTML(matcheingProduct, item)}
            </div>
        </div>
        </div>

    `;
    
})

function deliveryOptionsHTML(matcheingProduct, item){

    let html = '';
    deliveryOptions.forEach((deliveryOptions) => {
    const today = dayjs();
    const deliveryDate = today.add(deliveryOptions.deliveryDays, 'Days');

    const dateString = deliveryDate.format('dddd, MMMM D');

    const priceString = deliveryOptions.priceCents === 0
    ? 'FREE'
    : `$${formatCurrency(deliveryOptions.priceCents)} `;

// to checked the free shipping item as defualt
    const isChecked = deliveryOptions.id === item.deliveryOptionsId;

        html += `<div class="delivery-option            js-delivery-option" data-product-id="${matcheingProduct.id}"
            data-delivery-option-id="${deliveryOptions.id}">
                <input type="radio"
                ${isChecked ? 'checked': ''}
                class="delivery-option-input"
                name="delivery-option-${matcheingProduct.id}">
                <div>
                <div class="delivery-option-date">
                ${dateString}
                </div>
                <div class="delivery-option-price">
                    ${priceString} - Shipping
                </div>
                </div>
            </div> `
    });
    return html;
}


document.querySelector('.js-order-summary').innerHTML= cartSummaryHTML;

document.querySelectorAll('.js-delete-link')
    .forEach((link) => {
        link.addEventListener('click', () => {
        const {productId} = link.dataset;
        removeFromcart(productId);
        
        const container = document.querySelector(`.js-cart-item-container-${productId}`);

            container.remove();

            updateCheckout();
        });
        
    }); 
    updateCheckout();


        // function updateCartQuantity() {
        // const cartQuantity = updateQuantity();
        // document.querySelector('.js-return-to-home-link')
        // .innerHTML = `${cartQuantity} items`;
        // }
        // updateCartQuantity();


        document.querySelectorAll('.js-update-quantity')
            .forEach((link) => {
                link.addEventListener('click', () => {
                    const productId = link.dataset.productId;

            const container = document.querySelector(
                `.js-cart-item-container-${productId}`
                );
            container.classList.add('is-editing-quantity');
                
                
                });  
            });
        
        document.querySelectorAll('.js-save-link')
            .forEach((link) => {
            link.addEventListener('click', () => {
            const productId = link.dataset.productId;

        const quantityInput = document.querySelector(
        `.js-quantity-input-${productId}`
            );
        const newQuantity = Number(quantityInput.value);

            if (newQuantity < 0 || newQuantity >= 1000) {
        alert('Quantity must be at least 0 and less than 1000');
        return;
        }
        updateQuantity(productId, newQuantity);

        const container = document.querySelector(
        `.js-cart-item-container-${productId}`
        );
        container.classList.remove('is-editing-quantity');

            const quantityLabel = document.querySelector(
            `.js-quantity-label-${productId}`
        );
        quantityLabel.innerHTML = newQuantity;
        });
        });

        document.querySelectorAll('.js-delivery-option')
            .forEach((element) => {
                element.addEventListener('click', () => {

                const {productId, deliveryOptionsId} = element.dataset;

                updateDeliveryOption(productId, deliveryOptionsId);

                renderOrderSummary();
                });
                
            });
            
        }
    renderOrderSummary();