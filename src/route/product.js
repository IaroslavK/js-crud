// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class Product {
  static #list = []

  constructor(name, price, description) {
    this.name = name
    this.price = price
    this.description = description
    this.id = (Math.random() * 100000).toFixed(0)
    this.createDate = new Date().toISOString
  }

  static getList = () => this.#list

  static add = (product) => {
    this.#list.push(product)
  }

  static getById = (id) =>
    this.#list.find((product) => product.id === id)

  static updateById = (id, data) => {
    const product = this.getById(id)

    if (product) {
      this.update(product, data)
      return true
    } else {
      return false
    }
  }

  static update = (
    product,
    { name, price, description },
  ) => {
    if (name) {
      product.name = name
    }
    if (price) {
      product.price = price
    }
    if (description) {
      product.description = description
    }
  }

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (product) => product.id === id,
    )

    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }
}

// ================================================================

router.get('/product-create', function (req, res) {
  const list = Product.getList()

  res.render('product-create', {
    style: 'product-create',

    data: {
      products: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
})

// ================================================================

router.post('/product-create', function (req, res) {
  const { name, price, description } = req.body

  const product = new Product(name, price, description)

  Product.add(product)

  console.log(Product.getList())

  res.render('alert', {
    style: 'alert',
    info: 'Создание товара',
  })
})

// ================================================================

router.get('/product-list', function (req, res) {
  const list = Product.getList()
  res.render('product-list', {
    style: 'product-list',
    data: {
      products: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
})

// ================================================================

router.get('/product-edit', function (req, res) {
  const { id } = req.query
  const product = Product.getById(id)

  if (product) {
    res.render('product-edit', {
      style: 'product-edit',
      product,
    })
  } else {
    res.render('alert', {
      style: 'alert',
      message: 'Товар с таким ID не найден',
    })
  }
  res.render('product-edit', {
    style: 'product-edit',
  })
})

// ================================================================

router.post('/product-edit', function (req, res) {
  const { name, price, id, description } = req.body

  const product = Product.getById(id)
  Product.updateById(id, { name, price, description })
  res.render('alert', {
    style: 'alert',
    info: product
      ? 'Продукт успешно обновлен'
      : 'Произошла ошибка',
  })
})

// ================================================================

router.get('/product-delete', function (req, res) {
  const { id } = req.query
  console.log(id)
  const product = Product.deleteById(id)
  console.log(product)
  res.render('alert', {
    style: 'alert',
    info: 'Продукт успешно удален',
  })
})

// ================================================================

// Підключаємо роутер до бек-енду
module.exports = router
