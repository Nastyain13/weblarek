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
import { OrderSucsess } from './components/reperclasess/OrderSucsess';

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

events.on('catalog:changed', () => {
  const items = catalogModel.getProducts();
  const nodes = items.map((product) => {
    const node = cloneTemplate<HTMLElement>(cardCatalogTemplate);
    const card = new CatalogCard(node, (id) =>
      events.emit('view:product:selected', { id })
    );
    
    Object.assign(card, {
        id: product.id,
        title: product.title,
        category: product.category,
        image: `${CDN_URL}${product.image}`,
        price: product.price
    });
    
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
    const alreadyInCart = cartModel.hasItem(id);
    if (alreadyInCart) {
      cartModel.removeItemById(id);
    } else {
      if (product.price !== null) {
        cartModel.addItem(product);
      }
    }
    preview.cart = cartModel.hasItem(id);
  });
  
  Object.assign(preview, {
    id: product.id,
    title: product.title,
    price: product.price,
    description: product.description,
    image: `${CDN_URL}${product.image}`,
    cart: cartModel.hasItem(product.id),
    priceless: product.price === null
  });
  
  modal.open(preview.render());
});

events.on('cart:changed', () => {
  
  
  const count = cartModel.getItemsCount();
  console.log('Товаров в корзине:', count);
  
 
  headerView.counter = count;
  console.log('Счетчик установлен в headerView:', count);
});

// Рендер корзины
events.on('basket:open', () => {
  const basketNode = cloneTemplate<HTMLElement>(basketTemplate);
  
  const basketItems = cartModel.getItems().map((product, index) => {
    const itemElement = cloneTemplate<HTMLElement>(cardBasketTemplate);
    const basketCard = new BasketCard(itemElement, (id: string) => {
      console.log('[cart:item:remove]', id);
      cartModel.removeItemById(id);
    });

    Object.assign(basketCard, {
      id: product.id,
      title: product.title,
      price: product.price,
      index: index + 1
    });
    
    return basketCard.render();
  });

  const total = cartModel.getTotalPrice();

  const basketView = new BasketView(basketNode, () => {
    events.emit('order:open');
  });
  
  basketView.items = basketItems;
  basketView.total = total;
  
  modal.open(basketView.render());
});

// Оформление заказа: Order -> Contacts
events.on('order:open', () => {
  
  // Проверяем, что корзина не пустая
  if (cartModel.getItemsCount() === 0) {
    
    return;
  }

  const node = cloneTemplate<HTMLElement>(orderTemplate);
  const orderForm = new OrderForm(
    node,
    () => {
      const validation = customerModel.validateOrder();
      
      if (validation.isValid) {
        events.emit('contacts:open');
      } else {
        Object.assign(orderForm, { errors: validation.errors });
      }
    },
    (data) => {
      
      
      customerModel.setData({ address: data.address, payment: data.payment });
      const { isValid, errors } = customerModel.validateOrder();
      
      
      Object.assign(orderForm, { 
        disabled: !isValid,
        errors: errors
      });
    }
  );
  
  // Установить начальные ошибки/состояние при открытии шага
  const initialData = customerModel.getData();
  const initialOrderValidation = customerModel.validateOrder();
  
  Object.assign(orderForm, {
    payment: initialData.payment,
    address: initialData.address,
    disabled: !initialOrderValidation.isValid,
    errors: initialOrderValidation.errors
  });
  
  modal.open(orderForm.render());
});


  
 
  events.on('contacts:open', () => {
  const node = cloneTemplate<HTMLElement>(contactsTemplate);
  const contactsForm = new ContactsForm(
    node,
    () => {
      const contactsData = customerModel.contacts;
      const isEmailFilled = contactsData.email.trim() !== '';
      const isPhoneFilled = contactsData.phone.trim() !== '';
      
      if (isEmailFilled && isPhoneFilled) {
        events.emit('order:success');
      } else {
        
      }
    }
  );
  
  const emailInput = node.querySelector<HTMLInputElement>('input[name="email"]');
  const phoneInput = node.querySelector<HTMLInputElement>('input[name="phone"]');
  
  if (emailInput && phoneInput) {
    const handleInput = () => {
      const data = {
        email: emailInput.value,
        phone: phoneInput.value
      };
      
      customerModel.setData({ email: data.email, phone: data.phone });
      
      const isEmailFilled = data.email && data.email.trim() !== '';
      const isPhoneFilled = data.phone && data.phone.trim() !== '';
      const isValid = isEmailFilled && isPhoneFilled;
      
      Object.assign(contactsForm, {
        disabled: !isValid,
      });
    };
    
    emailInput.addEventListener('input', handleInput);
    phoneInput.addEventListener('input', handleInput);
  }
  
  const initialContacts = customerModel.contacts;
  const isInitialEmailFilled = initialContacts.email.trim() !== '';
  const isInitialPhoneFilled = initialContacts.phone.trim() !== '';
  const isInitialValid = isInitialEmailFilled && isInitialPhoneFilled;
  
  Object.assign(contactsForm, {
    email: initialContacts.email,
    phone: initialContacts.phone,
    disabled: !isInitialValid,
  });
  
  modal.open(contactsForm.render());
});
events.on('order:success', () => {
  
  
  // Финальная проверка всех данных
  const orderData = customerModel.getData();
  const isAddressFilled = orderData.address && orderData.address.trim() !== '';
  const isEmailFilled = orderData.email && orderData.email.trim() !== '';
  const isPhoneFilled = orderData.phone && orderData.phone.trim() !== '';
  
 
  
  if (!isAddressFilled || !isEmailFilled || !isPhoneFilled) {
    return;
  }

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
      
      
      const orderSuccess = new OrderSucsess(successTemplate, () => {
        modal.close();
      });
      
      orderSuccess.updateTotalAmount(response.total);
      modal.open(orderSuccess.render());
      
      cartModel.clear();
      customerModel.clear();
    })
    .catch((err) => {
      console.error('[order:create:error]', err);
      
      
      const orderSuccess = new OrderSucsess(successTemplate, () => {
        modal.close();
      });
      
      modal.open(orderSuccess.render());
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