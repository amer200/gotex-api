const aramex = require('aramex-api');
const axios = require("axios");
// exports.createOrder = async (req, res) => {
//     try {
//         clientInfo = new aramex.ClientInfo({
//             // UserName: process.env.AR_USERNAME,
//             // Password: process.env.AR_PASSWORD,
//             // Version: 'v2.0',
//             // AccountNumber: process.env.AR_ACCOUNT,
//             // AccountPin: process.env.AR_PIN,
//             // AccountEntity: 'JED',
//             // AccountCountryCode: 'SA'
//         });

//         aramex.Aramex.setClientInfo(clientInfo);

//         aramex.Aramex.setConsignee(new aramex.Consignee());

//         aramex.Aramex.setShipper(new aramex.Shipper());

//         aramex.Aramex.setThirdParty(new aramex.ThirdParty());

//         aramex.Aramex.setDetails(1);

//         aramex.Aramex.setDimension();

//         aramex.Aramex.setWeight();

//         //Creating shipment

//         let result = await aramex.Aramex.createShipment([
//             {
//                 PackageType: 'Box',
//                 Quantity: 2,
//                 Weight: {
//                     Value: 0.5,
//                     Unit: 'Kg'
//                 },
//                 Comments: 'Docs',
//                 Reference: ''
//             }
//         ]);
//         res.json({
//             result: result
//         })
//     } catch (error) {
//         console.log(error)
//     }

// }

exports.createOrder = async (req, res) => {
    const c_name = req.body.c_name;
    const c_company = req.body.c_company;
    const c_email = req.body.c_email;
    const c_phone = req.body.c_phone;
    const c_PhoneNumber1Ext = req.body.c_PhoneNumber1Ext;
    const c_line1 = req.body.c_line1;
    const c_line2 = req.body.c_line2;
    const c_city = req.body.c_city;
    const c_StateOrProvinceCode = req.body.c_StateOrProvinceCode;
    const c_PostCode = req.body.c_PostCode;
    const c_CellPhone = req.body.c_CellPhone;
    //     /************************* */
    const p_name = req.body.p_name;
    const p_company = req.body.p_company;
    const p_email = req.body.p_email;
    const p_phone = req.body.p_phone;
    const p_PhoneNumber1Ext = req.body.p_PhoneNumber1Ext;
    const p_line1 = req.body.p_line1;
    const p_city = req.body.p_city;
    const p_CellPhone = req.body.p_CellPhone;
    //     /***************************** */
    const weight = req.body.weight;
    const desc = req.body.description;
    /*************************************** */
    const shipmentDate = Date.now();
    var data = JSON.stringify({
        "ClientInfo": {
            "UserName": "test.api@aramex.com",
            "Password": "Aramex@12345",
            "Version": "v1.0",
            "AccountNumber": "60531487",
            "AccountPin": "654654",
            "AccountEntity": "BOM",
            "AccountCountryCode": "IN",
            "Source": 24
        },
        "LabelInfo": {
            "ReportID": 9729,
            "ReportType": "URL"
        },
        "Shipments": [
            {
                "Reference1": "",
                "Reference2": "",
                "Reference3": "",
                "Shipper": {
                    "Reference1": "",
                    "Reference2": "",
                    "AccountNumber": "60531487",
                    "PartyAddress": {
                        "Line1": p_line1,
                        "Line2": "",
                        "Line3": "",
                        "City": p_city,
                        "StateOrProvinceCode": "",
                        "PostCode": "",
                        "CountryCode": "SA",
                        "Longitude": 0,
                        "Latitude": 0,
                        "BuildingNumber": null,
                        "BuildingName": null,
                        "Floor": null,
                        "Apartment": null,
                        "POBox": null,
                        "Description": null
                    },
                    "Contact": {
                        "Department": "",
                        "PersonName": p_name,
                        "Title": "",
                        "CompanyName": p_company,
                        "PhoneNumber1": p_phone,
                        "PhoneNumber1Ext": p_PhoneNumber1Ext,
                        "PhoneNumber2": "",
                        "PhoneNumber2Ext": "",
                        "FaxNumber": "",
                        "CellPhone": p_CellPhone,
                        "EmailAddress": p_email,
                        "Type": ""
                    }
                },
                "Consignee": {
                    "Reference1": "",
                    "Reference2": "",
                    "AccountNumber": "",
                    "PartyAddress": {
                        "Line1": c_line1,
                        "Line2": "",
                        "Line3": "",
                        "City": c_city,
                        "StateOrProvinceCode": "",
                        "PostCode": "",
                        "CountryCode": "SA",
                        "Longitude": 0,
                        "Latitude": 0,
                        "BuildingNumber": "",
                        "BuildingName": "",
                        "Floor": "",
                        "Apartment": "",
                        "POBox": null,
                        "Description": ""
                    },
                    "Contact": {
                        "Department": "",
                        "PersonName": c_name,
                        "Title": "",
                        "CompanyName": c_company,
                        "PhoneNumber1": c_phone,
                        "PhoneNumber1Ext": c_PhoneNumber1Ext,
                        "PhoneNumber2": "",
                        "PhoneNumber2Ext": "",
                        "FaxNumber": "",
                        "CellPhone": c_CellPhone,
                        "EmailAddress": c_email,
                        "Type": ""
                    }
                },
                "ShippingDateTime": `/Date(${shipmentDate}+0530)/`,
                "Comments": "",
                "PickupLocation": "",
                "OperationsInstructions": "",
                "AccountingInstrcutions": "",
                "Details": {
                    "Dimensions": null,
                    "ActualWeight": {
                        "Unit": "KG",
                        "Value": weight
                    },
                    "ChargeableWeight": null,
                    "DescriptionOfGoods": desc,
                    "GoodsOriginCountry": "SA",
                    "NumberOfPieces": pieces,
                    "ProductGroup": "EXP",
                    "ProductType": "PPX",
                    "PaymentType": "COD",
                    "PaymentOptions": "",
                    "CustomsValueAmount": {
                        "CurrencyCode": "SAR",
                        "Value": 200
                    },
                    "CashOnDeliveryAmount": null,
                    "InsuranceAmount": null,
                    "CashAdditionalAmount": null,
                    "CashAdditionalAmountDescription": "",
                    "CollectAmount": null,
                    "Services": "",
                    "Items": [
                        {
                            "PackageType": "Box",
                            "Quantity": "1",
                            "Weight": null,
                            "CustomsValue": {
                                "CurrencyCode": "USD",
                                "Value": 10
                            },
                            "Comments": "Ravishing Gold Facial Kit Long Lasting Shining Appearance For All Skin Type 125g",
                            "GoodsDescription": "new Gold Facial Kit Long  Shining Appearance",
                            "Reference": "",
                            "CommodityCode": "98765432"
                        }
                    ],
                    "AdditionalProperties": [
                        {
                            "CategoryName": "CustomsClearance",
                            "Name": "ShipperTaxIdVATEINNumber",
                            "Value": "123456789101"
                        },
                        {
                            "CategoryName": "CustomsClearance",
                            "Name": "ConsigneeTaxIdVATEINNumber",
                            "Value": "987654321012"
                        },
                        {
                            "CategoryName": "CustomsClearance",
                            "Name": "TaxPaid",
                            "Value": "1"
                        },
                        {
                            "CategoryName": "CustomsClearance",
                            "Name": "InvoiceDate",
                            "Value": "08/17/2020"
                        },
                        {
                            "CategoryName": "CustomsClearance",
                            "Name": "InvoiceNumber",
                            "Value": "Inv123456"
                        },
                        {
                            "CategoryName": "CustomsClearance",
                            "Name": "TaxAmount",
                            "Value": "120.52"
                        },
                        {
                            "CategoryName": "CustomsClearance",
                            "Name": "IOSS",
                            "Value": "IM1098494352"
                        },
                        {
                            "CategoryName": "CustomsClearance",
                            "Name": "ExporterType",
                            "Value": "UT"
                        }
                    ]
                },
                "Attachments": [],
                "ForeignHAWB": "",
                "TransportType ": 0,
                "PickupGUID": "",
                "Number": null,
                "ScheduledDelivery": null
            }
        ],
        "Transaction": {
            "Reference1": "",
            "Reference2": "",
            "Reference3": "",
            "Reference4": "",
            "Reference5": ""
        }
    });

    var config = {
        method: 'post',
        url: 'https://ws.aramex.net/ShippingAPI.V2/Shipping/Service_1_0.svc/json/CreateShipments',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };

    axios(config)
        .then(function (response) {
            res.status(200).json({
                data: response.data
            });
        })
        .catch(function (error) {
            console.log(error);
        });

}