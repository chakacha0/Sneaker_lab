# Описание основных классов системы SneakerLab

## Классы типа Boundary (Граница - UI компоненты)

### 1. Home (Главная страница)
**Тип:** Boundary  
**Файл:** `frontend/shop/src/pages/Home.jsx`

**Атрибуты (State):**
- `brands` (Array) - список брендов
- `menProducts` (Array) - список мужских товаров (максимум 5)
- `womenProducts` (Array) - список женских товаров (максимум 5)

**Методы:**
- `useEffect()` - загружает бренды и товары при монтировании компонента
- `navigate(path)` - навигация к каталогу с фильтром по полу

---

### 2. Catalog (Каталог товаров)
**Тип:** Boundary  
**Файл:** `frontend/shop/src/pages/Catalog.jsx`

**Атрибуты (State):**
- `products` (Array) - список товаров
- `brands` (Array) - список брендов для фильтра
- `categories` (Array) - список категорий для фильтра
- `sizes` (Array) - список доступных размеров
- `priceRange` (Object) - диапазон цен {min_price, max_price}
- `filters` (Object) - текущие фильтры {minPrice, maxPrice, categoryId, brandId, selectedSizes, gender, sortBy, sortOrder}
- `loading` (Boolean) - состояние загрузки
- `filtersInitialized` (Boolean) - флаг инициализации фильтров

**Методы:**
- `loadFilterData()` - загружает данные для фильтров (бренды, категории, размеры, диапазон цен)
- `loadProducts()` - загружает товары с учетом фильтров
- `handleFilterChange(filterName, value)` - обновляет фильтры
- `handleSortChange(sortBy, sortOrder)` - изменяет сортировку
- `handleSizeToggle(size)` - добавляет/удаляет размер из фильтров

---

### 3. ProductPage (Страница товара)
**Тип:** Boundary  
**Файл:** `frontend/shop/src/pages/ProductPage.jsx`

**Атрибуты (State):**
- `product` (Object) - информация о товаре
- `sizes` (Array) - доступные размеры товара
- `selectedSize` (Number|null) - выбранный размер
- `loading` (Boolean) - состояние загрузки
- `message` (String) - сообщение для пользователя
- `isAdding` (Boolean) - флаг добавления в корзину
- `isFavourite` (Boolean) - находится ли товар в избранном
- `isCheckingFavourite` (Boolean) - проверка статуса избранного
- `isAddingToFavourites` (Boolean) - добавление в избранное
- `reviews` (Array) - отзывы о товаре
- `reviewStats` (Object) - статистика отзывов {total_reviews, average_rating}
- `loadingReviews` (Boolean) - загрузка отзывов

**Методы:**
- `load()` - загружает информацию о товаре, размерах и отзывах
- `handleAddToCart()` - добавляет товар в корзину
- `handleToggleFavourite()` - добавляет/удаляет товар из избранного
- `setSelectedSize(size)` - выбирает размер товара

---

### 4. Cart (Корзина)
**Тип:** Boundary  
**Файл:** `frontend/shop/src/pages/Cart.jsx`

**Атрибуты (State):**
- `cart` (Object|null) - данные корзины {cart_id, items, total}
- `loading` (Boolean) - состояние загрузки
- `isAuthModalOpen` (Boolean) - открыто ли модальное окно авторизации
- `isCheckoutModalOpen` (Boolean) - открыто ли модальное окно оформления заказа
- `message` (String) - сообщение для пользователя

**Методы:**
- `loadCart()` - загружает корзину пользователя
- `handleRemoveItem(cartItemId)` - удаляет товар из корзины
- `handleQuantityChange(cartItemId, newQuantity, availableQuantity)` - изменяет количество товара в корзине

---

### 5. CheckoutModal (Модальное окно оформления заказа)
**Тип:** Boundary  
**Файл:** `frontend/shop/src/components/CheckoutModal.jsx`

**Атрибуты (State):**
- `addressForm` (Object) - форма адреса {country, city, street, house, apartment, postal_code}
- `promoCode` (String) - введенный промокод
- `isLoading` (Boolean) - состояние загрузки
- `message` (String) - сообщение для пользователя
- `messageType` (String) - тип сообщения ("error" или "success")
- `promoInfo` (Object|null) - информация о промокоде {final_total, promo_valid, promo_message, discount}
- `isCheckingPromo` (Boolean) - проверка промокода

**Методы:**
- `handleAddressChange(e)` - обновляет поля формы адреса
- `handleSubmit(e)` - отправляет форму заказа
- `checkPromoCode(code)` - проверяет валидность промокода
- `calculateOrderTotal()` - вычисляет итоговую стоимость заказа

---

### 6. ProductCard (Карточка товара)
**Тип:** Boundary  
**Файл:** `frontend/shop/src/components/ProductCard.jsx`

**Атрибуты (Props):**
- `product` (Object) - данные товара {product_id, name, price, image_url, brand, ...}

**Атрибуты (State):**
- `isFavourite` (Boolean) - находится ли товар в избранном
- `isChecking` (Boolean) - проверка статуса избранного

**Методы:**
- `handleFavouriteClick(e)` - добавляет/удаляет товар из избранного
- `navigate(path)` - переход на страницу товара при клике

---

### 7. Header (Шапка сайта)
**Тип:** Boundary  
**Файл:** `frontend/shop/src/components/Header.jsx`

**Атрибуты (State):**
- `isAuthModalOpen` (Boolean) - открыто ли модальное окно авторизации
- `searchQuery` (String) - поисковый запрос
- `user` (Object|null) - данные текущего пользователя

**Методы:**
- `handleSearch(e)` - обрабатывает поисковый запрос
- `navigate(path)` - навигация по страницам
- `setIsAuthModalOpen(boolean)` - открывает/закрывает модальное окно авторизации

---

## Классы типа Control (Контроллеры - API endpoints)

### 8. ProductsRouter (Контроллер товаров)
**Тип:** Control  
**Файл:** `backend/app/routes/products.py`

**Атрибуты:**
- `router` (APIRouter) - роутер FastAPI с префиксом "/products"

**Методы:**
- `search_products_endpoint(q: str)` - поиск товаров по запросу
- `list_products(min_price, max_price, category_id, brand_id, sizes, gender, sort_by, sort_order)` - получение списка товаров с фильтрацией
- `get_price_range_endpoint()` - получение диапазона цен
- `get_available_sizes_endpoint()` - получение доступных размеров
- `get_product(product_id: int)` - получение товара по ID
- `get_product_sizes_endpoint(product_id: int)` - получение размеров товара
- `add_product_stock_endpoint(product_id: int, stock_data: StockUpdate)` - добавление/обновление количества товара
- `create_product_endpoint(name, description, price, brand_id, category_id, gender, image)` - создание нового товара
- `update_product_endpoint(product_id, name, description, price, brand_id, category_id, gender, image)` - обновление товара
- `delete_product_endpoint(product_id: int)` - удаление товара
- `check_product_stock_endpoint(product_id: int)` - проверка наличия товара на складе

---

### 9. CartRouter (Контроллер корзины)
**Тип:** Control  
**Файл:** `backend/app/routes/cart.py`

**Атрибуты:**
- `router` (APIRouter) - роутер FastAPI с префиксом "/cart"

**Методы:**
- `add_to_cart(data: dict)` - добавление товара в корзину (требует: user_id, product_id, size, quantity)
- `get_cart(user_id: int)` - получение корзины пользователя
- `remove_item(cart_item_id: int)` - удаление товара из корзины
- `update_item_quantity(cart_item_id: int, data: dict)` - обновление количества товара (требует: quantity)

---

### 10. OrdersRouter (Контроллер заказов)
**Тип:** Control  
**Файл:** `backend/app/routes/orders.py`

**Атрибуты:**
- `router` (APIRouter) - роутер FastAPI с префиксом "/orders"

**Методы:**
- `create_order_endpoint(data: dict)` - создание заказа (требует: user_id, address_id; опционально: promo_code)
- `get_order(order_id: int)` - получение заказа по ID
- `get_orders_by_user(user_id: int)` - получение всех заказов пользователя
- `calculate_order_total(data: dict)` - вычисление итоговой стоимости заказа с учетом промокода (требует: user_id; опционально: promo_code)

---

### 11. UsersRouter (Контроллер пользователей)
**Тип:** Control  
**Файл:** `backend/app/routes/users.py`

**Атрибуты:**
- `router` (APIRouter) - роутер FastAPI с префиксом "/users"

**Методы:**
- `register_user(data: dict)` - регистрация нового пользователя (требует: email, password, first_name, last_name, phone_number)
- `verify_email(data: dict)` - подтверждение email по коду (требует: email, code)
- `login(data: dict)` - авторизация пользователя (требует: email, password)

---

## Классы типа Model (Модель - Репозитории данных)

### 12. ProductsRepository (Репозиторий товаров)
**Тип:** Model  
**Файл:** `backend/app/repositories/products_repo.py`

**Методы:**
- `get_all_products()` - получение всех товаров
- `get_product_by_id(product_id: int)` - получение товара по ID
- `get_filtered_products(min_price, max_price, category_id, brand_id, sizes, gender, sort_by, sort_order)` - получение отфильтрованных товаров
- `get_price_range()` - получение минимальной и максимальной цены
- `get_available_sizes()` - получение списка доступных размеров
- `search_products(query: str)` - поиск товаров по названию, описанию или бренду
- `create_product(name, description, price, brand_id, category_id, gender, image_url)` - создание товара
- `update_product(product_id, name, description, price, brand_id, category_id, gender, image_url)` - обновление товара
- `delete_product(product_id: int)` - удаление товара
- `has_stock(product_id: int)` - проверка наличия товара на складе

---

### 13. CartRepository (Репозиторий корзины)
**Тип:** Model  
**Файл:** `backend/app/repositories/cart_repo.py`

**Методы:**
- `get_or_create_cart(user_id: int)` - получение существующей корзины или создание новой
- `add_item_to_cart(cart_id: int, product_id: int, size: int, quantity: int)` - добавление товара в корзину (проверяет доступное количество на складе)
- `get_cart_items(cart_id: int)` - получение всех товаров из корзины с полной информацией
- `remove_item_from_cart(cart_item_id: int)` - удаление товара из корзины
- `update_cart_item_quantity(cart_item_id: int, quantity: int)` - обновление количества товара (проверяет доступное количество на складе)

---

### 14. OrdersRepository (Репозиторий заказов)
**Тип:** Model  
**Файл:** `backend/app/repositories/orders_repo.py`

**Методы:**
- `create_order(user_id: int, address_id: int, promo_code: str)` - создание заказа на основе корзины пользователя (уменьшает количество на складе, очищает корзину)
- `get_order_by_id(order_id: int)` - получение заказа по ID с полной информацией о товарах
- `get_user_orders(user_id: int)` - получение всех заказов пользователя
- `calculate_order_total_with_promo(order_total: float, promo_code: str)` - вычисление итоговой стоимости заказа с учетом промокода (возвращает: final_total, promo_valid, promo_message)

---

### 15. UsersRepository (Репозиторий пользователей)
**Тип:** Model  
**Файл:** `backend/app/repositories/users_repo.py`

**Методы:**
- `create_user(email: str, password: str, first_name: str, last_name: str, phone_number: str)` - создание нового пользователя (хэширует пароль, генерирует код подтверждения)
- `verify_email_by_code(email: str, code: str)` - подтверждение email по коду
- `get_user_by_email(email: str)` - получение пользователя по email
- `authenticate_user(email: str, password: str)` - проверка email и пароля пользователя (возвращает пользователя или None)
- `get_all_admins()` - получение списка всех администраторов
- `search_users_by_email(email_query: str)` - поиск пользователей по email
- `promote_to_admin(user_id: int)` - назначение пользователя администратором
- `remove_admin_role(user_id: int)` - снятие роли администратора

---

---

## Связи между классами

### Типы связей UML:

1. **Association (Ассоциация)** — сплошная линия с простой стрелкой → общая связь между классами
2. **Inheritance (Наследование)** — сплошная линия с полым треугольником ◄— отношение "is-a"
3. **Realization/Implementation (Реализация/Имплементация)** — пунктирная линия с полым треугольником ══◄— класс реализует интерфейс
4. **Dependency (Зависимость)** — пунктирная линия с простой стрелкой ══→ изменение одного класса может повлиять на другой
5. **Aggregation (Агрегация)** — сплошная линия с полым ромбом ◇— отношение "has-a", часть может существовать отдельно
6. **Composition (Композиция)** — сплошная линия с заполненным ромбом ◆— сильное отношение "has-a", часть не может существовать без целого

---

### Связи Boundary классов:

#### Dependency (Зависимость) ══→
- **Home** ══→ **ProductsRouter** (через API вызовы `fetchProducts`, `fetchBrands`)
- **Catalog** ══→ **ProductsRouter** (через API вызовы `fetchProducts`, `fetchPriceRange`, `fetchAvailableSizes`, `searchProducts`)
- **Catalog** ══→ **BrandsRouter** (через API вызов `fetchBrands`)
- **Catalog** ══→ **CategoriesRouter** (через API вызов `fetchCategories`)
- **ProductPage** ══→ **ProductsRouter** (через API вызовы `fetchProduct`, `fetchProductSizes`)
- **ProductPage** ══→ **CartRouter** (через API вызов `addToCart`)
- **ProductPage** ══→ **FavouritesRouter** (через API вызовы `addToFavourites`, `removeFromFavourites`, `checkFavourite`)
- **ProductPage** ══→ **ReviewsRouter** (через API вызовы `getProductReviews`, `getProductReviewStats`)
- **Cart** ══→ **CartRouter** (через API вызовы `getCart`, `removeCartItem`, `updateCartItemQuantity`)
- **Cart** ══→ **UsersRouter** (через проверку авторизации)
- **CheckoutModal** ══→ **AddressesRouter** (через API вызов `createAddress`)
- **CheckoutModal** ══→ **OrdersRouter** (через API вызовы `createOrder`, `calculateOrderTotal`)
- **ProductCard** ══→ **FavouritesRouter** (через API вызовы `addToFavourites`, `removeFromFavourites`, `checkFavourite`)
- **Header** ══→ **UsersRouter** (через проверку авторизации)

#### Aggregation (Агрегация) ◇—
- **Home** ◇— **ProductCard** (Home содержит ProductCard, но ProductCard может существовать отдельно)
- **Catalog** ◇— **ProductCard** (Catalog содержит ProductCard, но ProductCard может существовать отдельно)
- **Cart** ◇— **CheckoutModal** (Cart содержит CheckoutModal, но CheckoutModal может существовать отдельно)
- **App** ◇— **Header** (App содержит Header, но Header может существовать отдельно)

---

### Связи Control классов:

#### Dependency (Зависимость) ══→
- **ProductsRouter** ══→ **ProductsRepository** (ProductsRouter использует методы ProductsRepository)
- **ProductsRouter** ══→ **ProductStockRepository** (через `get_product_sizes`, `add_or_update_product_stock`)
- **CartRouter** ══→ **CartRepository** (CartRouter использует методы CartRepository)
- **OrdersRouter** ══→ **OrdersRepository** (OrdersRouter использует методы OrdersRepository)
- **OrdersRouter** ══→ **CartRepository** (OrdersRouter использует `get_cart_items`, `get_or_create_cart`)
- **UsersRouter** ══→ **UsersRepository** (UsersRouter использует методы UsersRepository)
- **UsersRouter** ══→ **EmailService** (UsersRouter использует `send_verification_email`)

---

### Связи Model классов:

#### Dependency (Зависимость) ══→
- **CartRepository** ══→ **ProductStockRepository** (CartRepository использует `get_product_stock_by_size` для проверки количества)
- **OrdersRepository** ══→ **CartRepository** (OrdersRepository использует `get_cart_items`, `get_or_create_cart`)
- **OrdersRepository** ══→ **PromoCodesRepository** (OrdersRepository использует `get_promo_code_by_code`)

#### Composition (Композиция) ◆—
- **Cart** ◆— **CartItems** (CartItems не могут существовать без Cart - сильная связь)
- **Order** ◆— **OrderItems** (OrderItems не могут существовать без Order - сильная связь)
- **Product** ◆— **ProductStock** (ProductStock не может существовать без Product - сильная связь)
- **Product** ◆— **ProductImages** (ProductImages не могут существовать без Product - сильная связь)
- **Order** ◆— **Address** (Order содержит ссылку на Address, но Address может существовать отдельно - это Association)
- **User** ◆— **Cart** (Cart принадлежит User, но может существовать отдельно - это Association)

#### Association (Ассоциация) →
- **Product** → **Brand** (Product связан с Brand, но Brand может существовать отдельно)
- **Product** → **Category** (Product связан с Category, но Category может существовать отдельно)
- **Order** → **User** (Order связан с User)
- **Order** → **Address** (Order связан с Address)
- **Order** → **PromoCode** (Order может быть связан с PromoCode, опционально)
- **Cart** → **User** (Cart связан с User)
- **Favourite** → **User** (Favourite связан с User)
- **Favourite** → **Product** (Favourite связан с Product)
- **Review** → **User** (Review связан с User)
- **Review** → **Product** (Review связан с Product)

---

## Примечания

- **Boundary классы** отвечают за отображение данных пользователю и обработку пользовательского ввода
- **Control классы** обрабатывают HTTP-запросы, валидируют данные и вызывают методы Model классов
- **Model классы** работают напрямую с базой данных, выполняя CRUD операции

### Об архитектуре связей:

1. **Boundary → Control**: Все Boundary классы взаимодействуют с Control классами через HTTP API вызовы (Dependency)
2. **Control → Model**: Все Control классы используют Model репозитории для работы с данными (Dependency)
3. **Model → Model**: Некоторые Model классы зависят от других Model классов для выполнения сложных операций (Dependency)
4. **Aggregation**: Используется для компонентов UI, которые могут существовать независимо (ProductCard, CheckoutModal)
5. **Composition**: Используется для сущностей, которые не могут существовать без родительской сущности (CartItems, OrderItems, ProductStock)
6. **Association**: Используется для связей между сущностями данных, которые могут существовать независимо

Все классы следуют принципам разделения ответственности и обеспечивают четкую архитектуру приложения.

