import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthModal from "../components/AuthModal";
import AdminMenu from "../components/admin/AdminMenu";
import AdminInfo from "../components/admin/AdminInfo";
import AdminBrandsList from "../components/admin/AdminBrandsList";
import AdminProductsList from "../components/admin/AdminProductsList";
import AdminCategoriesList from "../components/admin/AdminCategoriesList";
import AdminAdministratorsList from "../components/admin/AdminAdministratorsList";
import AdminPromoCodesList from "../components/admin/AdminPromoCodesList";
import AddBrandModal from "../components/admin/AddBrandModal";
import EditBrandModal from "../components/admin/EditBrandModal";
import DeleteBrandConfirmModal from "../components/admin/DeleteBrandConfirmModal";
import AddPromoCodeModal from "../components/admin/AddPromoCodeModal";
import EditPromoCodeModal from "../components/admin/EditPromoCodeModal";
import DeletePromoCodeConfirmModal from "../components/admin/DeletePromoCodeConfirmModal";
import AddCategoryModal from "../components/admin/AddCategoryModal";
import EditCategoryModal from "../components/admin/EditCategoryModal";
import DeleteCategoryConfirmModal from "../components/admin/DeleteCategoryConfirmModal";
import AddAdministratorModal from "../components/admin/AddAdministratorModal";
import RemoveAdminConfirmModal from "../components/admin/RemoveAdminConfirmModal";
import ViewStockModal from "../components/admin/ViewStockModal";
import AddStockModal from "../components/admin/AddStockModal";
import AddProductModal from "../components/admin/AddProductModal";
import EditProductModal from "../components/admin/EditProductModal";
import DeleteProductConfirmModal from "../components/admin/DeleteProductConfirmModal";
import { fetchBrands, createBrand, updateBrand, deleteBrand } from "../api/brands";
import { fetchProducts, fetchProductSizes, createProduct, addProductStock, updateProduct, deleteProduct, checkProductStock } from "../api/products";
import { fetchCategories, createCategory, updateCategory, deleteCategory } from "../api/categories";
import { fetchAdmins, searchUsersByEmail, promoteToAdmin, removeAdminRole } from "../api/admins";
import { fetchPromoCodes, createPromoCode, updatePromoCode, deletePromoCode } from "../api/promo_codes";
import { getImageUrl } from "../utils/imageUrl";
import { 
  containerStyle, 
  contentStyle, 
  adminTitleStyle,
  titleStyle,
  labelStyle,
  valueStyle
} from "../components/admin/adminStyles";

function AdminCabinet() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [brands, setBrands] = useState([]);
  const [brandsLoading, setBrandsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [brandsForSelect, setBrandsForSelect] = useState([]);
  const [categories, setCategories] = useState([]);
  const [adminCategories, setAdminCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [isAddBrandModalOpen, setIsAddBrandModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);
  const [isDeleteCategoryConfirmModalOpen, setIsDeleteCategoryConfirmModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({
    name: ""
  });
  const [admins, setAdmins] = useState([]);
  const [adminsLoading, setAdminsLoading] = useState(false);
  const [isAddAdministratorModalOpen, setIsAddAdministratorModalOpen] = useState(false);
  const [isRemoveAdminConfirmModalOpen, setIsRemoveAdminConfirmModalOpen] = useState(false);
  const [removingAdmin, setRemovingAdmin] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productStock, setProductStock] = useState([]);
  const [stockLoading, setStockLoading] = useState(false);
  const [isAddStockModalOpen, setIsAddStockModalOpen] = useState(false);
  const [newStock, setNewStock] = useState({
    size: "",
    quantity: ""
  });
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [isDeleteProductConfirmModalOpen, setIsDeleteProductConfirmModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [productHasStock, setProductHasStock] = useState(false);
  const [editProduct, setEditProduct] = useState({
    name: "",
    description: "",
    price: "",
    brand_id: "",
    category_id: "",
    gender: "",
    image: null
  });
  const [editProductImagePreview, setEditProductImagePreview] = useState(null);
  const [isEditBrandModalOpen, setIsEditBrandModalOpen] = useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [deletingBrand, setDeletingBrand] = useState(null);
  const [newBrand, setNewBrand] = useState({
    name: "",
    description: "",
    country: "",
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [productImagePreview, setProductImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [promoCodes, setPromoCodes] = useState([]);
  const [promoCodesLoading, setPromoCodesLoading] = useState(false);
  const [isAddPromoCodeModalOpen, setIsAddPromoCodeModalOpen] = useState(false);
  const [isEditPromoCodeModalOpen, setIsEditPromoCodeModalOpen] = useState(false);
  const [isDeletePromoCodeConfirmModalOpen, setIsDeletePromoCodeConfirmModalOpen] = useState(false);
  const [editingPromoCode, setEditingPromoCode] = useState(null);
  const [deletingPromoCode, setDeletingPromoCode] = useState(null);
  const [newPromoCode, setNewPromoCode] = useState({
    code: "",
    discount_percent: null,
    discount_amount: null,
    valid_from: null,
    valid_to: null,
    min_order_price: null,
    usage_limit: null
  });
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    brand_id: "",
    category_id: "",
    gender: "",
    image: null
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      setIsAuthModalOpen(true);
      setLoading(false);
      return;
    }

    const userData = JSON.parse(savedUser);
    
    // Проверяем, что пользователь - администратор
    if (userData.role !== 'admin') {
      // Если не администратор, перенаправляем на обычный профиль
      navigate("/profile");
      return;
    }
    
    setUser(userData);
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
    window.location.reload();
  };

  const loadBrands = async () => {
    setBrandsLoading(true);
    try {
      const data = await fetchBrands();
      setBrands(data || []);
    } catch (error) {
      console.error("Ошибка загрузки брендов:", error);
      setBrands([]);
    } finally {
      setBrandsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewBrand({ ...newBrand, image: file });
      // Создаем превью изображения
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddBrand = async (e) => {
    e.preventDefault();
    
    if (!newBrand.name.trim()) {
      setMessage("Название бренда обязательно");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      await createBrand(newBrand);
      setMessage("Бренд успешно добавлен!");
      
      // Очищаем форму
      setNewBrand({
        name: "",
        description: "",
        country: "",
        image: null
      });
      setImagePreview(null);
      
      // Закрываем модальное окно и обновляем список
      setTimeout(() => {
        setIsAddBrandModalOpen(false);
        loadBrands();
        setMessage("");
      }, 1500);
    } catch (error) {
      setMessage(error.message || "Ошибка при добавлении бренда");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditBrand = (brand) => {
    setEditingBrand(brand);
    setNewBrand({
      name: brand.name || "",
      description: brand.description || "",
      country: brand.country || "",
      image: null
    });
    setImagePreview(brand.image_url ? getImageUrl(brand.image_url) : null);
    setIsEditBrandModalOpen(true);
    setMessage("");
  };

  const handleUpdateBrand = async (e) => {
    e.preventDefault();
    
    if (!newBrand.name.trim()) {
      setMessage("Название бренда обязательно");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      await updateBrand(editingBrand.brand_id, newBrand);
      setMessage("Бренд успешно обновлен!");
      
      // Закрываем модальное окно и обновляем список
      setTimeout(() => {
        setIsEditBrandModalOpen(false);
        setEditingBrand(null);
        setNewBrand({
          name: "",
          description: "",
          country: "",
          image: null
        });
        setImagePreview(null);
        loadBrands();
        setMessage("");
      }, 1500);
    } catch (error) {
      setMessage(error.message || "Ошибка при обновлении бренда");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBrand = (brand) => {
    setDeletingBrand(brand);
    setIsDeleteConfirmModalOpen(true);
    setMessage("");
  };

  const handleConfirmDelete = async () => {
    if (!deletingBrand) return;

    setIsSubmitting(true);
    setMessage("");

    try {
      await deleteBrand(deletingBrand.brand_id);
      setMessage("Бренд успешно удален!");
      
      setTimeout(() => {
        setIsDeleteConfirmModalOpen(false);
        setDeletingBrand(null);
        loadBrands();
        setMessage("");
      }, 1500);
    } catch (error) {
      setMessage(error.message || "Ошибка при удалении бренда");
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadProducts = async () => {
    setProductsLoading(true);
    try {
      const data = await fetchProducts({});
      setProducts(data || []);
    } catch (error) {
      console.error("Ошибка загрузки товаров:", error);
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

  const loadBrandsForSelect = async () => {
    try {
      const data = await fetchBrands();
      setBrandsForSelect(data || []);
    } catch (error) {
      console.error("Ошибка загрузки брендов:", error);
      setBrandsForSelect([]);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data || []);
    } catch (error) {
      console.error("Ошибка загрузки категорий:", error);
      setCategories([]);
    }
  };

  const loadAdminCategories = async () => {
    setCategoriesLoading(true);
    try {
      const data = await fetchCategories();
      setAdminCategories(data || []);
    } catch (error) {
      console.error("Ошибка загрузки категорий:", error);
      setAdminCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    
    if (!newCategory.name.trim()) {
      setMessage("Название категории обязательно");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      await createCategory(newCategory);
      setMessage("Категория успешно добавлена!");
      
      // Очищаем форму
      setNewCategory({ name: "" });
      
      // Закрываем модальное окно и обновляем список
      setTimeout(() => {
        setIsAddCategoryModalOpen(false);
        loadAdminCategories();
        setMessage("");
      }, 1500);
    } catch (error) {
      setMessage(error.message || "Ошибка при добавлении категории");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setNewCategory({
      name: category.name || ""
    });
    setIsEditCategoryModalOpen(true);
    setMessage("");
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    
    if (!newCategory.name.trim()) {
      setMessage("Название категории обязательно");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      await updateCategory(editingCategory.category_id, newCategory);
      setMessage("Категория успешно обновлена!");
      
      // Закрываем модальное окно и обновляем список
      setTimeout(() => {
        setIsEditCategoryModalOpen(false);
        setEditingCategory(null);
        setNewCategory({ name: "" });
        loadAdminCategories();
        setMessage("");
      }, 1500);
    } catch (error) {
      setMessage(error.message || "Ошибка при обновлении категории");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = (category) => {
    setDeletingCategory(category);
    setIsDeleteCategoryConfirmModalOpen(true);
    setMessage("");
  };

  const handleConfirmDeleteCategory = async () => {
    if (!deletingCategory) return;

    setIsSubmitting(true);
    setMessage("");

    try {
      await deleteCategory(deletingCategory.category_id);
      setMessage("Категория успешно удалена!");
      
      setTimeout(() => {
        setIsDeleteCategoryConfirmModalOpen(false);
        setDeletingCategory(null);
        loadAdminCategories();
        setMessage("");
      }, 1500);
    } catch (error) {
      setMessage(error.message || "Ошибка при удалении категории");
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadAdmins = async () => {
    setAdminsLoading(true);
    try {
      const data = await fetchAdmins();
      setAdmins(data || []);
    } catch (error) {
      console.error("Ошибка загрузки администраторов:", error);
      setAdmins([]);
    } finally {
      setAdminsLoading(false);
    }
  };

  const handleSearchUsers = async (emailQuery) => {
    setSearchLoading(true);
    setSearchResults([]);
    try {
      const results = await searchUsersByEmail(emailQuery);
      setSearchResults(results || []);
    } catch (error) {
      setMessage(error.message || "Ошибка при поиске пользователей");
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handlePromoteToAdmin = async (user) => {
    setIsSubmitting(true);
    setMessage("");

    try {
      await promoteToAdmin(user.user_id);
      setMessage("Пользователь успешно назначен администратором!");
      
      // Обновляем список администраторов и очищаем результаты поиска
      setTimeout(() => {
        loadAdmins();
        setSearchResults([]);
        setMessage("");
      }, 1500);
    } catch (error) {
      setMessage(error.message || "Ошибка при назначении администратором");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveAdmin = (admin) => {
    setRemovingAdmin(admin);
    setIsRemoveAdminConfirmModalOpen(true);
    setMessage("");
  };

  const handleConfirmRemoveAdmin = async () => {
    if (!removingAdmin) return;

    setIsSubmitting(true);
    setMessage("");

    try {
      await removeAdminRole(removingAdmin.user_id);
      setMessage("Права администратора успешно отозваны!");
      
      setTimeout(() => {
        setIsRemoveAdminConfirmModalOpen(false);
        setRemovingAdmin(null);
        loadAdmins();
        setMessage("");
      }, 1500);
    } catch (error) {
      setMessage(error.message || "Ошибка при отзыве прав администратора");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProductImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProduct({ ...newProduct, image: file });
      // Создаем превью изображения
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    
    if (!newProduct.name.trim()) {
      setMessage("Название товара обязательно");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const productData = {
        ...newProduct,
        price: newProduct.price ? parseFloat(newProduct.price) : null,
        brand_id: newProduct.brand_id ? parseInt(newProduct.brand_id) : null,
        category_id: newProduct.category_id ? parseInt(newProduct.category_id) : null,
        gender: newProduct.gender || null
      };
      
      await createProduct(productData);
      setMessage("Товар успешно добавлен!");
      
      // Очищаем форму
      setNewProduct({
        name: "",
        description: "",
        price: "",
        brand_id: "",
        category_id: "",
        gender: "",
        image: null
      });
      setProductImagePreview(null);
      
      // Закрываем модальное окно и обновляем список
      setTimeout(() => {
        setIsAddProductModalOpen(false);
        loadProducts();
        setMessage("");
      }, 1500);
    } catch (error) {
      setMessage(error.message || "Ошибка при добавлении товара");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewStock = async (product) => {
    setSelectedProduct(product);
    setIsStockModalOpen(true);
    setStockLoading(true);
    setProductStock([]);
    
    try {
      const response = await fetchProductSizes(product.product_id);
      setProductStock(response.sizes || []);
    } catch (error) {
      console.error("Ошибка загрузки остатков:", error);
      setProductStock([]);
    } finally {
      setStockLoading(false);
    }
  };

  const handleOpenAddStockModal = () => {
    setIsAddStockModalOpen(true);
    setNewStock({ size: "", quantity: "" });
    setMessage("");
  };

  const handleAddStock = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!selectedProduct) {
      setMessage("Ошибка: товар не выбран");
      return;
    }
    
    if (!newStock.size || !newStock.quantity) {
      setMessage("Размер и количество обязательны");
      return;
    }

    const sizeNum = parseInt(newStock.size);
    const quantityNum = parseInt(newStock.quantity);

    if (isNaN(sizeNum) || sizeNum <= 0) {
      setMessage("Размер должен быть положительным числом");
      return;
    }

    if (isNaN(quantityNum) || quantityNum < 0) {
      setMessage("Количество должно быть неотрицательным числом");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      await addProductStock(selectedProduct.product_id, sizeNum, quantityNum);
      setMessage("Количество товара успешно добавлено!");
      
      // Обновляем список остатков
      const response = await fetchProductSizes(selectedProduct.product_id);
      setProductStock(response.sizes || []);
      
      // Очищаем форму и закрываем модальное окно
      setNewStock({ size: "", quantity: "" });
      setTimeout(() => {
        setIsAddStockModalOpen(false);
        setMessage("");
      }, 1500);
    } catch (error) {
      setMessage(error.message || "Ошибка при добавлении количества товара");
      console.error("Ошибка добавления количества:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProduct = async (product) => {
    setEditingProduct(product);
    // Загружаем информацию о товаре с изображением
    const productWithImage = products.find(p => p.product_id === product.product_id);
    
    // Убеждаемся, что загружены бренды и категории для выпадающих списков
    if (brandsForSelect.length === 0) {
      await loadBrandsForSelect();
    }
    if (categories.length === 0) {
      await loadCategories();
    }
    
    setEditProduct({
      name: product.name || "",
      description: product.description || "",
      price: product.price !== null && product.price !== undefined 
        ? (() => {
            const numPrice = typeof product.price === 'number' ? product.price : parseFloat(product.price);
            if (isNaN(numPrice)) return "";
            // Если число целое, показываем без дробной части
            if (Number.isInteger(numPrice)) {
              return numPrice.toString();
            }
            // Иначе показываем до 2 знаков после запятой, убирая лишние нули
            return parseFloat(numPrice.toFixed(2)).toString();
          })()
        : "",
      brand_id: product.brand_id ? product.brand_id.toString() : "",
      category_id: product.category_id ? product.category_id.toString() : "",
      gender: product.gender || "",
      image: null
    });
    setEditProductImagePreview(productWithImage?.image_url ? getImageUrl(productWithImage.image_url) : null);
    setIsEditProductModalOpen(true);
    setMessage("");
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!editingProduct) {
      setMessage("Ошибка: товар не выбран");
      return;
    }

    if (!editProduct.name.trim()) {
      setMessage("Название товара обязательно");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      // Преобразуем цену в число с проверкой
      let priceValue = null;
      if (editProduct.price && editProduct.price.trim()) {
        const parsedPrice = parseFloat(editProduct.price.trim());
        if (!isNaN(parsedPrice) && parsedPrice >= 0) {
          priceValue = parsedPrice;
        } else {
          setMessage("Цена должна быть положительным числом");
          setIsSubmitting(false);
          return;
        }
      }
      
      const productData = {
        ...editProduct,
        price: priceValue,
        brand_id: editProduct.brand_id ? parseInt(editProduct.brand_id) : null,
        category_id: editProduct.category_id ? parseInt(editProduct.category_id) : null,
        gender: editProduct.gender || null
      };
      
      await updateProduct(editingProduct.product_id, productData);
      setMessage("Товар успешно обновлен!");
      
      // Обновляем список товаров
      await loadProducts();
      
      // Закрываем модальное окно
      setTimeout(() => {
        setIsEditProductModalOpen(false);
        setMessage("");
        setEditProduct({
          name: "",
          description: "",
          price: "",
          brand_id: "",
          category_id: "",
          gender: "",
          image: null
        });
        setEditProductImagePreview(null);
        setEditingProduct(null);
      }, 1500);
    } catch (error) {
      setMessage(error.message || "Ошибка при обновлении товара");
      console.error("Ошибка обновления товара:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (product) => {
    setDeletingProduct(product);
    
    // Проверяем, есть ли товар на складе
    try {
      const stockInfo = await checkProductStock(product.product_id);
      setProductHasStock(stockInfo.has_stock);
    } catch (error) {
      console.error("Ошибка проверки наличия товара:", error);
      setProductHasStock(false);
    }
    
    setIsDeleteProductConfirmModalOpen(true);
  };

  const handleConfirmDeleteProduct = async () => {
    if (!deletingProduct) return;

    setIsSubmitting(true);
    setMessage("");

    try {
      await deleteProduct(deletingProduct.product_id);
      setMessage("Товар успешно удален!");
      
      // Обновляем список товаров
      await loadProducts();
      
      // Закрываем модальное окно
      setTimeout(() => {
        setIsDeleteProductConfirmModalOpen(false);
        setMessage("");
        setDeletingProduct(null);
        setProductHasStock(false);
      }, 1500);
    } catch (error) {
      setMessage(error.message || "Ошибка при удалении товара");
      console.error("Ошибка удаления товара:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProductImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditProduct({ ...editProduct, image: file });
      // Создаем превью изображения
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditProductImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const loadPromoCodes = async () => {
    setPromoCodesLoading(true);
    try {
      const data = await fetchPromoCodes();
      setPromoCodes(data || []);
    } catch (error) {
      console.error("Ошибка загрузки промокодов:", error);
      setPromoCodes([]);
    } finally {
      setPromoCodesLoading(false);
    }
  };

  const handleAddPromoCode = async (e) => {
    e.preventDefault();
    
    if (!newPromoCode.code.trim()) {
      setMessage("Код промокода обязателен");
      return;
    }

    if (!newPromoCode.discount_percent && !newPromoCode.discount_amount) {
      setMessage("Необходимо указать либо процент скидки, либо сумму скидки");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      await createPromoCode(newPromoCode);
      setMessage("Промокод успешно добавлен!");
      
      setNewPromoCode({
        code: "",
        discount_percent: null,
        discount_amount: null,
        valid_from: null,
        valid_to: null,
        min_order_price: null,
        usage_limit: null
      });
      
      setTimeout(() => {
        setIsAddPromoCodeModalOpen(false);
        loadPromoCodes();
        setMessage("");
      }, 1500);
    } catch (error) {
      setMessage(error.message || "Ошибка при добавлении промокода");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditPromoCode = (promoCode) => {
    setEditingPromoCode(promoCode);
    setNewPromoCode({
      code: promoCode.code || "",
      discount_percent: promoCode.discount_percent || null,
      discount_amount: promoCode.discount_amount || null,
      valid_from: promoCode.valid_from || null,
      valid_to: promoCode.valid_to || null,
      min_order_price: promoCode.min_order_price || null,
      usage_limit: promoCode.usage_limit || null
    });
    setIsEditPromoCodeModalOpen(true);
    setMessage("");
  };

  const handleUpdatePromoCode = async (e) => {
    e.preventDefault();
    
    if (!newPromoCode.code.trim()) {
      setMessage("Код промокода обязателен");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      await updatePromoCode(editingPromoCode.promo_id, newPromoCode);
      setMessage("Промокод успешно обновлен!");
      
      setTimeout(() => {
        setIsEditPromoCodeModalOpen(false);
        setEditingPromoCode(null);
        setNewPromoCode({
          code: "",
          discount_percent: null,
          discount_amount: null,
          valid_from: null,
          valid_to: null,
          min_order_price: null,
          usage_limit: null
        });
        loadPromoCodes();
        setMessage("");
      }, 1500);
    } catch (error) {
      setMessage(error.message || "Ошибка при обновлении промокода");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePromoCode = (promoCode) => {
    setDeletingPromoCode(promoCode);
    setIsDeletePromoCodeConfirmModalOpen(true);
    setMessage("");
  };

  const handleConfirmDeletePromoCode = async () => {
    if (!deletingPromoCode) return;

    setIsSubmitting(true);
    setMessage("");

    try {
      await deletePromoCode(deletingPromoCode.promo_id);
      setMessage("Промокод успешно удален!");
      
      setTimeout(() => {
        setIsDeletePromoCodeConfirmModalOpen(false);
        setDeletingPromoCode(null);
        loadPromoCodes();
        setMessage("");
      }, 1500);
    } catch (error) {
      setMessage(error.message || "Ошибка при удалении промокода");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTabChange = (tab) => {
    console.log("Switching to tab:", tab);
    setActiveTab(tab);
    if (tab === "brands") {
      loadBrands();
    } else if (tab === "products") {
      loadProducts();
    } else if (tab === "categories") {
      loadAdminCategories();
    } else if (tab === "administrators") {
      loadAdmins();
    } else if (tab === "promo-codes") {
      loadPromoCodes();
    }
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={{ color: "#FF6B35", fontSize: "18px", textAlign: "center", width: "100%" }}>
          Loading...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#666", fontSize: "18px" }}>
          <p>Please log in to view admin cabinet</p>
        </div>
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => {
            setIsAuthModalOpen(false);
            navigate("/");
          }}
        />
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <AdminMenu 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        onLogout={handleLogout}
      />

      {/* Контент */}
      <div style={contentStyle}>
        {activeTab === "info" && <AdminInfo user={user} />}

        {activeTab === "brands" && (
          <AdminBrandsList
            brands={brands}
            brandsLoading={brandsLoading}
            onAddBrand={() => setIsAddBrandModalOpen(true)}
            onEditBrand={handleEditBrand}
            onDeleteBrand={handleDeleteBrand}
          />
        )}

        {activeTab === "products" && (
          <AdminProductsList
            products={products}
            productsLoading={productsLoading}
            onAddProduct={() => {
              setIsAddProductModalOpen(true);
              loadBrandsForSelect();
              loadCategories();
            }}
            onViewStock={handleViewStock}
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        )}

        {activeTab === "categories" && (
          <AdminCategoriesList
            categories={adminCategories}
            categoriesLoading={categoriesLoading}
            onAddCategory={() => setIsAddCategoryModalOpen(true)}
            onEditCategory={handleEditCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        )}

        {activeTab === "administrators" && (
          <AdminAdministratorsList
            admins={admins}
            adminsLoading={adminsLoading}
            onAddAdministrator={() => setIsAddAdministratorModalOpen(true)}
            onRemoveAdmin={handleRemoveAdmin}
          />
        )}

        {activeTab === "promo-codes" && (
          <AdminPromoCodesList
            promoCodes={promoCodes}
            promoCodesLoading={promoCodesLoading}
            onAddPromoCode={() => setIsAddPromoCodeModalOpen(true)}
            onEditPromoCode={handleEditPromoCode}
            onDeletePromoCode={handleDeletePromoCode}
          />
        )}
      </div>

      {/* Модальные окна для товаров */}
      <ViewStockModal
        isOpen={isStockModalOpen}
        onClose={() => setIsStockModalOpen(false)}
        selectedProduct={selectedProduct}
        productStock={productStock}
        stockLoading={stockLoading}
        onAddStock={handleOpenAddStockModal}
      />

      <AddStockModal
        isOpen={isAddStockModalOpen}
        onClose={() => {
          if (!isSubmitting) {
            setIsAddStockModalOpen(false);
            setMessage("");
          }
        }}
        selectedProduct={selectedProduct}
        newStock={newStock}
        setNewStock={setNewStock}
        onSubmit={handleAddStock}
        isSubmitting={isSubmitting}
        message={message}
      />

      <AddProductModal
        isOpen={isAddProductModalOpen}
        onClose={() => {
          if (!isSubmitting) {
            setIsAddProductModalOpen(false);
            setMessage("");
          }
        }}
        newProduct={newProduct}
        setNewProduct={setNewProduct}
        productImagePreview={productImagePreview}
        onImageChange={handleProductImageChange}
        brandsForSelect={brandsForSelect}
        categories={categories}
        onSubmit={handleAddProduct}
        isSubmitting={isSubmitting}
        message={message}
      />

      {/* Модальные окна брендов */}
      <AddBrandModal
        isOpen={isAddBrandModalOpen}
        onClose={() => {
          if (!isSubmitting) {
            setIsAddBrandModalOpen(false);
            setMessage("");
          }
        }}
        newBrand={newBrand}
        setNewBrand={setNewBrand}
        imagePreview={imagePreview}
        onImageChange={handleImageChange}
        onSubmit={handleAddBrand}
        isSubmitting={isSubmitting}
        message={message}
      />

      <EditBrandModal
        isOpen={isEditBrandModalOpen}
        onClose={() => {
          if (!isSubmitting) {
            setIsEditBrandModalOpen(false);
            setEditingBrand(null);
            setMessage("");
          }
        }}
        editingBrand={editingBrand}
        newBrand={newBrand}
        setNewBrand={setNewBrand}
        imagePreview={imagePreview}
        onImageChange={handleImageChange}
        onSubmit={handleUpdateBrand}
        isSubmitting={isSubmitting}
        message={message}
      />

      <EditProductModal
        isOpen={isEditProductModalOpen}
        onClose={() => {
          if (!isSubmitting) {
            setIsEditProductModalOpen(false);
            setMessage("");
          }
        }}
        editingProduct={editingProduct}
        editProduct={editProduct}
        setEditProduct={setEditProduct}
        editProductImagePreview={editProductImagePreview}
        onImageChange={handleEditProductImageChange}
        brandsForSelect={brandsForSelect}
        categories={categories}
        onSubmit={handleUpdateProduct}
        isSubmitting={isSubmitting}
        message={message}
      />

      <DeleteProductConfirmModal
        isOpen={isDeleteProductConfirmModalOpen}
        onClose={() => {
          if (!isSubmitting) {
            setIsDeleteProductConfirmModalOpen(false);
            setMessage("");
            setDeletingProduct(null);
            setProductHasStock(false);
          }
        }}
        deletingProduct={deletingProduct}
        productHasStock={productHasStock}
        onConfirm={handleConfirmDeleteProduct}
        isSubmitting={isSubmitting}
        message={message}
      />

      <DeleteBrandConfirmModal
        isOpen={isDeleteConfirmModalOpen}
        onClose={() => {
          if (!isSubmitting) {
            setIsDeleteConfirmModalOpen(false);
            setDeletingBrand(null);
            setMessage("");
          }
        }}
        deletingBrand={deletingBrand}
        onConfirm={handleConfirmDelete}
        isSubmitting={isSubmitting}
        message={message}
      />

      {/* Модальные окна для категорий */}
      <AddCategoryModal
        isOpen={isAddCategoryModalOpen}
        onClose={() => {
          if (!isSubmitting) {
            setIsAddCategoryModalOpen(false);
            setMessage("");
          }
        }}
        newCategory={newCategory}
        setNewCategory={setNewCategory}
        onSubmit={handleAddCategory}
        isSubmitting={isSubmitting}
        message={message}
      />

      <EditCategoryModal
        isOpen={isEditCategoryModalOpen}
        onClose={() => {
          if (!isSubmitting) {
            setIsEditCategoryModalOpen(false);
            setEditingCategory(null);
            setMessage("");
          }
        }}
        editingCategory={editingCategory}
        newCategory={newCategory}
        setNewCategory={setNewCategory}
        onSubmit={handleUpdateCategory}
        isSubmitting={isSubmitting}
        message={message}
      />

      <DeleteCategoryConfirmModal
        isOpen={isDeleteCategoryConfirmModalOpen}
        onClose={() => {
          if (!isSubmitting) {
            setIsDeleteCategoryConfirmModalOpen(false);
            setDeletingCategory(null);
            setMessage("");
          }
        }}
        deletingCategory={deletingCategory}
        onConfirm={handleConfirmDeleteCategory}
        isSubmitting={isSubmitting}
        message={message}
      />

      {/* Модальные окна для администраторов */}
      <AddAdministratorModal
        isOpen={isAddAdministratorModalOpen}
        onClose={() => {
          if (!isSubmitting) {
            setIsAddAdministratorModalOpen(false);
            setSearchResults([]);
            setMessage("");
          }
        }}
        onSearch={handleSearchUsers}
        searchResults={searchResults}
        searchLoading={searchLoading}
        onPromote={handlePromoteToAdmin}
        isSubmitting={isSubmitting}
        message={message}
      />

      <RemoveAdminConfirmModal
        isOpen={isRemoveAdminConfirmModalOpen}
        onClose={() => {
          if (!isSubmitting) {
            setIsRemoveAdminConfirmModalOpen(false);
            setRemovingAdmin(null);
            setMessage("");
          }
        }}
        removingAdmin={removingAdmin}
        onConfirm={handleConfirmRemoveAdmin}
        isSubmitting={isSubmitting}
        message={message}
      />

      {/* Модальные окна промокодов */}
      <AddPromoCodeModal
        isOpen={isAddPromoCodeModalOpen}
        onClose={() => {
          if (!isSubmitting) {
            setIsAddPromoCodeModalOpen(false);
            setMessage("");
            setNewPromoCode({
              code: "",
              discount_percent: null,
              discount_amount: null,
              valid_from: null,
              valid_to: null,
              min_order_price: null,
              usage_limit: null
            });
          }
        }}
        newPromoCode={newPromoCode}
        setNewPromoCode={setNewPromoCode}
        onSubmit={handleAddPromoCode}
        isSubmitting={isSubmitting}
        message={message}
      />

      <EditPromoCodeModal
        isOpen={isEditPromoCodeModalOpen}
        onClose={() => {
          if (!isSubmitting) {
            setIsEditPromoCodeModalOpen(false);
            setEditingPromoCode(null);
            setMessage("");
            setNewPromoCode({
              code: "",
              discount_percent: null,
              discount_amount: null,
              valid_from: null,
              valid_to: null,
              min_order_price: null,
              usage_limit: null
            });
          }
        }}
        editingPromoCode={editingPromoCode}
        newPromoCode={newPromoCode}
        setNewPromoCode={setNewPromoCode}
        onSubmit={handleUpdatePromoCode}
        isSubmitting={isSubmitting}
        message={message}
      />

      <DeletePromoCodeConfirmModal
        isOpen={isDeletePromoCodeConfirmModalOpen}
        onClose={() => {
          if (!isSubmitting) {
            setIsDeletePromoCodeConfirmModalOpen(false);
            setDeletingPromoCode(null);
            setMessage("");
          }
        }}
        deletingPromoCode={deletingPromoCode}
        onConfirm={handleConfirmDeletePromoCode}
        isSubmitting={isSubmitting}
        message={message}
      />
    </div>
  );
}

export default AdminCabinet;
