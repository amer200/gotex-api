const User = require("../model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const salt = 10;
const paymentOrder = require("../model/payment/orders");
const axios = require("axios");
const Client = require("../model/clint");
const sendEmail = require("../modules/sendEmail");
const genRandomString = require("../modules/genRandomString");
const mailSubject = "Verify your gotex account";

exports.signUp = (req, res) => {
  const { name, password, email, mobile, address, location, gotex } = req.body;
  console.log(req.body);
  console.log(req.files);

  var cr = [];
  if (req.files) {
    req.files.forEach((f) => {
      cr.push(f.path);
    });
  }
  const hash = bcrypt.hashSync(password, salt);
  User.findOne({ email: email })
    .then((u) => {
      if (u) {
        res.status(409).json({
          msg: "error this email is already used",
        });
      } else {
        const user = new User({
          name: name,
          password: hash,
          email: email,
          mobile: mobile,
          address: address,
          location: location,
          verified: false,
          emailcode: genRandomString(4),
          rolle: "user",
          cr: cr,
        });
        user.save().then((u) => {

          if (gotex) {
            sendEmail(
              u.email,
              u.emailcode,
              u._id,
              "/../views/emailTemp.ejs",
              mailSubject,
              gotex
            );
          }
          else {
            sendEmail(
              u.email,
              u.emailcode,
              u._id,
              "/../views/emailTempTest.ejs",
              "Verify your Tup Trupo account",
              gotex
            );
          }
          res.status(200).json({
            msg: "ok",
            user: u,
          });
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        msg: err.message,
      });
    });
};
exports.MarkterSignUp = (req, res) => {
  const { name, password, email, mobile, address, location, code } = req.body;
  const hash = bcrypt.hashSync(password, salt);
  User.findOne({ email: email })
    .then((u) => {
      if (u) {
        res.status(409).json({
          msg: "error this email is already used",
        });
      } else {
        const user = new User({
          name: name,
          password: hash,
          email: email,
          mobile: mobile,
          address: address,
          location: location,
          verified: false,
          emailcode: genRandomString(6),
          rolle: "marketer",
        });
        user.save().then((u) => {
          sendEmail(
            u.email,
            u.emailcode,
            u._id,
            "/../views/emailTemp.ejs",
            mailSubject
          );
          res.status(200).json({
            msg: "ok",
            user: u,
          });
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        msg: err.message,
      });
    });
};
exports.activateUser = (req, res) => {
  const code = req.params.code;
  const id = req.params.id;
  User.findById(id)
    .then((u) => {
      if (!u) {
        return res.status(404).json({
          msg: "User not found",
        });
      }
      if (u.emailcode == code) {
        u.verified = true;
        u.save().then((u) => {
          return res.status(200).redirect("https://gotex.vercel.app/");
        });
      } else {
        return res.status(404).json({
          msg: "not found",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        msg: err.message,
      });
    });
};
exports.logIn = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((u) => {
      if (u) {
        if (bcrypt.compareSync(password, u.password)) {
          const user = {
            id: u._id,
            name: u.name,
            rolle: u.rolle,
            iscrproofed: u.iscrproofed,
          };
          console.log(user);
          const token = jwt.sign(
            {
              exp: Math.floor(Date.now() / 1000) + 60 * 60,
              data: { user: user },
            },
            process.env.ACCESS_TOKEN
          );
          res.status(200).json({
            msg: "ok",
            token: token,
          });
        } else {
          res.status(401).json({
            msg: "wrong password or email",
          });
        }
      } else {
        res.status(401).json({
          msg: "wrong password or email",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        msg: "server error",
        error: err.message,
      });
    });
};
exports.reSendActivateCode = (req, res) => {
  const userId = req.user.user.id;
  User.findById(userId)
    .then((u) => {
      u.emailcode = genRandomString(6);
      return u.save();
    })
    .then((u) => {
      sendEmail(
        u.email,
        u.emailcode,
        u._id,
        "/../views/emailTemp.ejs",
        mailSubject
      );
      res.status(200).json({
        msg: "email send",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        msg: "server error",
        error: err.message,
      });
    });
};
exports.getUserBalance = (req, res) => {
  const id = req.user.user.id;
  User.findById(id)
    .then((u) => {
      res.status(200).json({
        data: u.wallet,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        msg: err,
      });
    });
};
exports.createNewPassword = async (req, res) => {
  try {
    const email = req.body.email;
    const gotex = req.body.gotex;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        msg: "user email not found",
      });
    }
    user.emailcode = genRandomString(6);
    console.log(user.emailcode);
    await user.save();
    if (gotex) {
      sendEmail(
        user.email,
        user.emailcode,
        user._id,
        "/../views/password_mail.ejs",
        mailSubject,
        gotex
      );
    }
    else {
      sendEmail(
        user.email,
        user.emailcode,
        user._id,
        "/../views/password_mailTest.ejs",
        "Verify your Tup Trupo account",
        gotex
      );
    }
    return res.status(200).json({
      msg: "the email has been sent",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};
exports.updatePassword = async (req, res) => {
  try {
    const password = req.body.password;
    const hash = bcrypt.hashSync(password, salt);
    const code = req.body.code;
    const user = await User.findOne({ emailcode: code });
    if (!user) {
      return res.status(401).json({
        msg: "wrong code",
      });
    }
    user.password = hash;
    user.emailcode = "0000";
    await user.save();
    res.status(200).json({
      msg: "ok",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};
exports.addBalance = async (req, res) => {
  const amount = req.body.amount;
  const uId = req.user.user.id;
  const code = genRandomString(10);
  try {
    let data = JSON.stringify({
      method: "create",
      store: process.env.TELR_STORE_ID,
      authkey: process.env.TELR_AUTH_KEY,
      framed: 0,
      order: {
        cartid: `g-${Date.now()}`,
        test: "1",
        amount: amount,
        currency: "SAR",
        description: "test payment",
      },
      return: {
        authorised: `https://dashboard.go-tex.net/api/user/checkpayment/authorised/${uId}/${code}`,
        declined: `https://dashboard.go-tex.net/api/user/checkpayment/declined/${uId}/${code}`,
        cancelled: `https://dashboard.go-tex.net/api/user/checkpayment/cancelled/${uId}/${code}`,
      },
    });
    let config = {
      method: "post",
      url: "https://secure.telr.com/gateway/order.json",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };
    const telrRes = await axios(config);
    const nPaymentOrder = new paymentOrder({
      user: uId,
      data: telrRes.data,
      amount: amount,
      code: code,
      status: "pinding",
    });
    await nPaymentOrder.save();
    res.status(200).json({
      data: telrRes.data,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};
exports.checkPaymentOrder = async (req, res) => {
  const uId = req.params.uId;
  const code = req.params.code;
  const status = req.params.status;
  const order = await paymentOrder.findOne({ code: code });
  const user = await User.findById(uId);
  try {
    if (!order) {
      return res.render("payment-result", {
        myText: "failed Your wallet  is =",
        balance: user.wallet,
      });
      res.status(400).json({
        data: "failed",
      });
    }
    if (status != "authorised") {
      order.status = status;
      await order.save();
      return res.render("payment-result", {
        myText: `${status}, Your wallet is =`,
        balance: user.wallet,
      });
      return res.status(400).json({
        data: status,
      });
    }
    if (status == "authorised") {
      user.wallet = user.wallet + order.amount;
    }
    order.status = status;
    order.code = genRandomString(10);
    await user.save();
    await order.save();
    var data = {
      amount: order.amount,
      userBalance: user.wallet,
    };
    return res.render("payment-result", {
      myText: `${status}, Your wallet is =`,
      balance: user.wallet,
    });
    res.status(200).json({
      data: data,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};
exports.getAllPaymentOrders = async (req, res) => {
  const uId = req.user.user.id;
  const orders = await paymentOrder.find({ user: uId });
  try {
    res.status(200).json({
      data: orders,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};
exports.addCreditsToClient = async (req, res) => {
  const clientId = req.body.clientid;
  const credit_limit = req.body.cartid_limit;
  const marketerId = req.user.user.id;
  const client = await Client.findById(clientId);
  try {
    const data = {
      status: "pending",
      limet: +credit_limit,
      addby: marketerId,
    };
    client.credit = data;
    await client.save();
    res.status(200).json({
      msg: "ok",
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error,
    });
  }
};
