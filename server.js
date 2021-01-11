const express = require('express');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const app = express();
const port = 3000;
const router = express.Router();
const axios = require('axios');
const secretkey = 'test-secret-key-213b30fdba6c4535ae30b4e0702f242b';
const checkoutkey = 'test-checkout-key-0c2411afe17a457680e4568f317c9654';
const fetch = require('node-fetch');

/* Set up Express to serve HTML files using "res.render" with help of Nunjucks */
app.set('view engine', 'html');
app.set("views", "views");
app.engine('html', nunjucks.render);
nunjucks.configure('views', { noCache: true });

// app.use(express.static(pathToSwaggerUi));
app.use('/web', express.static('views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', router);

/* Place all routes here */
router.get('/', (req, res) => {

});

router.post('/api/payment/order', async (req, res) => {
    let bodyObj = {
        "order": {
            "items": [{
                "reference": "13",
                "name": "testproduct 1",
                "quantity": 2,
                "unit": "pcs",
                "unitPrice": 48648,
                "taxRate": 2500,
                "taxAmount": 24324,
                "grossTotalAmount": 121620,
                "netTotalAmount": 97296
            },
            {
                "reference": "21",
                "name": "testproduct 2",
                "quantity": 2,
                "unit": "kg",
                "unitPrice": 111840,
                "taxRate": 2500,
                "taxAmount": 55920,
                "grossTotalAmount": 279600,
                "netTotalAmount": 223680
            }
            ],
            "amount": 401220,
            "currency": "SEK",
            "reference": "Demo Order"
        },
        "merchantNumber": 100020474,
        "checkout": {
            "integrationType": "EmbeddedCheckout",
            "url": "https://test.checkout.dibspayment.eu/v1/checkout.js?v=1",
            "termsUrl": "https://www.mydomain.com/toc",
            "appearance": {
                "displayOptions": {
                    "showMerchantName": false,
                    "showOrderSummary": false
                },
                "textOptions": {
                    "completePaymentButtonText": "order"
                },
            },
            "shipping": {
                "countries": [
                    {
                        "countryCode": "SWE"
                    }
                ],
                "merchantHandlesShippingCost": false
            },
            "merchantHandlesConsumerData": true,
            "consumer": {
                "email": "john.doe@doemail.com",
                "shippingAddress": {
                    "postalCode": "0956",
                }
            },
            "consumerType": {
                "supportedTypes": ["B2C", "B2B"],
                "default": "B2C"
            }
        },

        //  You can extend the datastring with optional webhook-parameters for status such as "payment.created". Click for more info
        "notifications": {
            "webhooks": [{
                "eventName": "payment.created",
                //  "url": "string",
                "authorization": "00000000000000000000000000000000"
            }
            ]
        },//This enables the merchant to charge an invoice fee towards the customer when invoice is used as paymentmethod
        "paymentMethods": [
            {
                "name": "easyinvoice",
                "fee": {
                    "reference": "invFee",
                    "name": "fee",
                    "quantity": 1,
                    "unit": "ct",
                    "unitPrice": 1000,
                    "taxRate": 2500,
                    "taxAmount": 250,
                    "grossTotalAmount": 1250,
                    "netTotalAmount": 1000
                }
            }
        ]
    }


    // // Use merchantNumber if you're a partner and initiating the checkout with your partner keys
    // "secretkey": 'test-secret-key-213b30fdba6c4535ae30b4e0702f242b',
    // "checkoutkey": 'test-checkout-key-0c2411afe17a457680e4568f317c9654',
    // "merchantNumber": 100020474,

    fetch('https://test.api.dibspayment.eu/v1/payments/', {
        method: 'post',
        body: bodyObj,
        headers: { 'Content-Type': 'application/json', Authorization: secretkey, },
    })
        .then(res => res.json())
        .then(json => console.log("data : ", json));

    res.status(200).json({
        success: true,
    });
});



/* Start listening on specified port */
app.listen(port, () => {
    console.info('Server is listening on port', port)
});