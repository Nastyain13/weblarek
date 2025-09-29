import './scss/styles.scss';
import { Catalog } from './components/models/Catalog';
import { Cart } from './components/models/Cart';
import { Customer } from './components/models/Customer';
import { apiProducts } from './utils/data';
import { ApiClient } from './components/base/ApiClient';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';



// Создаем экземпляры классов
const catalogModel = new Catalog();
const cartModel = new Cart();
const customerModel = new Customer();



// КАТАЛОГ
// Сохраняем товары из apiProducts
catalogModel.setProducts(apiProducts.items);
console.log('setProducts(apiProducts.items) - выполнено');

// Получаем массив товаров
const catalogProducts = catalogModel.getProducts();
console.log(' getProducts() - массив товаров из каталога: ', catalogProducts);
console.log(' Количество товаров в каталоге: ', catalogProducts.length);

// Тестируем поиск товара по ID
const testProductId = apiProducts.items[0].id;
const foundProduct = catalogModel.getProductById(testProductId);
console.log(`getProductById("${testProductId}") - найден товар: `, foundProduct?.title);

// Тестируем выбор товара для подробного отображения
if (foundProduct) {
    catalogModel.setSelectedProduct(foundProduct);
    console.log(' setSelectedProduct() - товар установлен для подробного отображения');
} else {
    console.log(' Товар не найден');
}

// ТЕСТИРОВАНИЕ КОРЗИНЫ
// Проверка начального состояния
console.log(' Начальное состояние - корзина пуста: ', cartModel.getItemsCount() === 0);

// Добавляем товары в корзину
const productsToAdd = apiProducts.items.slice(0, 2); // Берем первые 2 товара
productsToAdd.forEach(product => {
    cartModel.addItem(product);
    console.log(`addItem() - добавлен товар: ${product.title}`);
});

// Проверяем содержимое корзины
const cartItems = cartModel.getItems();
console.log('getItems() - товары в корзине: ', cartItems.map(item => item.title));
console.log('getItemsCount() - количество товаров в корзине: ', cartModel.getItemsCount());
console.log('getTotalPrice() - общая стоимость корзины: ', cartModel.getTotalPrice());

// Проверяем наличие товара в корзине
const checkProductId = productsToAdd[0].id;
console.log(`hasItem("${checkProductId}") - товар в корзине: `, cartModel.hasItem(checkProductId));

// Тестируем удаление товара
if (productsToAdd.length > 0) {
    cartModel.removeItem(productsToAdd[0]);
    console.log(`removeItem() - удален товар: ${productsToAdd[0].title}`);
    console.log('Количество после удаления: ', cartModel.getItemsCount());
}

// Тестируем очистку корзины
cartModel.clear();
console.log(' clear() - корзина очищена');
console.log(' Количество после очистки: ', cartModel.getItemsCount());

// покупатель


// Проверяем начальное состояние
console.log(' Начальное состояние - данные покупателя: ', customerModel.getCurrentData());
console.log(' isComplete() - все данные заполнены: ', customerModel.isComplete());

// Тестируем установку данных по частям
customerModel.setPayment('cash');
console.log('setPayment("cash") - способ оплаты установлен');

customerModel.setEmail('ivanova@example.com');
console.log(' setEmail() - email установлен');

customerModel.setPhone('+79990000000');
console.log('setPhone() - телефон установлен');

customerModel.setAddress('Москва, ул. Жизненная, д. 1');
console.log(' setAddress() - адрес установлен');

// Проверяем текущие данные
console.log(' getCurrentData() - текущие данные покупателя: ', customerModel.getCurrentData());
console.log(' isComplete() - все данные заполнены: ', customerModel.isComplete());

// Тестируем валидацию
const validation = customerModel.validate();
console.log(' validate() - валидация данных: ', validation);

// Тестируем валидацию отдельных полей
const emailValidation = customerModel.validateField('email');
console.log('validateField("email") - валидация email: ', emailValidation);

// Тестируем очистку данных
customerModel.clear();
console.log('clear() - данные покупателя очищены');
console.log('Данные после очистки: ', customerModel.getCurrentData());
console.log('isComplete() после очистки: ', customerModel.isComplete());


// Создаем экземпляр ApiClient 
const baseApi = new Api(API_URL);
const apiClient = new ApiClient(baseApi);

// Выполняем запрос на сервер для получения каталога товаров
async function loadCatalogFromServer() {
    try {
        // Метод getProducts() делает GET запрос на /product/ и возвращает массив товаров
        const productsFromServer = await apiClient.getProducts();
        
        console.log('Каталог товаров получен с сервера');
        console.log('Получено товаров:', productsFromServer.length);
        
        // Сохраняем полученный массив в модель Catalog
        catalogModel.setProducts(productsFromServer);
        console.log('Каталог сохранен в модель данных');
        
        // Выводим только что сохранённый каталог в консоль для проверки
        const savedCatalog = catalogModel.getProducts();
        console.log('Каталог после сохранения из сервера:', savedCatalog);
        console.log('Количество товаров в каталоге:', savedCatalog.length);
        
        // Проверяем работу методов Catalog
        if (savedCatalog.length > 0) {
            const firstProduct = savedCatalog[0];
            
            // Проверяем поиск по ID
            const foundById = catalogModel.getProductById(firstProduct.id);
            console.log('getProductById() работает:', foundById ? 'Успешно' : 'Ошибка');
            
            // Проверяем установку выбранного товара
            catalogModel.setSelectedProduct(firstProduct);
            const selected = catalogModel.getSelectedProduct();
            console.log('setSelectedProduct/getSelectedProduct работают:', selected ? 'Да' : 'Нет');
            
            // Проверяем работу с корзиной
            cartModel.addItem(firstProduct);
            console.log('addItem/hasItem работают:', cartModel.hasItem(firstProduct.id) ? 'Да' : 'Нет');
        }
        
        console.log('работает корректно');
        
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

// Запускаем загрузку каталога с сервера
loadCatalogFromServer();