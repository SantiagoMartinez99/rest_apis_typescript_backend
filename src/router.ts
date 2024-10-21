import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateAvailability,
  updateProduct,
} from "./handlers/product";
import { body, param } from "express-validator";
import { handleInputErrors } from "./middleware";

const router = Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    Product:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *          description: The product ID
 *          example: 1
 *        name:
 *          type: string
 *          description: The name of the product
 *          example: Monitor Curvo de 40 pulgadas
 *        price:
 *          type: number
 *          description: The price of the product
 *          example: 400
 *        availability:
 *          type: boolean
 *          description: The availability of the product
 *          example: true
 */

/**
 * @swagger
 * /api/products:
 *  get:
 *    summary: Get all products
 *    tags:
 *      - Products
 *    description: Get all products
 *    responses:
 *      200:
 *        description: Successful response
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Product'
 *
 *
 */

router.get("/", getProducts);

/**
 * @swagger
 * /api/products/{id}:
 *  get:
 *    summary: Get a product
 *    tags:
 *      - Products
 *    description: Get a product based on its unique ID
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *    responses:
 *      200:
 *        description: Successful response
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Product'
 *      404:
 *        description: Product not found
 *      400:
 *        description: Bad request - Invalid ID
 */

router.get(
  "/:id",
  param("id").isInt().withMessage("Id must be an integer"),
  handleInputErrors,
  getProductById
);

/**
 * @swagger
 * /api/products/:
 *  post:
 *    summary: Create a new product
 *    tags:
 *      - Products
 *    description: Create a new product
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *         schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                example: Monitor Curvo de 40 pulgadas
 *              price:
 *                type: number
 *                example: 400
 *    responses:
 *        201:
 *          description: Created
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Product'
 *        400:
 *          description: Bad request
 */

router.post(
  "/",
  body("name").not().notEmpty().withMessage("Name is required"),
  body("price")
    .isNumeric()
    .withMessage("Price must be a number")
    .notEmpty()
    .withMessage("Price is required")
    .custom((value) => value > 0)
    .withMessage("Price must be greater than 0"),
  handleInputErrors,
  createProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *  put:
 *    summary: Update a product with user input
 *    tags:
 *      - Products
 *    description: Returns the updated product
 *    parameters:
 *      - in: path
 *        name: id
 *        description: The ID of the product to retrieve
 *        required: true
 *        schema:
 *          type: integer
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *         schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                example: Monitor Curvo de 40 pulgadas
 *              price:
 *                type: number
 *                example: 400
 *              availability:
 *                type: boolean
 *                example: true
 *    responses:
 *        200:
 *          description: Updated
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Product'
 *        400:
 *          description: Bad request
 *        404:
 *          description: Product not found
 */

router.put(
  "/:id",
  param("id").isInt().withMessage("not a valid id"),
  body("name").not().notEmpty().withMessage("Name is required"),
  body("price")
    .isNumeric()
    .withMessage("Price must be a number")
    .notEmpty()
    .withMessage("Price is required")
    .custom((value) => value > 0)
    .withMessage("Price must be greater than 0"),
  body("availability")
    .isBoolean()
    .withMessage("Availability must be a boolean"),
  handleInputErrors,
  updateProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *  patch:
 *    summary: Update availability
 *    tags:
 *      - Products
 *    description: Returns the updated availability
 *    parameters:
 *      - in: path
 *        name: id
 *        description: The ID of the product to retrieve
 *        required: true
 *        schema:
 *          type: integer
 *    responses:
 *        200:
 *          description: Successful response
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Product'
 *        400:
 *          description: Bad request - Invalid ID
 *        404:
 *          description: Product not found
 */

router.patch(
  "/:id",

  param("id").isInt().withMessage("not a valid id"),
  handleInputErrors,
  updateAvailability
);

/** Delete a product
 * @swagger
 * /api/products/{id}:
 *  delete:
 *    summary: Delete a product
 *    tags:
 *      - Products
 *    description: Delete a product based on its unique ID
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *    responses:
 *      200:
 *        description: Successful response
 *        content:
 *          application/json:
 *            schema:
 *              type: string
 *              value: 'Product deleted'
 *      404:
 *        description: Product not found
 *      400:
 *        description: Bad request - Invalid ID
 */

router.delete(
  "/:id",
  param("id").isInt().withMessage("not a valid id"),
  handleInputErrors,
  deleteProduct
);

export default router;
