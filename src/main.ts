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
import { API_URL } from './utils/constants';
import { Gallery } from './components/reperclasess/Gallery';
import { CDN_URL } from "./utils/constants";
import { Header } from './components/reperclasess/header'; 
import { BasketView} from './components/reperclasess/BasketView'; 

// Брокер событий
const events = new EventEmitter();

// DOM ссылки и шаблоны
const gallery = ensureElement<HTMLElement>('.gallery');
const modalContainer = ensureElement<HTMLElement>('#modal-container');
const headerContainer = ensureElement<HTMLElement>('.header'); 
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модели данных
const catalogModel = new Catalog();
const cartModel = new Cart();
const customerModel = new Customer();

// Представления
const catalogView = new Gallery(gallery);
const modal = new Modal(modalContainer, () =>
  events.emit('modal:closed')
);
const headerView = new Header(events, headerContainer); 

// API клиент
const baseApi = new Api(API_URL);
const apiClient = new ApiClient(baseApi);

// Рендер каталога
events.on('catalog:changed', () => {
  const items = catalogModel.getProducts();
  const nodes = items.map((p) => {
    const node = cloneTemplate<HTMLElement>(cardCatalogTemplate);
    const card = new CatalogCard(node, (id) =>
      events.emit('view:product:selected', { id })
    );
    card.setId(p.id);
    card.setTitle(p.title);
    card.setCategory(p.category);
    card.setImageSrc(`${CDN_URL}${p.image}`, p.title);
    card.setPrice(p.price);
    return card.render();
  });
  catalogView.setItems(nodes);
});

// Открытие предпросмотра
events.on('view:product:selected', ({ id }: { id: string }) => {
  const product = catalogModel.getProductById(id);
  if (!product) return;
  
  const node = cloneTemplate<HTMLElement>(cardPreviewTemplate);
  const preview = new PreviewCard(node, () => {
    // Переключение добавления/удаления из корзины
    const alreadyInCart = cartModel.hasItem(id);
    if (alreadyInCart) {
      cartModel.removeItemById(id);
    } else {
      cartModel.addItem(product);
    }
    // Обновление состояния кнопки после действия
    preview.setCart(cartModel.hasItem(id));
  });
  
  preview.setId(product.id);
  preview.setTitle(product.title);
  preview.setPrice(product.price);
  preview.setCart(cartModel.hasItem(product.id));
  preview.setDescription(product.description);
  modal.open(preview.render());
});

// Обновление счётчика корзины
events.on('cart:changed', () => {
  // Используем Header для обновления счетчика
  headerView.counter = cartModel.getItemsCount();
  
  console.log('[cart:changed]', {
    count: cartModel.getItemsCount(),
    total: cartModel.getTotalPrice(),
    items: cartModel.getItems().map((i) => i.id),
  });
  
  const isModalOpen = modalContainer.classList.contains('modal_active');
  const isBasketVisible = Boolean(modalContainer.querySelector('.basket'));
  if (isModalOpen && isBasketVisible) {
    events.emit('basket:open');
  }
});
// Рендер корзины
events.on('basket:open', () => {
  const basketNode = cloneTemplate<HTMLElement>(basketTemplate);
  
  // Создаем элементы товаров в корзине
  const basketItems = cartModel.getItems().map((product, index) => {
    const itemElement = cloneTemplate<HTMLElement>(cardBasketTemplate);
    const basketCard = new BasketCard(itemElement, (id: string) => {
      console.log('[cart:item:remove]', id);
      cartModel.removeItemById(id);
    });

    basketCard.setId(product.id);
    basketCard.setTitle(product.title);
    basketCard.setPrice(product.price);
    basketCard.setIndex(index + 1);
    
    console.log('[cart:item]', { 
      id: product.id, 
      title: product.title, 
      price: product.price 
    });
    
    return basketCard.render();
  });

  const total = cartModel.getTotalPrice();
  console.log('[basket:open]', { 
    items: cartModel.getItems(), 
    total 
  });

  
  const basketView = new BasketView(basketNode, () => {
    events.emit('order:open');
  });
  
  basketView.items = basketItems;
  basketView.total = total;
  
  modal.open(basketView.render());
});
//  оформления заказа: Order -> Contacts
events.on('order:open', () => {
  const node = cloneTemplate<HTMLElement>(orderTemplate);
  const orderForm = new OrderForm(
    node,
    () => events.emit('contacts:open'),
    (data) => {
      customerModel.setData({ address: data.address, payment: data.payment });
      const { isValid, errors } = customerModel.validate();
      orderForm.setDisabled(!isValid);
      orderForm.setErrors({ address: errors.address as string });
      console.log('[customer:update:order]', customerModel.getData());
    }
  );
  
  // Установить начальные ошибки/состояние при открытии шага
  const initialOrderValidation = customerModel.validate();
  orderForm.setDisabled(!initialOrderValidation.isValid);
  orderForm.setErrors({ address: initialOrderValidation.errors.address as string });
  modal.open(orderForm.render());
});

events.on('contacts:open', () => {
  const node = cloneTemplate<HTMLElement>(contactsTemplate);
  const contactsForm = new ContactsForm(
    node,
    () => events.emit('order:success'),
    (data) => {
      customerModel.setData({ email: data.email, phone: data.phone });
      const { isValid, errors } = customerModel.validate();
      contactsForm.setDisabled(!isValid);
      contactsForm.setErrors({
        email: errors.email as string,
        phone: errors.phone as string,
      });
      console.log('[customer:update:contacts]', customerModel.getData());
    }
  );
  
  // Начальная проверка контактов
  const initialContactsValidation = customerModel.validate();
  contactsForm.setDisabled(!initialContactsValidation.isValid);
  contactsForm.setErrors({
    email: initialContactsValidation.errors.email as string,
    phone: initialContactsValidation.errors.phone as string,
  });
  modal.open(contactsForm.render());
});

events.on('order:success', () => {
  const orderData = customerModel.getData();
  const items = cartModel.getItems().map((p) => p.id);
  const total = cartModel.getTotalPrice();

  const payload = {
    ...orderData,
    items,
    total,
  };

  console.log('[order:create:request]', payload);

  apiClient
    .createOrder(payload)
    .then((response) => {
      console.log('[order:create:success]', response);
      const node = cloneTemplate<HTMLElement>(successTemplate);
      const desc = node.querySelector<HTMLElement>('.order-success__description');
      if (desc) desc.textContent = `Списано ${response.total} синапсов`;
      node
        .querySelector('.order-success__close')!
        .addEventListener('click', () => {
          modal.close();
        });
      modal.open(node);
      cartModel.clear();
      customerModel.clear();
    })
    .catch((err) => {
      console.error('[order:create:error]', err);
      const node = cloneTemplate<HTMLElement>(successTemplate);
      const title = node.querySelector<HTMLElement>('.order-success__title');
      const desc = node.querySelector<HTMLElement>('.order-success__description');
      if (title) title.textContent = 'Ошибка оформления заказа';
      if (desc) desc.textContent = String(err ?? 'Неизвестная ошибка');
      node
        .querySelector('.order-success__close')!
        .addEventListener('click', () => {
          modal.close();
        });
      modal.open(node);
    });
});

// Загрузка каталога с сервера
apiClient
  .getProducts()
  .then((products) => {
    catalogModel.setProducts(products);
    events.emit('catalog:changed'); 
    console.log('[catalog:loaded]', { count: products.length });
  })
  .catch((err) => {
    console.error('Ошибка загрузки каталога с сервера', err);
  });