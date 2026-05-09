"""
Модели данных для всех сущностей предметной области
"""

from .user import User, UserCreate, UserUpdate, UserLogin
from .product import Product, ProductCreate, ProductUpdate
from .brand import Brand, BrandCreate, BrandUpdate
from .category import Category, CategoryCreate, CategoryUpdate
from .order import Order, OrderCreate, OrderItem, OrderItemCreate
from .cart import Cart, CartItem, CartItemCreate
from .favourite import Favourite, FavouriteCreate
from .address import Address, AddressCreate, AddressUpdate
from .promo_code import PromoCode, PromoCodeCreate, PromoCodeUpdate
from .review import Review, ReviewCreate, ReviewUpdate
from .product_stock import ProductStock, ProductStockCreate, ProductStockUpdate
from .product_image import ProductImage, ProductImageCreate

__all__ = [
    "User",
    "UserCreate",
    "UserUpdate",
    "UserLogin",
    "Product",
    "ProductCreate",
    "ProductUpdate",
    "Brand",
    "BrandCreate",
    "BrandUpdate",
    "Category",
    "CategoryCreate",
    "CategoryUpdate",
    "Order",
    "OrderCreate",
    "OrderItem",
    "OrderItemCreate",
    "Cart",
    "CartItem",
    "CartItemCreate",
    "Favourite",
    "FavouriteCreate",
    "Address",
    "AddressCreate",
    "AddressUpdate",
    "PromoCode",
    "PromoCodeCreate",
    "PromoCodeUpdate",
    "Review",
    "ReviewCreate",
    "ReviewUpdate",
    "ProductStock",
    "ProductStockCreate",
    "ProductStockUpdate",
    "ProductImage",
    "ProductImageCreate",
]

