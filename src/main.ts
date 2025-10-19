import './scss/styles.scss';
import { Catalog } from './components/models/Catalog';
import { Cart } from './components/models/Cart';
import { Customer } from './components/models/Customer';
import { cloneTemplate, ensureElement } from "./utils/utils";
import { EventEmitter } from "./components/base/Events";
import { Modal } from './components/reperclasess/modal';
import { CatalogCard } from './components/reperclasess/cards/CatalogCard';
import { PreviewCard } from './components/reperclasess/cards/PreviewCard';
import { BasketCard } from './components/reperclasess/cards/basketCard';
import { OrderForm } from './components/reperclasess/forms/OrderForm';
import { ContactsForm } from './components/reperclasess/forms/ContactsForm';
import { ApiClient } from './components/base/ApiClient';
import { Api } from './components/base/Api';
import { API_URL, CDN_URL } from './utils/constants';
import { Gallery } from './components/reperclasess/Gallery';
import { Header } from './components/reperclasess/header'; 
import { BasketView } from './components/reperclasess/BasketView'; 
import { OrderSucsess } from './components/reperclasess/OrderSucsess';
import { IProduct } from './types';

// Брокер событий
const events = new EventEmitter();

// DOM ссылки и шаблоны
const templates = {
  gallery: ensureElement<HTMLElement>('.gallery'),
  modalContainer: ensureElement<HTMLElement>('#modal-container'),
  header: ensureElement<HTMLElement>('.header'),
  cardCatalog: ensureElement<HTMLTemplateElement>('#card-catalog'),
  cardPreview: ensureElement<HTMLTemplateElement>('#card-preview'),
  basket: ensureElement<HTMLTemplateElement>('#basket'),
  cardBasket: ensureElement<HTMLTemplateElement>('#card-basket'),
  order: ensureElement<HTMLTemplateElement>('#order'),
  contacts: ensureElement<HTMLTemplateElement>('#contacts'),
  success: ensureElement<HTMLTemplateElement>('#success'),
};

// Модели данных
const catalogModel = new Catalog();
const cartModel = new Cart();
const customerModel = new Customer();

// Представления
const catalogView = new Gallery(templates.gallery);
const modal = new Modal(templates.modalContainer, () => events.emit('modal:closed'));
const headerView = new Header(events, templates.header);

// API клиент
const apiClient = new ApiClient(new Api(API_URL));

// Загрузка каталога
apiClient
  .getProducts()
  .then((products: IProduct[]) => {
    catalogModel.setProducts(products);
    events.emit('catalog:changed');
    console.log('[catalog:loaded]', { count: products.length });
  })
  .catch((err: Error) => console.error('Ошибка загрузки каталога:', err));


events.on('catalog:changed', () => { 
  const items = catalogModel.getProducts(); 
  const nodes = items.map((product) => { 
    const node = cloneTemplate<HTMLElement>(templates.cardCatalog); 
    const card = new CatalogCard(node, (id) => 
      events.emit('product:selected', { id }) 
    ); 
     
    // ИСПОЛЬЗОВАТЬ СЕТТЕРЫ НАПРЯМУЮ
    card.id = product.id;
    card.title = product.title;
    card.category = product.category;
    card.image = `${CDN_URL}${product.image}`;
    card.price = product.price;
     
    return card.render(); 
  }); 
  catalogView.setItems(nodes); 
});


// Выбор товара - теперь принимаем объект
events.on('product:selected', (data: { id: string }) => {
  const product = catalogModel.getProductById(data.id);
  if (!product) {
    console.warn('Product not found:', data.id);
    return;
  }
  
  const previewElement = cloneTemplate<HTMLElement>(templates.cardPreview);
  
  const preview = new PreviewCard(previewElement, () => {
    const isInCart = cartModel.hasItem(data.id);
    if (isInCart) {
      cartModel.removeItemById(data.id);
    } else if (product.price !== null) {
      cartModel.addItem(product);
    }
    preview.cart = cartModel.hasItem(data.id);
    events.emit('cart:changed');
  });
  
  // Устанавливаем свойства через сеттеры
  preview.id = product.id;
  preview.title = product.title;
  preview.category = product.category;
  preview.price = product.price;
  preview.description = product.description;
  preview.image = `${CDN_URL}${product.image}`;
  preview.cart = cartModel.hasItem(product.id);
  preview.priceless = product.price === null;
  
  modal.open(preview.render());
});
// Корзина
events.on('cart:changed', () => {
  const count = cartModel.getItemsCount();
  headerView.counter = count;
  
});


  events.on('basket:open', () => {
  const basketNode = cloneTemplate<HTMLElement>(templates.basket);
  const basketView = new BasketView(basketNode, events);
  
  // Функция для перерендера корзины
  const renderBasket = () => {
    const basketItems = cartModel.getItems().map((product: IProduct, index: number) => {
      const itemElement = cloneTemplate<HTMLElement>(templates.cardBasket);
      const basketCard = new BasketCard(itemElement, (id: string) => {
        cartModel.removeItemById(id);
        events.emit('cart:changed');
        renderBasket(); // Перерендерим после удаления
      });

      basketCard.id = product.id;
      basketCard.title = product.title;
      basketCard.price = product.price;
      basketCard.index = index + 1;
      
      return basketCard.render();
    });

    basketView.basketList = basketItems;
    basketView.total = cartModel.getTotalPrice();
    basketView.state = basketItems.length === 0;
  };

  // Первоначальный рендер
  renderBasket();
  
  modal.open(basketView.render());
});

// Оформление заказа: Order -> Contacts 
events.on('order:open', () => { 
  // Проверяем, что корзина не пустая 
  if (cartModel.getItemsCount() === 0) { 
    events.emit('notification:show');
    return; 
  } 
 
  const node = cloneTemplate<HTMLElement>(templates.order); 
  const orderForm = new OrderForm( 
    node, 
    () => { 
      // ПЕРВЫЙ ШАГ: Проверка при нажатии "Далее"
      const validation = customerModel.validateOrder(); 
      
      if (validation.isValid) { 
        events.emit('contacts:open'); 
      } else {
        orderForm.errors = validation.errors;
      } 
    }, 
    (data) => { 
      // ОБРАБОТКА ИЗМЕНЕНИЙ: при выборе оплаты или вводе адреса
      customerModel.setData({ address: data.address, payment: data.payment }); 
      
      // Валидация при каждом изменении
      const validation = customerModel.validateOrder(); 
      
      // Кнопка "Далее" активна только когда форма валидна
      orderForm.disabled = !validation.isValid;
      orderForm.errors = validation.errors; 
    } 
  ); 
   
  // Установить начальные ошибки/состояние при открытии шага 
  const initialData = customerModel.getData(); 
  const initialOrderValidation = customerModel.validateOrder(); 
   
  orderForm.payment = initialData.payment;
  orderForm.address = initialData.address;
  orderForm.disabled = !initialOrderValidation.isValid;
  orderForm.errors = initialOrderValidation.errors;
   
  modal.open(orderForm.render()); 
});
   
  
  events.on('contacts:open', () => { 
  const node = cloneTemplate<HTMLElement>(templates.contacts); 
  const contactsForm = new ContactsForm( 
    node, 
    () => { 
      // ВТОРОЙ ШАГ: Проверка при нажатии "Оплатить"
      const validation = contactsForm.validateContacts(); 
      
      if (validation.isValid) { 
        events.emit('order:success'); 
      } else {
        // Показываем ошибки валидации
        contactsForm.errors = validation.errors;
      } 
    },
    (data) => {
      // ОБРАБОТКА ИЗМЕНЕНИЙ: сохраняем данные и обновляем состояние
      customerModel.setData({ email: data.email, phone: data.phone });
      
      // Валидация при каждом изменении
      const validation = contactsForm.validateContacts();
      
      // Кнопка "Оплатить" активна только когда форма валидна
      contactsForm.disabled = !validation.isValid;
      contactsForm.errors = validation.errors;
    }
  ); 
   
  // Установить начальные значения
  const initialContacts = customerModel.contacts; 
  const initialValidation = contactsForm.validateContacts();
  
  contactsForm.email = initialContacts.email;
  contactsForm.phone = initialContacts.phone;
  contactsForm.disabled = !initialValidation.isValid;
  contactsForm.errors = initialValidation.errors;
   
  modal.open(contactsForm.render()); 
});

// Исправленный обработчик order:success
events.on('order:success', () => { 
  // Финальная проверка через модель Customer
  
  const items = cartModel.getItems().map((p) => p.id); 
  const total = cartModel.getTotalPrice(); 
 
  const payload = { 
    ...customerModel.getData(), 
    items, 
    total, 
  }; 
 
  console.log('[order:create:request]', payload); 
 
  apiClient 
    .createOrder(payload) 
    .then((response) => { 
      console.log('[order:create:success]', response); 
       
      const orderSuccess = new OrderSucsess(templates.success, () => { 
        modal.close(); 
      }); 
       
      orderSuccess.updateTotalAmount(response.total); 
      modal.open(orderSuccess.render()); 
       
      // Товары удаляются из корзины
      cartModel.clear(); 
      // Данные покупателя очищаются
      customerModel.clear(); 
      
      // Обновляем счетчик корзины
      events.emit('cart:changed');
    }) 
    .catch((err) => { 
      console.error('[order:create:error]', err); 
      events.emit('notification:show');
    }); 
});