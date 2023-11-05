const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const JWTSecret = 'dadfaffrfrrvrvrv';
const User = require("../database/User"); // Importe o modelo de usuário

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({});
});

app.post("/user", async (req, res) => {
  if (req.body.name === "" || req.body.email === "" || req.body.password === "") {
    res.sendStatus(400);
    return;
  }

  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (user) {
      res.status(400).json({ error: "E-mail já cadastrado" });
      return;
    }

    await User.create({ name: req.body.name, email: req.body.email, password: req.body.password });
    res.json({ email: req.body.email });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// app.post("/auth", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ where: { email } });

//     if (user == undefined) {
//         res.statusCode = 403;
//         res.json({errors: {email: "E-mail não cadastrado"}})
//         return
//     }

//     // Verificar a senha (com bcrypt ou outra criptografia)
//     if (user.password !== password) {
//         res.statusCode = 500;
//         res.json({errors: {password: "Senha incorreta"}});
//         return
//     }

//     // jwt.sign({ email, name: user.name, id: user.id }, JWTSecret, { expiresIn: '48h' }, (err, token) => {
//     //   if (err) {
//     //     res.sendStatus(500);
//     //     console.error(err);
//     //   } else {
//     //     res.json({ token });
//     //   }
//     // });
//   } catch (err) {
//     console.error(err);
//     res.sendStatus(500);
//   }
// });

app.post("/auth", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (user == undefined) {
        res.status(403).json({errors: {email: "E-mail não cadastrado"}});
        return;
    }

    // Verificar a senha (com bcrypt ou outra criptografia)
    if (user.password && user.password !== password) {
        res.status(403).json({errors: {password: "Senha incorreta"}});
        return;
    }

    // Se chegou aqui, a autenticação foi bem-sucedida
    const token = jwt.sign({ email, name: user.name, id: user.id }, JWTSecret, { expiresIn: '48h' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});


app.delete("/user/:email", async (req, res) => {
  try {
    await User.destroy({ where: { email: req.params.email } });
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

module.exports = app;
