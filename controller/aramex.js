const aramex = require('aramex-api');
const axios = require("axios");
exports.createOrder = async (req, res) => {
    try {
        clientInfo = new aramex.ClientInfo({
            UserName: process.env.AR_USERNAME,
            Password: process.env.AR_PASSWORD,
            Version: 'v2.0',
            AccountNumber: process.env.AR_ACCOUNT,
            AccountPin: process.env.AR_PIN,
            AccountEntity: 'JED',
            AccountCountryCode: 'SA'
        });

        aramex.Aramex.setClientInfo(clientInfo);

        aramex.Aramex.setConsignee(new aramex.Consignee());

        aramex.Aramex.setShipper(new aramex.Shipper());

        aramex.Aramex.setThirdParty(new aramex.ThirdParty());

        aramex.Aramex.setDetails(1);

        aramex.Aramex.setDimension();

        aramex.Aramex.setWeight();

        //Creating shipment

        let result = await aramex.Aramex.createShipment([
            {
                PackageType: 'Box',
                Quantity: 2,
                Weight: {
                    Value: 0.5,
                    Unit: 'Kg'
                },
                Comments: 'Docs',
                Reference: ''
            }
        ]);
        res.json({
            result: result
        })
    } catch (error) {
        console.log(error)
    }

}

// exports.createOrder = async (req, res) => {
//     const c_name = req.body.c_name;
//     const c_company = req.body.c_company;
//     const c_email = req.body.c_email;
//     const c_phone = req.body.c_phone;
//     const c_PhoneNumber1Ext = req.body.c_PhoneNumber1Ext;
//     const c_line1 = req.body.c_line1;
//     const c_line2 = req.body.c_line2;
//     const c_city = req.body.c_city;
//     const c_StateOrProvinceCode = req.body.c_StateOrProvinceCode;
//     const c_PostCode = req.body.c_PostCode;
//     const c_CellPhone = req.body.c_CellPhone;
//     /************************* */
//     const p_name = req.body.p_name;
//     const p_company = req.body.p_company;
//     const p_email = req.body.p_email;
//     const p_phone = req.body.p_phone;
//     const p_PhoneNumber1Ext = req.body.p_PhoneNumber1Ext;
//     const p_line1 = req.body.p_line1;
//     const p_city = req.body.p_city;
//     const p_CellPhone = req.body.p_CellPhone;
//     /***************************** */
//     let data = {
//         LabelInfo: {
//             ReportID: 1,
//             ReportType: "URL"
//         }
//     };
//     let config = {
//         method: 'POST',
//         // maxBodyLength: Infinity,
//         url: 'https://ws.dev.aramex.net/shippingapi.v1/shipping/service_1_0.svc/json',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         data: data
//     };
//     axios.request(config)
//         .then((response) => {
//             console.log(JSON.stringify(response.status));
//         })
//         .catch((error) => {
//             console.log(error);
//         });
//     // clientInfo = new aramex.ClientInfo();

//     // aramex.Aramex.setClientInfo(clientInfo);

//     // aramex.Aramex.setConsignee(new aramex.Consignee({
//     //     PersonName: c_name,
//     //     CompanyName: c_company,
//     //     EmailAddress: c_email,
//     //     PhoneNumber1: c_phone,
//     //     PhoneNumber1Ext: c_PhoneNumber1Ext,
//     //     Line1: c_line1,
//     //     Line2: c_line2,
//     //     City: c_city,
//     //     StateOrProvinceCode: c_StateOrProvinceCode,
//     //     PostCode: c_PostCode,
//     //     CellPhone: c_CellPhone,
//     //     CountryCode: 'SA'
//     // }));

//     // aramex.Aramex.setShipper(new aramex.Shipper({
//     //     PersonName: p_name,
//     //     CompanyName: p_company,
//     //     EmailAddress: p_email,
//     //     PhoneNumber1: p_phone,
//     //     PhoneNumber1Ext: p_PhoneNumber1Ext,
//     //     CellPhone: p_CellPhone,
//     //     Line1: p_line1,
//     //     CountryCode: 'SA',
//     //     City: p_city
//     // }));

//     // aramex.Aramex.setThirdParty(new aramex.ThirdParty());

//     // aramex.Aramex.setDetails(1);

//     // aramex.Aramex.setDimension();

//     // aramex.Aramex.setWeight();

//     // //Creating shipment

//     // let result = await aramex.Aramex.createShipment([{ PackageType: 'Box', Quantity: 2, Weight: { Value: 0.5, Unit: 'Kg' }, Comments: 'Docs', Reference: '' }]);
//     // console.log(result)
//     //tracking shipment let result = await aramex.Aramex.track(['3915342793', '3915342826']);
// }