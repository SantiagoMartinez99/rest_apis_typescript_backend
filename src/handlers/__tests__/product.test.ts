import request from "supertest";
import server from "../../server";
import { response } from "express";

describe("POST /api/products", () => {
  it("should display validation errors", async () => {
    const response = await request(server).post("/api/products").send({});
    expect(response.status).toEqual(400);
    expect(response.status).not.toBe(404);
    expect(response.status).not.toBe(200);
    expect(response.status).not.toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(4);
  });

  it("should validate that the price is greater than 0", async () => {
    const response = await request(server).post("/api/products").send({
      name: "Monitor-Testing",
      price: 0,
    });
    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1);
  });

  it("should validate that the price is a number and greater than 0", async () => {
    const response = await request(server).post("/api/products").send({
      name: "Monitor-Testing",
      price: "hola",
    });
    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(2);

    expect(response.status).not.toBe(404);
    expect(response.body.errors).not.toHaveLength(1);
  });

  it("should create a new product", async () => {
    const response = await request(server).post("/api/products").send({
      name: "Mouse-Testing",
      price: 100,
    });
    expect(response.status).toEqual(201);
    expect(response.body).toHaveProperty("data");
    expect(response.status).not.toBe(404);
    expect(response.status).not.toBe(200);
    expect(response.status).not.toHaveProperty("errors");
  });
});

describe("GET /api/products", () => {
  it("should send if api/products url exists", async () => {
    const response = await request(server).get("/api/products");
    expect(response.status).not.toBe(404);
    expect(response.status).not.toHaveProperty("errors");
  });
  it("GET  a JSON response with a list of products", async () => {
    const response = await request(server).get("/api/products");
    expect(response.body).toHaveProperty("data");
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.status).not.toHaveProperty("errors");
  });
});

describe("GET /api/products/:id", () => {
  it("should return a 404 error if product not found", async () => {
    const productId = 9999;
    const response = await request(server).get(`/api/products/${productId}`);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Product not found");
  });
  it("should check a valid product id", async () => {
    const response = await request(server).get("/api/products/not-valid-url");
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors[0].msg).toBe("Id must be an integer");
  });
  it("should return a JSON response with a product", async () => {
    const productId = 1;
    const response = await request(server).get(`/api/products/${productId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
  });
});

describe("PUT /api/products/:id", () => {
  it("should check a valid id", async () => {
    const response = await request(server)
      .put("/api/products/not-valid-url")
      .send({
        name: "Monitor-Testing",
        price: 100,
        availability: true,
      });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe("not a valid id");
  });

  it("should display validation error messages when updating a product", async () => {
    const response = await request(server).put("/api/products/1").send({});
    expect(response.status).toEqual(400);
    expect(response.status).not.toBe(200);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(5);
  });

  it("should return a 404 response for a non-existent product", async () => {
    const productId = 9999;
    const response = await request(server)
      .put(`/api/products/${productId}`)
      .send({
        name: "Monitor-Testing",
        price: 100,
        availability: true,
      });
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Product not found");
  });

  it("should validate that the price is greater than 0", async () => {
    const response = await request(server).put("/api/products/1").send({
      name: "Monitor-Testing",
      price: -100,
      availability: true,
    });
    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1);
  });

  it("should update a product", async () => {
    const productId = 1;
    const response = await request(server)
      .put(`/api/products/${productId}`)
      .send({
        name: "Monitor-Testing-updated",
        price: 100,
        availability: true,
      });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
  });
});

describe("PATCH /api/products/:id", () => {
  it("should check a valid id", async () => {
    const res = await request(server).patch("/api/products/not-valid-url");
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toHaveLength(1);
    expect(res.body.errors[0].msg).toBe("not a valid id");
  });
  it("should return a 404 response for a non-existent product", async () => {
    const productId = 9999;
    const res = await request(server).patch(`/api/products/${productId}`);
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toBe("Product not found");
  });

  it("should update the product availability", async () => {
    const productId = 1;
    const res = await request(server).patch(`/api/products/${productId}`).send({
      name: "Monitor-Testing-updated",
      price: 100,
      availability: true,
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data.availability).toBe(false);
  });
});

describe("DELETE /api/products/:id", () => {
  it("should check a valid id", async () => {
    const res = await request(server).delete("/api/products/not-valid-url");
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toHaveLength(1);
    expect(res.body.errors[0].msg).toBe("not a valid id");
  });

  it("should return a 404 response for a non-existent product", async () => {
    const productId = 9999;
    const res = await request(server).delete(`/api/products/${productId}`);
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toBe("Product not found");
  });

  it("should delete a product", async () => {
    const productId = 1;
    const res = await request(server).delete(`/api/products/${productId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toBe("Product deleted");
  });
});
