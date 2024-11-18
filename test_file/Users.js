const baseURL = require("supertest")("https://dummyjson.com");
const expect = require("chai").expect;
const generator = require("../generator/generator");

const identity_gen = generator.identity_generator();
const rand_numb= generator.random_number(identity_gen.length);
const random_name = generator.random_name(rand_numb);
const random_age = generator.random_age();
var last_name_208 = "Martinez";
var id_temp = "";
const void_name = void 1;


describe("Users", function (){

    //Add a user
    it("Add a new user", async function() {
        const response = await baseURL
        .post("/users/add")
        .set("Content-Type", "application/json")
        .send({
            firstName: random_name.firstname,
            lastName: random_name.lastname,
            age: random_age
        });
        expect(response.status).to.equal(201);
        expect(response.body.firstName).to.equal(random_name.firstname);
        expect(response.body.lastName).to.equal(random_name.lastname);
        expect(response.body.age).to.equal(random_age);
        id_temp = response.body.id - 1 ;
    });

    // Update an exist user
    it("Update an user", async function() {
        const response = await baseURL
        .put(`/users/${id_temp}`)
        .set("Content-Type", "application/json")
        .send({
            lastName: random_name.lastname,
        });
        expect(response.status).to.equal(200);
        expect(response.body.lastname).not.to.equal(last_name_208);
    });

    it("Update a Nonexistent user", async function() {
        const response = await baseURL
        .put(`/users/${id_temp + 1}`)
        .set("Content-Type", "application/json")
        .send({
            lastName: random_name.lastname,
        });
        expect(response.status).to.equal(404);
        expect(response.body.message).include(id_temp + 1);
        expect(response.body.message).include("not found");
    });

    // Delete an exist user
    it("Delete a user", async function() {
        const response = await baseURL
        .delete(`/users/${id_temp}`)
        .set("Content-Type", "application/json");
        expect(response.status).to.equal(200);
        expect(response.body.isDeleted).to.equal(true);
    });

    it("Delete a Nonexistent user", async function() {
        const response = await baseURL
        .delete(`/users/${id_temp + 1}`)
        .set("Content-Type", "application/json");
        expect(response.status).to.equal(404);
        expect(response.body.message).include(id_temp + 1);
        expect(response.body.message).include("not found");
    });



});