import { Sequelize } from "sequelize-typescript"
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import Product from "../../../domain/product/entity/product";
import UpdateProductUseCase from "./update.product.usecase";

describe ("Integration test to update a product use case", () => {
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

  it("should update a product", async () => {
    const productRepository = new ProductRepository();
    const usecase = new UpdateProductUseCase(productRepository);

    const product = new Product("123", "Product 123", 100)
    await productRepository.create(product);

    product.changeName("Product Updated");
    product.changePrice(110);

    await productRepository.update(product);
    

    const input = {
      id: "123",
      name: "Product Updated",
      price: 110,
    }

    const output = await usecase.execute(input);

    expect(output).toEqual({
      id: input.id,
      name: input.name,
      price: input.price
    })
    
  })

})