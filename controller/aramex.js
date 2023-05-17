const aramex = require('aramex-api');
const axios = require("axios");

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
    /************************* */
    const p_name = req.body.p_name;
    const p_company = req.body.p_company;
    const p_email = req.body.p_email;
    const p_phone = req.body.p_phone;
    const p_PhoneNumber1Ext = req.body.p_PhoneNumber1Ext;
    const p_line1 = req.body.p_line1;
    const p_city = req.body.p_city;
    const p_CellPhone = req.body.p_CellPhone;
    /***************************** */
    let data = JSON.stringify({
        "LabelInfo": {
            "ReportID": 1,
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
                    "AccountNumber": "test",
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
                        "Line2": c_line2,
                        "Line3": "",
                        "City": c_city,
                        "StateOrProvinceCode": c_StateOrProvinceCode,
                        "PostCode": c_PostCode,
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
                "ThirdParty": {
                    "Reference1": "",
                    "Reference2": "",
                    "AccountNumber": "",
                    "PartyAddress": {
                        "Line1": "",
                        "Line2": "",
                        "Line3": "",
                        "City": "",
                        "StateOrProvinceCode": "",
                        "PostCode": "",
                        "CountryCode": "",
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
                        "PersonName": "",
                        "Title": "",
                        "CompanyName": "",
                        "PhoneNumber1": "",
                        "PhoneNumber1Ext": "",
                        "PhoneNumber2": "",
                        "PhoneNumber2Ext": "",
                        "FaxNumber": "",
                        "CellPhone": "",
                        "EmailAddress": "",
                        "Type": ""
                    }
                },
                "ShippingDateTime": `/Date(${new Date().setDate(0)})/`,
                "DueDate": `/Date(${new Date().setDate(1)})/`,
                "Comments": "",
                "PickupLocation": "",
                "OperationsInstructions": "",
                "AccountingInstrcutions": "",
                "Details": {
                    "Dimensions": null,
                    "ActualWeight": {
                        "Unit": "KG",
                        "Value": 2
                    },
                    "ChargeableWeight": null,
                    "DescriptionOfGoods": "Books",
                    "GoodsOriginCountry": "IN",
                    "NumberOfPieces": 1,
                    "ProductGroup": "EXP",
                    "ProductType": "PPX",
                    "PaymentType": "P",
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
                                "CurrencyCode": "SAR",
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
                            "Value": "1098494352"
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
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://ws.dev.aramex.net/shippingapi.v1/shipping/service_1_0.svc/json',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };
    axios.request(config)
        .then((response) => {
            console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
            console.log(error.cause);
        });
    // clientInfo = new aramex.ClientInfo();

    // aramex.Aramex.setClientInfo(clientInfo);

    // aramex.Aramex.setConsignee(new aramex.Consignee({
    //     PersonName: c_name,
    //     CompanyName: c_company,
    //     EmailAddress: c_email,
    //     PhoneNumber1: c_phone,
    //     PhoneNumber1Ext: c_PhoneNumber1Ext,
    //     Line1: c_line1,
    //     Line2: c_line2,
    //     City: c_city,
    //     StateOrProvinceCode: c_StateOrProvinceCode,
    //     PostCode: c_PostCode,
    //     CellPhone: c_CellPhone,
    //     CountryCode: 'SA'
    // }));

    // aramex.Aramex.setShipper(new aramex.Shipper({
    //     PersonName: p_name,
    //     CompanyName: p_company,
    //     EmailAddress: p_email,
    //     PhoneNumber1: p_phone,
    //     PhoneNumber1Ext: p_PhoneNumber1Ext,
    //     CellPhone: p_CellPhone,
    //     Line1: p_line1,
    //     CountryCode: 'SA',
    //     City: p_city
    // }));

    // aramex.Aramex.setThirdParty(new aramex.ThirdParty());

    // aramex.Aramex.setDetails(1);

    // aramex.Aramex.setDimension();

    // aramex.Aramex.setWeight();

    // //Creating shipment

    // let result = await aramex.Aramex.createShipment([{ PackageType: 'Box', Quantity: 2, Weight: { Value: 0.5, Unit: 'Kg' }, Comments: 'Docs', Reference: '' }]);
    // console.log(result)
    //tracking shipment let result = await aramex.Aramex.track(['3915342793', '3915342826']);
}