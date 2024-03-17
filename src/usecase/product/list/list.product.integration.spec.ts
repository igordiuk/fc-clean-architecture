import { Sequelize } from "sequelize-typescript";
import ListProductUseCase from "./list.product.usecase";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import Product from "../../../domain/product/entity/product";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";

describe("Integration test for listing product use case", () => {
  let sequelize: Sequelize;

  beforeEach(async() => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: {
        force: true
      }
    })

    await sequelize.addModels([ProductModel]);
    await sequelize.sync();
  })

  afterEach(async () => {
    await sequelize.close();
  })

  it("should list a product", async () => {
    const productRepository = new ProductRepository();
    const usecase = new ListProductUseCase(productRepository);
    
    const productA = new Product("123", "Product A", 100);
    const productB = new Product("456", "Product B", 200);

    await productRepository.create(productA)
    await productRepository.create(productB);

    const output = await usecase.execute({});

    expect(output.products.length).toBe(2);
    expect(output.products[0].id).toBe(productA.id)
    expect(output.products[0].name).toBe(productA.name)
    expect(output.products[0].price).toBe(productA.price)
    expect(output.products[1].id).toBe(productB.id)
    expect(output.products[1].name).toBe(productB.name)
    expect(output.products[1].price).toBe(productB.price)
  })
})