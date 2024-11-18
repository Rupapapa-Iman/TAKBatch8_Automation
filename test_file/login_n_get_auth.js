const baseURL = require("supertest")("https://dummyjson.com");
const expect = require("chai").expect;
let token = "";
let refresh_token = "";

describe("Auth", function () {

    //Login and Get Tokens Test
    it("Login user and get tokens with valid data", async function () {
        const response = await baseURL
            .post("/auth/login")
            .set("Content-Type", "application/json")
            .send({
                username: 'emilys',
                password: 'emilyspass',
                expiresInMins: 30, // optional
            })
            .set('credentials', 'include');

        token = response.body.accessToken;
        refresh_token = response.body.refreshToken;

        expect(response.status).to.equal(200);
        expect(token).to.be.a('string');
    });

    it("Login user and get tokens with invalid username", async function () {
        const response = await baseURL
            .post("/auth/login")
            .set("Content-Type", "application/json")
            .send({
                username: 'emily', // invalid username
                password: 'emilyspass',
                expiresInMins: 30, // optional
            })
            .set('credentials', 'include');

        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal("Invalid credentials");
    });

    it("Login user and get tokens with invalid password", async function () {
        const response = await baseURL
            .post("/auth/login")
            .set("Content-Type", "application/json")
            .send({
                username: 'emilys', 
                password: 'emilyspas', // invalid password
                expiresInMins: 30, // optional
            })
            .set('credentials', 'include');

        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal("Invalid credentials");
    });

    it("Login user and get tokens with missing URL", async function () {
        const response = await baseURL
            .post("/auth/log") // missin URL Parts
            .set("Content-Type", "application/json")
            .send({
                username: 'emilys', 
                password: 'emilyspas', 
                expiresInMins: 30, // optional
            })
            .set('credentials', 'include');
        expect(response.status).to.equal(401);
    });

    it("Get current auth user with valid token", async function () {
        const response = await baseURL
            .get("/auth/me")
            .set("Authorization", `Bearer ${token}`)
            .send()
            .set('credentials', 'include');
        expect(response.status).to.equal(200);
        expect(response.body.firstName).to.equal("Emily")
    });

    //Get auth user test
    it("Get current auth user with invalid token", async function () {
        const response = await baseURL
            .get("/auth/me")
            .set("Authorization", `Bearer ${token.slice(0, token.length - 1)}`) //Missing 1 of token letters
            .send()
            .set('credentials', 'include');
        expect(response.status).to.equal(500);
        expect(response.body.message).to.equal("invalid signature")
    });

    it("Get current auth user with mising URL", async function () {
        const response = await baseURL
            .get("/auth/m") // Missing URL
            .set("Authorization", `Bearer ${token}`) 
            .send()
            .set('credentials', 'include');
        expect(response.status).to.equal(404);
    });
    
    //Refresh tokens
    it("Refresh auth session with valid refresh token", async function () {
        const response = await baseURL
            .post("/auth/refresh")
            .set("Content-Type", "application/json")
            .send({
                refreshToken: refresh_token,
                expiresInMins: 30,
            })
            .set('credentials', 'include');

        expect(response.status).to.equal(200);
        expect(token).to.be.a('string');
    });

    it("Refresh auth session with invalid refresh token", async function () {
        const response = await baseURL
            .post("/auth/refresh")
            .set("Content-Type", "application/json")
            .send({
                refreshToken: refresh_token.slice(0, refresh_token.length - 1 ), //Missing 1 of refreshtoken letters
                expiresInMins: 30,
            })
            .set('credentials', 'include');
        expect(response.status).to.equal(403);
        expect(response.body.message).to.equal("Invalid refresh token");
    });

});
