const Client = require("../../model/clint");
const Markter = require("../../model/marketer");
const User = require("../../model/user");
const Imile = require("../../model/imile");
const axios = require("axios");
const { addImileClient, editImileClient } = require("./imileClients");
const paginate = require("../../modules/paginate");

exports.addClient = async (req, res) => {
  const userId = req.user.user.id;
  const {
    company,
    first_name,
    city,
    state = "",
    address,
    mobile,
    notes = "",
    category = "",
    birth_date,
    street,
    branches,
  } = req.body;

  try {
    const name = first_name.trim();
    let staff_id = 0;

    if (!first_name || !city || !address || !mobile || !street) {
      return res.status(400).json({
        msg: "These info are required:  first_name, city, address, mobile and street",
      });
    }
    const user = await User.findById(userId);
    if (user.daftraid) {
      staff_id = user.daftraid;
    }

    const usedMobile = await Client.findOne({ mobile });
    if (usedMobile) {
      return res
        .status(400)
        .json({ msg: "This client mobile is already used." });
    }

    const imileResult = await addImileClient(
      company,
      name,
      city,
      address,
      mobile,
      notes
    );
    if (imileResult != 1) {
      return res.status(400).json({
        msg: "error with imile",
        err: imileResult,
      });
    }
    const myClient = new Client({
      name,
      company,
      mobile,
      city,
      address,
      notes,
      street,
      category,
      addby: userId,
      orders: [],
      branches,
    });
    await myClient.save();
    return res.status(200).json({
      data: myClient,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.editClient = async (req, res) => {
  const clientId = req.params.id;
  const userId = req.user.user.id;
  const {
    company,
    first_name,
    city,
    state = "",
    address,
    mobile,
    notes = "",
    category = "",
    birth_date,
    street,
    branches,
  } = req.body;

  try {
    const name = first_name.trim();
    if (!first_name || !city || !address || !mobile || !street) {
      return res.status(400).json({
        msg: "These info are required:  first_name, city, address, mobile and street",
      });
    }
    let rolle = "";
    // userId=1 if admin
    if (userId == 1) {
      staff_id = 1;
      rolle = "admin";
    } else {
      user = await User.findById(userId);
      if (!user) {
        return res.status(400).json({ msg: `No user for this id ${userId}` });
      }
      console.log(user.rolle);
      rolle = user.rolle;
      staff_id = user.daftraid;
    }

    const populateObj = {
      path: "addby",
      select: "email rolle",
    };

    const client = await Client.findOne({ _id: clientId }).populate(
      populateObj
    );
    if (!client) {
      return res.status(400).json({ msg: `No client for this id ${clientId}` });
    }
    // to prevent user from editing marketer clients and vice versa, but admin can edit any client.
    if (rolle != "admin" && rolle != client.addby.rolle) {
      return res.status(400).json({ msg: `Can't edit this client` });
    }

    const usedMobile = await Client.findOne({ mobile });
    if (usedMobile && usedMobile.mobile !== client.mobile) {
      return res
        .status(400)
        .json({ msg: "This client mobile is already used." });
    }

    const editImileClientParams = {
      company,
      name,
      city,
      address,
      mobile,
      notes,
    };
    const imileResult = await editImileClient(editImileClientParams);
    if (imileResult != 1) {
      return res
        .status(400)
        .json({ msg: "error with imile", err: imileResult });
    }

    const updatedClient = await Client.findOneAndUpdate(
      { _id: clientId },
      {
        name,
        company,
        city,
        address,
        street,
        mobile,
        notes,
        category,
        branches,
      },
      { new: true }
    );

    res.status(200).json({ data: updatedClient });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
    });
  }
};

// exports.removeClient = async (req, res) => {
//     const clientId = req.params.id

//     try {
//         const client = await Client.findOne({ _id: clientId })
//         if (!client) {
//             return res.status(400).json({ msg: `No client for this id ${clientId}` })
//         }

//         const { company, name, city, address, mobile, notes } = client

//         const editImileClientParams = {
//             company: `${client.company} - removed`,
//             name,
//             city,
//             address,
//             mobile,
//             notes
//         }
//         const imileResult = await editImileClient(editImileClientParams);
//         if (imileResult != 1) {
//             return res.status(400).json({ msg: "error with imile", err: imileResult })
//         }

//         await Client.findByIdAndDelete(clientId)

//         res.status(200).json({ msg: "Client removed successfully" })
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             error: error.message
//         })
//     }
// }

/** Get marketer clients*/
exports.getAllClients = async (req, res) => {
  const user = req.user.user;

  try {
    let clients = [];
    if (user.rolle == "admin") {
      clients = await Client.find({}).sort({ name: 1 });
    } else if (user.rolle == "marketer") {
      const populateObj = {
        path: "addby",
        match: {
          $or: [{ rolle: { $regex: "marketer", $options: "i" } }],
        },
        select: "email rolle",
      };

      clients = await Client.find({}).populate(populateObj).sort({ name: 1 });
      clients = clients.filter((clients) => clients.addby);
    } else if (user.rolle == "user") {
      clients = await Client.find({ addby: user.id }).sort({ name: 1 });
    }

    return res.status(200).json({ result: clients.length, data: clients });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
    });
  }
};
/** Get marketer clients + pagination */
exports.allClients = async (req, res) => {
  /** Pagination -> default: page=1, limit=30 (max number of items (orders) per page)*/
  let page = +req.query.page || 1;
  const limit = +req.query.limit || 30;
  const { name = "", mobile = "", company = "", city = "" } = req.query;
  const user = req.user.user;

  try {
    let clients = [];
    if (user.rolle == "admin") {
      clients = await Client.find({
        name: { $regex: name, $options: "i" },
        mobile: { $regex: mobile },
        company: { $regex: company, $options: "i" },
        city: { $regex: city, $options: "i" },
      }).sort({ name: 1 });
    } else if (user.rolle == "marketer") {
      const populateObj = {
        path: "addby",
        match: {
          $or: [{ rolle: { $regex: "marketer", $options: "i" } }],
        },
        select: "email rolle",
      };

      clients = await Client.find({
        name: { $regex: name, $options: "i" },
        mobile: { $regex: mobile },
        company: { $regex: company, $options: "i" },
        city: { $regex: city, $options: "i" },
      })
        .populate(populateObj)
        .sort({ name: 1 });

      clients = clients.filter((clients) => clients.addby);
    } else if (user.rolle == "user") {
      clients = await Client.find({
        addby: user.id,
        name: { $regex: name, $options: "i" },
        mobile: { $regex: mobile },
        company: { $regex: company, $options: "i" },
        city: { $regex: city, $options: "i" },
      }).sort({ name: 1 });
    }

    const clientsPagination = paginate(clients, page, limit);
    return res.status(200).json({ ...clientsPagination });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
    });
  }
};

// By Admin
exports.AddClientToMarkter = async (req, res) => {
  const clientId = req.body.clientId;
  const marketerCode = req.body.marketerCode;
  const client = await Client.findById(clientId);
  const marketer = await Markter.findOne({ code: marketerCode });
  try {
    if (!marketer) {
      return res.status(400).json({
        msg: "markter code not found",
      });
    }
    client.marktercode = marketerCode;
    await client.save();
    return res.status(200).json({
      msg: "ok",
      data: client,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error,
    });
  }
};
exports.getClientsWithCredit = async (req, res) => {
  try {
    const clients = await Client.find({ credit: { $exists: true } }).sort({
      updatedAt: -1,
    });

    res.status(200).json({ clients });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error,
    });
  }
};

exports.registerClient = async (req, res) => {
  const marketerCode = req.params.marketerCode;
  let {
    company,
    name,
    city,
    state = "",
    address,
    mobile,
    notes = "",
    category = "",
    birth_date,
    street,
    branches,
  } = req.body;

  try {
    const marketer = await Markter.findOne({ code: marketerCode });
    if (!marketer) {
      return res.status(400).json({
        msg: "marketer code not found",
      });
    }

    name = name.trim();
    let staff_id = 0;

    if (!name || !city || !address || !mobile || !street) {
      return res.status(400).json({
        msg: "These info are required:  name, city, address, mobile and street",
      });
    }

    const usedMobile = await Client.findOne({ mobile });
    console.log(mobile);
    console.log(usedMobile);
    if (usedMobile) {
      return res
        .status(400)
        .json({ msg: "This client mobile is already used." });
    }

    const imileResult = await addImileClient(
      company,
      name,
      city,
      address,
      mobile,
      notes
    );
    if (imileResult != 1) {
      return res.status(400).json({
        msg: "error with imile",
        err: imileResult,
      });
    }
    const myClient = await Client.create({
      name,
      company,
      mobile,
      city,
      address,
      notes,
      street,
      category,
      addby: marketer._id,
      orders: [],
      branches,
      marktercode: marketerCode,
    });

    return res.status(200).json({
      msg: "ok",
      data: myClient,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
    });
  }
};
