exports.addClint = async (req, res) => {
    const name = req.body.name;
    const business_name = req.body.business_name;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const email = req.body.email;
    const address1 = req.body.address1;
    const city = req.body.city;
    const state = req.body.state;
    const phone1 = req.body.phone1;
    const notes = req.body.notes;
    const active_secondary_address = false;
    const default_currency_code = "SAR";
    const follow_up_status = null;
    const category = "gotex";
}