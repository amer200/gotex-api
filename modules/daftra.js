const { default: axios } = require("axios");
const User = require("../model/user");

//#region client invoice
exports.createClientInvoice = async (clintId, staffId, notes, payment_method, payment_amount, quantity) => {
    const clientRes = await getClientById(clintId);
    if (clientRes.code != 200) {
        return errorHandler(clientRes.message, clientRes.code)
    }
    const client = clientRes.data.Client;
    const invoiceRes = await addClientInvoice(client, staffId, notes, payment_method, payment_amount, quantity)
    // console.log("****invoiceRes")
    // console.log(invoiceRes)
    return invoiceRes
}
const addClientInvoice = async (c, staffId, notes, payment_method, payment_amount, quantity) => {
    const data = JSON.stringify({
        "Invoice": {
            "staff_id": staffId,
            "subscription_id": null,
            "client_id": c.id,
            "is_offline": true,
            "currency_code": "SAR",
            "client_business_name": c.business_name,
            "client_first_name": c.first_name,
            "client_last_name": c.last_name,
            "client_email": c.email,
            "client_address1": c.address1,
            "client_address2": c.address2,
            "client_postal_code": c.postal_code,
            "client_city": c.city,
            "client_state": c.state,
            "client_country_code": c.country_code,
            "date": new Date(),
            "draft": "0",
            "discount": 0,
            "discount_amount": 0,
            "deposit": 0,
            "deposit_type": 0,
            "notes": notes,
            "html_notes": null,
            "invoice_layout_id": 1,
            "estimate_id": 0,
            "shipping_options": "",
            "shipping_amount": null,
            "client_active_secondary_address": false,
            "client_secondary_name": "string",
            "client_secondary_address1": "string",
            "client_secondary_address2": "string",
            "client_secondary_city": "string",
            "client_secondary_state": "string",
            "client_secondary_postal_code": "string",
            "client_secondary_country_code": "string",
            "follow_up_status": null,
            "work_order_id": null,
            "requisition_delivery_status": null,
            "pos_shift_id": null,
            "qr_code_url": "https://yoursite.daftra.com/qr/?d64=QVE1TmIyaGhiV1ZrSUVGemFISmhaZ0lJTVRFMU16WTJRMUlERkRJd01qSXRNVEF0TWpoVU1EQTZNREU2TVRWYUJBRXdCUUV3",
            "invoice_html_url": "https://yoursite.daftra.com/invoices/preview/2621?hash=c06543fe13bd4850b521733687c53259",
            "invoice_pdf_url": "https://yoursite.daftra.com/invoices/view/2621.pdf?hash=c06543fe13bd4850b521733687c53259"
        },
        "InvoiceItem": [
            {
                "invoice_id": "",
                "item": "string",
                "description": notes,
                "unit_price": 0,
                "quantity": quantity,
                "tax1": 0,
                "tax2": 0,
                "product_id": 0,
                "col_3": null,
                "col_4": null,
                "col_5": null,
                "discount": 0,
                "discount_type": "1 => Percentage",
                "store_id": 0
            }
        ],
        "Payment": [
            {
                "payment_method": payment_method,
                "amount": payment_amount,
                "transaction_id": null,
                "treasury_id": null,
                "staff_id": staffId
            }
        ],
        "InvoiceCustomField": {},
        "Deposit": {},
        "InvoiceReminder": {},
        "Document": {},
        "DocumentTitle": {}
    });
    const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `https://aljwadalmomez.daftra.com/api2/invoices`,
        headers: {
            'APIKEY': process.env.daftra_Key,
            'Content-Type': 'application/json'
        },
        data: data
    }
    const response = await axios(config)
    // console.log("****response")
    // console.log(response)
    return response.data
}

const getClientById = async (id) => {
    try {
        const config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://aljwadalmomez.daftra.com/api2/clients/${id}`,
            headers: {
                'APIKEY': process.env.daftra_Key
            }
        }
        const response = await axios(config);
        // console.log("****")
        // console.log(response.data)
        return response.data
    } catch (error) {
        return error.response.data
    }
}
//#endregion client invoice


//#region supplier (shipment company) invoice
exports.createSupplierInvoice = async (supplier_daftraid, notes, payment_amount, quantity) => {
    const response = await getSupplierById(supplier_daftraid);
    if (response.code != 200) {
        return errorHandler(response.message, response.code)
    }

    const supplier = response.data.Supplier;
    const invoiceRes = await addSupplierInvoice(supplier, notes, payment_amount, quantity)

    return invoiceRes
}
const addSupplierInvoice = async (supplier, notes, payment_amount, quantity) => {
    let date = new Date().toISOString().split('T')[0]

    const data = JSON.stringify({
        "PurchaseOrder": {
            "staff_id": 1,
            "supplier_id": supplier.id,
            "is_offline": true,
            "currency_code": "SAR",
            "supplier_business_name": supplier.business_name,
            "supplier_first_name": "",
            "supplier_last_name": "",
            "supplier_email": "",
            "supplier_address1": supplier.address1,
            "supplier_address2": "",
            "supplier_postal_code": "",
            "supplier_city": supplier.city,
            "supplier_state": supplier.state,
            "supplier_country_code": "SA",
            "date": date,
            "draft": true,
            "Supplier_active_secondary_address": true,
            "Supplier_secondary_country_code": "",
            "Supplier_secondary_name": "",
            "Supplier_secondary_address1": "",
            "Supplier_secondary_address2": "",
            "Supplier_secondary_city": "",
            "Supplier_secondary_state": "",
            "Supplier_secondary_postal_code": "",
            "is_received": true,
            "received_date": ""
        },
        "PurchaseOrderItem": [
            {
                "product_id": "",
                "item": "item",
                "org_name": "name",
                "description": notes,
                "unit_price": payment_amount,
                "quantity": quantity,
                "tax1": 0,
                "tax2": 0
            }
        ]
    });
    const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `https://aljwadalmomez.daftra.com/api2/purchase_invoices`,
        headers: {
            'APIKEY': process.env.daftra_Key,
            'Content-Type': 'application/json'
        },
        data: data
    }
    const response = await axios(config)
    return response.data
}

const getSupplierById = async (supplierId) => {
    try {
        const config = {
            method: 'get',
            url: `https://aljwadalmomez.daftra.com/api2/suppliers/${supplierId}`,
            headers: {
                'APIKEY': process.env.daftra_Key,
                'Content-Type': 'application/json'
            }
        }
        const response = await axios(config)
        return response.data
    } catch (error) {
        console.log(error)
        return error.response.data
    }
}
//#endregion region supplier (shipment company) invoice

//********************** */
const errorHandler = (data, status) => {
    let e = {
        msg: data,
        code: status
    }
    return e
}

// exports.createInv = async (clientId, notes, next) => {
//     try {
//         const clientId = req.body.clientId;
//         const notes = req.body.description;
//         const user = await User.findById(req.user.user.id);
//         const response = await getClientById(clientId);
//         let payment_method;
//         let payment_amount = res.locals.totalShipPrice;
//         if (req.body.cod) {
//             payment_method = "cod";
//         } else {
//             payment_method = "cc"
//         }
//         if (response.code != 200) {
//             return res.status(response.code).json({
//                 msg: response
//             })
//         }
//         const client = response.data.Client;
//         const inovic = await createClientInvoice(client, user.daftraid, notes, payment_method, payment_amount);
//         console.log(inovic)
//     } catch (error) {
//         console.log(error)
//     }
// }