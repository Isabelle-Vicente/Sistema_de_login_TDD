let app = require("../src/app");
let supertest = require("supertest");
let request = supertest(app);
const User = require("../database/User"); // Importe o modelo de usuário

let mainUser = User.create({
    name: 'Nome do Usuário',
    email: 'email@example.com',
    password: 'senha'
})
//let mainUser = {name: "Victor Lima", email: "victor@guia.com", password: "123456"};

beforeAll(()=>{
    return request.post("/user")
    .send(mainUser)
    .then(res => {})
    .catch(err => {console.log(err)})
})

afterAll(() =>{
     return request.delete(`/user/${mainUser.email}`)
    .then(res => {})
    .catch(err => {console.log(err)})
})

describe("Cadastro de usuário",() =>{
    test("Deve cadastrar um usuário com sucesso", ()=>{
        let time = Date.now();
        let email = `${time}@gmail.com`;
        let user = {name: "victor", email , password: "123456"};

        return request.post("/user")
        .send(user).then(res =>{

            expect(res.statusCode).toEqual(200);
            expect(res.body.email).toEqual(email);

        }).catch(err => {
            fail(err);
        });
    })

    test("Deve impedir que um usuário se cadastre com os dados vazios", () => {
       
        let user = {name: "", email: "" , password: ""};

        return request.post("/user")
        .send(user).then(res =>{

          expect(res.statusCode).toEqual(400);

        }).catch(err => {
            fail(err);
        });
    })

    test("Deve impedir que um usuário se cadastre com e-mail repetido", () =>{
        let time = Date.now();
        let email = `${time}@gmail.com`;
        let user = {name: "victor", email , password: "123456"};

        return request.post("/user")
        .send(user).then(res =>{

            expect(res.statusCode).toEqual(200);
            expect(res.body.email).toEqual(email);

            return request.post("/user")
            .send(user)
            .then(res => {
                expect(res.statusCode).toEqual(400);
                expect(res.body.error).toEqual("E-mail já cadastrado");

            }).catch(err => {
                fail(err);
            });

        }).catch(err => {
            fail(err);
        });
    })
})

describe("Auteticação", () => {
//   test("Deve me retornar um token quando logan",() =>{
//     return request.post("/auth")
//     .send({email: mainUser, password: mainUser.password})
//     .then(res => {
//         expect(res.statusCode).toEqual(200);
//         expect(res.body.token).toBeDefined();
//     }).catch(err => {
//         throw err;
//     })
//   })

  test("Deve impredir que um usuário não cadastrado se logue",() =>{
    return request.post("/auth")
    .send({email: "dsfsdfsfsaf3eg@safasvds.com" , password: "3342434"})
    .then(res => {
        expect(res.statusCode).toEqual(403);
        expect(res.body.errors.email).toEqual("E-mail não cadastrado");
    }).catch(err => {
        throw err;
    })
  })

  test("Deve impredir que um usuário se logue com uma senha errada", () => {
    return request
      .post("/auth")
      .send({ email: mainUser.email, password: "senha_incorreta" })
      .then((res) => {
        console.log(res.body); // Adicione esta linha para imprimir a resposta no console
        expect(res.statusCode).toEqual(500);
      })
      .catch((err) => {
        throw err;
      });
  });
  
  

});