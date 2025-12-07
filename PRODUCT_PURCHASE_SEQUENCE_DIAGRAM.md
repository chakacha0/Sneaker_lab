# Диаграмма последовательности: Процесс покупки товара

## Участники (Lifelines):

### Boundary (Граница - UI компоненты):
- **Home:Widget** - Главная страница
- **Catalog:Widget** - Страница каталога
- **ProductPage:Widget** - Страница товара
- **Cart:Widget** - Страница корзины
- **CheckoutModal:Widget** - Модальное окно оформления заказа

### Control (Контроллер - API роуты):
- **ProductsController** - Контроллер товаров (products.py)
- **CartController** - Контроллер корзины (cart.py)
- **OrdersController** - Контроллер заказов (orders.py)
- **AddressesController** - Контроллер адресов (addresses.py)

### Model (Модель - Репозитории):
- **ProductsRepository** - Репозиторий товаров (products_repo.py)
- **CartRepository** - Репозиторий корзины (cart_repo.py)
- **OrdersRepository** - Репозиторий заказов (orders_repo.py)
- **AddressesRepository** - Репозиторий адресов (addresses_repo.py)
- **ProductStockRepository** - Репозиторий склада (product_stock_repo.py)
- **PromoCodesRepository** - Репозиторий промокодов (promo_codes_repo.py)

---

## Последовательность операций:

### 1. Переход в каталог
```
User -> Home:Widget: clickCatalogButton()
Home:Widget -> Catalog:Widget: navigate("/catalog")
```

### 2. Загрузка товаров в каталоге
```
Catalog:Widget -> ProductsController: fetchProducts(filters)
ProductsController -> ProductsRepository: get_filtered_products(filters)
ProductsRepository -> Database: SELECT products...
Database --> ProductsRepository: products[]
ProductsRepository --> ProductsController: products[]
ProductsController --> Catalog:Widget: products[]
Catalog:Widget -> Catalog:Widget: displayProducts(products[])
```

### 3. Выбор товара
```
User -> Catalog:Widget: clickProduct(productId)
Catalog:Widget -> ProductPage:Widget: navigate("/product/{productId}")
```

### 4. Загрузка данных товара
```
ProductPage:Widget -> ProductsController: fetchProduct(productId)
ProductsController -> ProductsRepository: get_product_by_id(productId)
ProductsRepository -> Database: SELECT product...
Database --> ProductsRepository: product
ProductsRepository --> ProductsController: product
ProductsController --> ProductPage:Widget: product

ProductPage:Widget -> ProductsController: fetchProductSizes(productId)
ProductsController -> ProductStockRepository: get_product_sizes(productId)
ProductStockRepository -> Database: SELECT sizes...
Database --> ProductStockRepository: sizes[]
ProductStockRepository --> ProductsController: sizes[]
ProductsController --> ProductPage:Widget: sizes[]
ProductPage:Widget -> ProductPage:Widget: displayProduct(product, sizes[])
```

### 5. Выбор размера
```
User -> ProductPage:Widget: selectSize(size)
ProductPage:Widget -> ProductPage:Widget: setSelectedSize(size)
```

### 6. Добавление в корзину
```
User -> ProductPage:Widget: clickAddToCart()
ProductPage:Widget -> ProductPage:Widget: validateSize()
ProductPage:Widget -> CartController: addToCart(userId, productId, size, quantity)
CartController -> CartRepository: get_or_create_cart(userId)
CartRepository -> Database: SELECT/INSERT cart...
Database --> CartRepository: cart
CartRepository --> CartController: cart

CartController -> ProductStockRepository: get_product_stock_by_size(productId, size)
ProductStockRepository -> Database: SELECT stock...
Database --> ProductStockRepository: stock
ProductStockRepository --> CartController: stock

CartController -> CartRepository: add_item_to_cart(cartId, productId, size, quantity)
CartRepository -> Database: INSERT/UPDATE cart_items...
Database --> CartRepository: cartItem
CartRepository --> CartController: cartItem
CartController --> ProductPage:Widget: success
ProductPage:Widget -> ProductPage:Widget: showMessage("Item added to cart!")
```

### 7. Переход в корзину
```
User -> Cart:Widget: navigate("/cart")
Cart:Widget -> CartController: getCart(userId)
CartController -> CartRepository: get_or_create_cart(userId)
CartRepository -> Database: SELECT cart...
Database --> CartRepository: cart
CartRepository --> CartController: cart

CartController -> CartRepository: get_cart_items(cartId)
CartRepository -> Database: SELECT cart_items...
Database --> CartRepository: items[]
CartRepository --> CartController: items[]
CartController -> CartController: calculateTotal(items[])
CartController --> Cart:Widget: {cartId, items[], total}
Cart:Widget -> Cart:Widget: displayCart(cart)
```

### 8. Открытие формы оформления заказа
```
User -> Cart:Widget: clickCheckout()
Cart:Widget -> CheckoutModal:Widget: open()
```

### 9. Проверка промокода (опционально)
```
User -> CheckoutModal:Widget: enterPromoCode(code)
CheckoutModal:Widget -> OrdersController: calculateOrderTotal(userId, promoCode)
OrdersController -> CartRepository: get_or_create_cart(userId)
CartRepository -> Database: SELECT cart...
Database --> CartRepository: cart
CartRepository --> OrdersController: cart

OrdersController -> CartRepository: get_cart_items(cartId)
CartRepository -> Database: SELECT cart_items...
Database --> CartRepository: items[]
CartRepository --> OrdersController: items[]
OrdersController -> OrdersController: calculateOriginalTotal(items[])

OrdersController -> PromoCodesRepository: get_promo_code_by_code(promoCode)
PromoCodesRepository -> Database: SELECT promo_code...
Database --> PromoCodesRepository: promoCode
PromoCodesRepository --> OrdersController: promoCode

OrdersController -> OrdersRepository: calculate_order_total_with_promo(total, promoCode)
OrdersRepository -> Database: SELECT calculate_order_total_with_promo(...)
Database --> OrdersRepository: finalTotal
OrdersRepository --> OrdersController: (finalTotal, promoValid, promoMessage)
OrdersController --> CheckoutModal:Widget: {originalTotal, finalTotal, promoValid, promoMessage, discount}
CheckoutModal:Widget -> CheckoutModal:Widget: displayPromoInfo(promoInfo)
```

### 10. Оформление заказа
```
User -> CheckoutModal:Widget: fillAddressForm(addressData)
User -> CheckoutModal:Widget: clickSubmitOrder()

CheckoutModal:Widget -> AddressesController: createAddress({userId, country, city, street, house, apartment, postalCode})
AddressesController -> AddressesRepository: create_address(userId, country, city, street, house, apartment, postalCode)
AddressesRepository -> Database: INSERT INTO addresses...
Database --> AddressesRepository: address
AddressesRepository --> AddressesController: address
AddressesController --> CheckoutModal:Widget: address

CheckoutModal:Widget -> OrdersController: createOrder({userId, addressId, promoCode})
OrdersController -> CartRepository: get_or_create_cart(userId)
CartRepository -> Database: SELECT cart...
Database --> CartRepository: cart
CartRepository --> OrdersController: cart

OrdersController -> CartRepository: get_cart_items(cartId)
CartRepository -> Database: SELECT cart_items...
Database --> CartRepository: items[]
CartRepository --> OrdersController: items[]

OrdersController -> OrdersRepository: create_order(userId, addressId, promoCode)
OrdersRepository -> Database: BEGIN TRANSACTION
OrdersRepository -> Database: INSERT INTO orders...
Database --> OrdersRepository: orderId

OrdersRepository -> Database: INSERT INTO order_items... (для каждого товара)
Database --> OrdersRepository: orderItems[]

OrdersRepository -> PromoCodesRepository: get_promo_code_by_code(promoCode) [если промокод указан]
PromoCodesRepository -> Database: SELECT promo_code...
Database --> PromoCodesRepository: promoCode
PromoCodesRepository --> OrdersRepository: promoCode

OrdersRepository -> OrdersRepository: calculate_order_total_with_promo(total, promoCode)
OrdersRepository -> Database: SELECT calculate_order_total_with_promo(...)
Database --> OrdersRepository: finalTotal

OrdersRepository -> Database: UPDATE orders SET total_price = finalTotal...
OrdersRepository -> Database: DELETE FROM cart_items WHERE cart_id = cartId...
OrdersRepository -> Database: COMMIT TRANSACTION
OrdersRepository --> OrdersController: order
OrdersController --> CheckoutModal:Widget: {message: "Заказ успешно создан", order}
CheckoutModal:Widget -> CheckoutModal:Widget: showSuccessMessage()
CheckoutModal:Widget -> Cart:Widget: onOrderSuccess()
Cart:Widget -> Cart:Widget: loadCart() [обновление корзины]
```

---

## Основные функции/методы:

### Boundary -> Control:
1. `fetchProducts(filters)` - получение списка товаров
2. `fetchProduct(productId)` - получение данных товара
3. `fetchProductSizes(productId)` - получение размеров товара
4. `addToCart(userId, productId, size, quantity)` - добавление в корзину
5. `getCart(userId)` - получение корзины
6. `calculateOrderTotal(userId, promoCode)` - расчет стоимости с промокодом
7. `createAddress(addressData)` - создание адреса
8. `createOrder({userId, addressId, promoCode})` - создание заказа

### Control -> Model:
1. `get_filtered_products(filters)` - получение отфильтрованных товаров
2. `get_product_by_id(productId)` - получение товара по ID
3. `get_product_sizes(productId)` - получение размеров товара
4. `get_or_create_cart(userId)` - получение или создание корзины
5. `add_item_to_cart(cartId, productId, size, quantity)` - добавление товара в корзину
6. `get_cart_items(cartId)` - получение товаров корзины
7. `get_product_stock_by_size(productId, size)` - проверка наличия на складе
8. `get_promo_code_by_code(code)` - получение промокода
9. `calculate_order_total_with_promo(total, promoCode)` - расчет стоимости с промокодом
10. `create_address(userId, country, city, street, house, apartment, postalCode)` - создание адреса
11. `create_order(userId, addressId, promoCode)` - создание заказа

---

## Примечания:
- Все операции с базой данных выполняются через репозитории (Model)
- Контроллеры (Control) обрабатывают HTTP запросы и вызывают методы репозиториев
- Граничные классы (Boundary) отвечают за отображение UI и взаимодействие с пользователем
- Стрелки с пунктиром (--) обозначают возвращаемые значения/ответы
- Стрелки со сплошной линией (->) обозначают вызовы методов

