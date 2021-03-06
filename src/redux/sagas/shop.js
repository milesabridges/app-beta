import {push} from 'connected-react-router'

import {
    call,
    put,
    takeLatest
}                  from 'redux-saga/effects'
import {
    getBraintreeClientToken,
    getPaymentMethod
}                  from 'services/apiBraintree'
import {
    getFilteredProducts,
    getProducts
}                  from 'services/apiProduct'
import {
    createOrder,
    processPayment
}                  from 'services/apiShop'
import {emptyCart} from 'utils/cartHelpers'

export function* getShop() {
    try {
        const payload = yield call(getProducts)
        if (!payload.error) {
            yield put({type: 'shop/getShopSuccess', payload})
        } else {
            yield put({type: 'shop/getShopFailure', payload})
        }
    } catch (error) {
        yield put({type: 'admin/getShopFailure', error})
    }
}

export function* getFilteredShop({payload}) {
    try {
        const filtered = yield call(getFilteredProducts, payload)
        if (!filtered.error) {
            yield put({type: 'shop/getShopSuccess', payload: filtered})
        } else {
            yield put({type: 'shop/getShopFailure', payload: filtered})
        }
    } catch (error) {
        yield put({type: 'admin/getShopFailure', error})
    }
}

export function* getBraintreeToken({payload}) {
    const braintreeClientToken = yield call(getBraintreeClientToken, payload)
    if (!braintreeClientToken.error) {
        yield put({type: 'shop/getBraintreeTokenSuccess', payload: braintreeClientToken})
    } else {
        yield put({type: 'shop/getBraintreeTokenFailure', payload: braintreeClientToken})
    }
}

export function* getPaymentNonce({payload}) {
    const {dropInInstance, _id, token, amount, products, deliveryAddress, user} = payload
    const {address, address2, city, state, zip, country, phone, email, company} = deliveryAddress
    const nonce = yield call(getPaymentMethod, dropInInstance)
    const paymentData = {paymentMethodNonce: nonce, amount: amount}
    const paymentProcessed = yield call(processPayment, {_id, token, paymentData})
    const isGuest = user?.email?.length < 1 || user?.name?.length < 1

    if (paymentProcessed.success === true) {
        const createOrderData = {
            products,
            transactionId: paymentProcessed.transaction.id,
            amount: paymentProcessed.transaction.amount,
            address,
            address2,
            city,
            state,
            zip,
            country,
            phone,
            email,
            user,
            company
        }
        const createdOrder = yield call(createOrder, {createOrderData})

        if (!createdOrder?.error) {
            //TODO: shippo integration

            // shippo.address.create({
            //     'name' : user.name ? user.name : 'Guest',
            //     'company' : country,
            //     'street1' : address,
            //     'street2': address2,
            //     'city' : city,
            //     'state' : state,
            //     'zip' : zip,
            //     'country' : country,
            //     'phone' : phone,
            //     'email' : email
            // }).then(function(address){
            //     console.log("shipment : %s", JSON.stringify(address));
            // })

            yield put({
                type: 'site/setNotification',
                payload: {
                    notification: `Purchase Successful! Confirmation Email sent to ${email}`,
                    theme: 'green',
                    delay: 15000
                }
            })
            yield call(emptyCart)
            yield put({type: 'shop/emptyCart'})

            console.log('isGuest', isGuest)

            if (!isGuest) {
                yield put({type: 'user/getPurchaseHistory', payload: {_id, token}})
                yield put(push('/dashboard/orders'))
            } else {
                yield put(push('/shop'))
            }
        }
    }
}

/**
 *
 *
 * SHOP WATCHERS
 *
 *
 */

export function* watchGetShop() {
    yield takeLatest('shop/getShop', getShop)
}

export function* watchGetFilteredShop() {
    yield takeLatest('shop/getFilteredShop', getFilteredShop)
}

export function* watchGetBraintreeToken() {
    yield takeLatest('shop/getBraintreeToken', getBraintreeToken)
}

export function* watchGetPaymentNonce() {
    yield takeLatest('shop/getPaymentNonce', getPaymentNonce)
}