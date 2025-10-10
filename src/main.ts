import './scss/styles.scss';
import { Catalog } from './components/models/Catalog';
import { Cart } from './components/models/Cart';
import { Customer } from './components/models/Customer';
import { IProduct, TPayment } from './types';
import { cloneTemplate, ensureElement } from "./utils/utils";
import { EventEmitter } from "./components/base/Events";
import { Modal } from './components/reperclasess/modal';
import { CatalogCard } from './components/reperclasess/CatalogCard';
import { CatalogItem } from './components/reperclasess/cards/CatalogItem';
import { PreviewCard } from './components/reperclasess/cards/PreviewCard';
import { BasketCard } from './components/reperclasess/basketCard';
import { OrderForm } from "./components/reperclasess/forms/OrderForm";
import { ContactsForm } from "./components/reperclasess/forms/ContactsForm";
import { ApiClient } from './components/base/ApiClient';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';

// События
const events = new EventEmitter();

// Модели данных
const catalogModel = new Catalog();
const cartModel = new Cart();
const customerModel = new Customer();

// DOM элементы
const galleryContainer = ensureElement<HTMLElement>('.gallery');
const modalContainer = ensureElement<HTMLElement>('#modal-container');
const basketCounter = ensureElement<HTMLElement>('.header__basket-counter');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Представления
const modal = new Modal(modalContainer, () => {
    events.emit('modal:closed');
});

const catalogView = new CatalogCard(galleryContainer);

// API клиент
const baseApi = new Api(API_URL);
const apiClient = new ApiClient(baseApi);


// Изменение каталога товаров
(catalogModel as any).on('catalog:changed', (products: IProduct[]) => {
    console.log('Каталог обновлен, товаров:', products.length);
    
    const productCards: HTMLElement[] = [];
    products.forEach(product => {
        const cardElement = cloneTemplate<HTMLElement>(cardCatalogTemplate);
        
        const catalogItem = new CatalogItem(cardElement);
        catalogItem.onClick(() => {
            events.emit('product:select', { id: product.id });
        });
        catalogItem.product = product;
        productCards.push(cardElement);
    });

    catalogView.setItems(productCards);
});

// Изменение выбранного товара
(catalogModel as any).on('product:selected', (product: IProduct) => {
    const previewElement = cloneTemplate<HTMLElement>(cardPreviewTemplate);
    const previewCard = new PreviewCard(previewElement, () => {
        events.emit('product:addToCart', { id: product.id });
    });

    previewCard.product = product;
    previewCard.description = product.description;

    modal.open(previewElement);
});

// Изменение содержимого корзины
function updateBasketCounter() {
    basketCounter.textContent = cartModel.getItemsCount().toString();
}

// Обновляем счетчик при удалении товара
events.on('product:removeFromCart', (data: { id: string }) => {
    cartModel.removeItemById(data.id);
    updateBasketCounter(); 
});

// Изменение данных покупателя
(customerModel as any).on('customer:changed', () => {
    console.log('Данные покупателя обновлены:', customerModel.getCurrentData());
});

// Выбор карточки для просмотра
events.on('product:select', (data: { id: string }) => {
    const product = catalogModel.getProductById(data.id);
    if (product) {
        catalogModel.setSelectedProduct(product);
    }
});

// Нажатие кнопки покупки товара
events.on('product:addToCart', (data: { id: string }) => {
    const product = catalogModel.getProductById(data.id);
    if (product && product.price !== null) {
        cartModel.addItem(product);
        updateBasketCounter();
        modal.close();
    }
});

// Нажатие кнопки удаления товара из корзины
events.on('product:removeFromCart', (data: { id: string }) => {
    cartModel.removeItemById(data.id); 
});

// Открытие корзины
events.on('basket:open', () => {
    const basketElement = cloneTemplate<HTMLElement>(basketTemplate);
    
    const basketItems: HTMLElement[] = [];
    cartModel.getItems().forEach((item, index) => {
        const itemElement = cloneTemplate<HTMLElement>(cardBasketTemplate);
        const basketCard = new BasketCard(itemElement, () => {
            events.emit('product:removeFromCart', { id: item.id });
        });

        basketCard.product = item;
        basketCard.index = index + 1;
        basketItems.push(itemElement);
    });

    // Обновляем корзину
    const itemsContainer = basketElement.querySelector('.basket__list');
    const totalElement = basketElement.querySelector('.basket__price');
    const checkoutButton = basketElement.querySelector('.basket__button');
    
    if (itemsContainer) {
        itemsContainer.innerHTML = '';
        basketItems.forEach(item => itemsContainer.appendChild(item));
    }
    
    if (totalElement) {
        totalElement.textContent = `${cartModel.getTotalPrice()} синапсов`;
    }
    
    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            events.emit('order:start');
        });
    }

    modal.open(basketElement);
});

// Нажатие кнопки оформления заказа
events.on('order:start', () => {
    const orderElement = cloneTemplate<HTMLElement>(orderTemplate);
    
    const orderFormElement = orderElement.querySelector('form');
    if (orderFormElement) {
        const orderForm = new OrderForm(orderFormElement as HTMLFormElement, () => {
            events.emit('order:submit');
        }, (data: any) => {
            if (data.payment) customerModel.setPayment(data.payment as TPayment);
            if (data.address) customerModel.setAddress(data.address);
        });

        // Используем orderForm для установки данных
        const customerData = customerModel.getCurrentData();
        if (customerData.payment) {
            orderForm.setPayment(customerData.payment);
        }
        if (customerData.address) {
            orderForm.setAddress(customerData.address);
        }
        
        modal.open(orderElement);
    }
});

// Нажатие кнопки перехода 
events.on('order:submit', () => {
    const contactsElement = cloneTemplate<HTMLElement>(contactsTemplate);
    
    const contactsFormElement = contactsElement.querySelector('form');
    if (contactsFormElement) {
        const contactsForm = new ContactsForm(contactsFormElement as HTMLFormElement, () => {
            events.emit('order:complete');
        }, (data: any) => {
            if (data.email) customerModel.setEmail(data.email);
            if (data.phone) customerModel.setPhone(data.phone);
        });

        // Используем contactsForm для установки данных
        const customerData = customerModel.getCurrentData();
        if (customerData.email) {
            contactsForm.setEmail(customerData.email);
        }
        if (customerData.phone) {
            contactsForm.setPhone(customerData.phone);
        }
        
        modal.open(contactsElement);
    }
});

// Нажатие кнопки оплаты/завершения оформления заказа
events.on('order:complete', () => {
    const successElement = cloneTemplate<HTMLElement>(successTemplate);
        
    modal.open(successElement);
    cartModel.clear();
    customerModel.clear();
    updateBasketCounter();
});

// Изменение данных в формах
events.on('order:input', (data: { payment?: TPayment; address?: string }) => {
    if (data.payment) customerModel.setPayment(data.payment);
    if (data.address) customerModel.setAddress(data.address);
});

events.on('contacts:input', (data: { email?: string; phone?: string }) => {
    if (data.email) customerModel.setEmail(data.email);
    if (data.phone) customerModel.setPhone(data.phone);
});

// Загрузка каталога с сервера
async function initializeApp() {
    try {
        const products = await apiClient.getProducts();
        catalogModel.setProducts(products);
        console.log('Каталог загружен с сервера, товаров:', products.length);
    } catch (error) {
        console.error('Ошибка загрузки каталога:', error);
    }
}

// Запуск приложения
initializeApp();