import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for product", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  })

  afterAll(async () => {
    await sequelize.close();
  })

  it("should create a product", async () => {
    const response = await request(app)
      .post("/product")
      .send({        
        type: "a",
        name: "Product A",
        price: 100,
      })

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Product A");
    expect(response.body.price).toBe(100);
  })

  it("should not create a product", async () => {
    const response = await request(app).post("/product").send({
      "name": "Product A"
    });
    expect(response.status).toBe(500);
  });

  it("should list all products", async() => {
    const response = await request(app)
      .post("/product")
      .send({        
        type: "a",
        name: "Product A",
        price: 100,
      });
    expect(response.status).toBe(200);
    
    const response2 = await request(app)
      .post("/product")
      .send({        
        type: "a",
        name: "Product B",
        price: 200,
      })
    expect(response2.status).toBe(200);

    const listResponse = await request(app).get("/product").send({});

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.products.length).toBe(2);
    
    const productA = listResponse.body.products[0];
    expect(productA.name).toBe("Product A");
    expect(productA.price).toBe(100);
    
    const productB = listResponse.body.products[1];
    expect(productB.name).toBe("Product B");
    expect(productB.price).toBe(200);
  });

  it("should update a product", async() => {
    const response = await request(app)
      .post("/product")
      .send({        
        type: "a",
        name: "Product A",
        price: 100,
      });
    expect(response.status).toBe(200);
    
    const produtId = response.body.id;

    const updateResponse = await request(app).put("/product").send({
      type: "a",
      id: produtId,
      name: "Product Updated",
      price: 110
    });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.name).toBe("Product Updated");
    expect(updateResponse.body.price).toBe(110);
  });

  it("should get a product by id", async() => {
    const response = await request(app)
      .post("/product")
      .send({        
        type: "a",
        name: "Product A",
        price: 100,
      });
    expect(response.status).toBe(200);
    
    const produtId = response.body.id;

    const findResponse = await request(app).get(`/product/${produtId}`).send({});

    expect(findResponse.status).toBe(200);
    expect(findResponse.body.name).toBe("Product A");
    expect(findResponse.body.price).toBe(100);
  });

})