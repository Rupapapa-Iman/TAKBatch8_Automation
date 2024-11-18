const baseURL = require("supertest")("https://dummyjson.com");
const expect = require("chai").expect;
const generator = require("../generator/generator");

const identity_gen = generator.identity_generator();
const random_numb = generator.random_number(identity_gen.length)
const random_id = generator.random_id();
const random_title = generator.title_rand(random_numb);
const max_id = 208; //Id range are 1 ~ 208
const max_post_id = 251 //post_id are 1 ~ 251
var temp_id = 0;

describe("Post", function(){
    it("Add a new post", async function(){
        const response = await baseURL
        .post("/posts/add")
        .set("Content-Type", "application/json")
        .send({
            title: random_title.about,
            userId: random_id
        });
        expect(response.status).to.equal(201);
        temp_id = random_id;
        expect(response.body.title).to.equal(random_title.about);
        expect(response.body.userId).to.equal(random_id);
    });

    it("Add a new post with Nonexistent user ", async function(){
        const response = await baseURL
        .post("/posts/add")
        .set("Content-Type", "application/json")
        .send({
            title: random_title.about,
            userId: max_id + 1
        });
        expect(response.status).to.equal(404);
        expect(response.body.message).include(max_id + 1)
        expect(response.body.message).include("not found")
    });

    it("Update a post", async function(){
        const response = await baseURL
        .put(`/posts/${temp_id}`)
        .set("Content-Type", "application/json")
        .send({
            title: random_title.about,
        });
        expect(response.status).to.equal(200);
        expect(response.body.title).to.equal(random_title.about);

    });

    it("Update a post with Unavailable Post ID", async function(){
        const response = await baseURL
        .put(`/posts/${max_post_id + 1}`)
        .set("Content-Type", "application/json")
        .send({
            title: random_title.about,
        });
        expect(response.status).to.equal(404);
        expect(response.body.message).include(max_post_id + 1)
        expect(response.body.message).include("not found")
    });

    it("Delete a Post", async function(){
        const response = await baseURL
        .delete(`/users/${temp_id}`)
        .set("Content-Type", "application/json");
        expect(response.status).to.equal(200);
        expect(response.body.isDeleted).to.equal(true);
    });

    it("Delete a Post with Nonexistent user", async function() {
        const response = await baseURL
        .delete(`/users/${max_id + 1}`)
        .set("Content-Type", "application/json");
        expect(response.status).to.equal(404);
        expect(response.body.message).include(max_id + 1);
        expect(response.body.message).include("not found");
    });

});