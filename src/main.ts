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
import { OrderSuccess } from './components/reperclasess/OrderSucsess'; 
//import { IProduct } from './types'; 
import { IProduct,TPayment} from './types';

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

// Представления (создаем один раз)
const catalogView = new Gallery(templates.gallery); 
const modal = new Modal(templates.modalContainer, () => events.emit('modal:closed')); 
const headerView = new Header(events, templates.header); 
const basketView = new BasketView(cloneTemplate<HTMLElement>(templates.basket), events);


// API клиент 
const apiClient = new ApiClient(new Api(API_URL)); 

// Загрузка каталога 
apiClient 
  .getProducts() 
  .then((products: IProduct[]) => { 
    catalogModel.setProducts(products); 
  }) 
  .catch((err: Error) => console.error('Ошибка загрузки каталога:', err)); 

// Функция для рендеринга корзины
const renderBasket = () => {
  const items = cartModel.getItems();
  const total = cartModel.getTotalPrice();
  
  console.log(' renderBasket called, items:', items.length);
  
  if (items.length === 0) {
    // Корзина пуста
    basketView.state = true;
    basketView.total = 0;
  } else {
    // Есть товары в корзине
    const basketItems = items.map((product: IProduct, index: number) => {
      const itemElement = cloneTemplate<HTMLElement>(templates.cardBasket);
      
      // Создаем BasketCard с функцией onDelete
      const basketCard = new BasketCard(itemElement, () => {
        console.log(' Delete button clicked for product:', product.id);
        cartModel.removeItemById(product.id);
      });

      // Рендерим данные товара
      basketCard.render({
        id: product.id,
        title: product.title,
        price: product.price,
        category: product.category,
        image: product.image,
        description: product.description
      });

      // Устанавливаем индекс
      basketCard.index = index + 1;
      
      return itemElement;
    });

    basketView.basketList = basketItems;
    basketView.total = total;
    basketView.state = false;
  }
};

// Обработчики каталога
catalogModel.on('products:changed', (products: IProduct[]) => {  
  const nodes = products.map((product) => {  
    const node = cloneTemplate<HTMLElement>(templates.cardCatalog);  
    const card = new CatalogCard(node, () => {  
      catalogModel.setSelectedProduct(product);
    });  
      
    card.render({ 
      id: product.id,
      title: product.title,
      category: product.category,
      image: `${CDN_URL}${product.image}`,
      price: product.price
    });  
      
    return node;
  });  
  catalogView.setItems(nodes);  
}); 

// Превью товара
catalogModel.on('product:selected', (product: IProduct) => { 
  const previewElement = cloneTemplate<HTMLElement>(templates.cardPreview); 
   
  const preview = new PreviewCard(previewElement, () => { 
    events.emit('cart:toggle', { id: product.id });
  }); 

  preview.render({
    id: product.id,
    title: product.title,
    category: product.category,
    image: `${CDN_URL}${product.image}`,
    price: product.price,
    description: product.description,
  });

  preview.setButtonState(
    cartModel.hasItem(product.id),
    product.price === null  
  );
  
  modal.open(previewElement);
});

// Переключение корзины
events.on('cart:toggle', (data: { id: string }) => {
  console.log(' cart:toggle', data.id);
  
  const product = catalogModel.getProductById(data.id);
  if (!product) {
    console.log(' Product not found');
    return;
  }

  if (cartModel.hasItem(data.id)) {
    console.log(' Removing from cart');
    cartModel.removeItemById(data.id);
  } else {
    console.log('Adding to cart');
    cartModel.addItem(product);
  }
  
  modal.close();
});

// Обработчик изменения корзины
cartModel.on('cart:changed', () => {
  const count = cartModel.getItemsCount();
  const items = cartModel.getItems();
  
  console.log(' cart:changed event, count:', count, 'items:', items.length);
  
  // Обновляем счетчик в шапке
  headerView.counter = count;
  
  // Рендерим корзину
  renderBasket();
});

// Открытие корзины
events.on('basket:open', () => {
  console.log(' Opening basket');
  renderBasket();
  modal.open(basketView.render());
});

// Оформление заказа: Order -> Contacts  
events.on('order:open', () => {  
  const node = cloneTemplate<HTMLElement>(templates.order);  
  const orderForm = new OrderForm(  
    node,  
    () => {  
      events.emit('contacts:open');  
    },  
    (data) => {  
      events.emit('order:input', data);
    }  
  );  
    
  const initialData = customerModel.getData();  
  const validation = customerModel.validateOrder();
    
  orderForm.payment = initialData.payment as TPayment; 
  orderForm.address = initialData.address; 
  orderForm.disabled = !validation.isValid; 
  
  const errorsRecord: Record<string, string> = {};
  Object.entries(validation.errors).forEach(([key, value]) => {
    if (value) errorsRecord[key] = value;
  });
  orderForm.errors = errorsRecord;
  
  // Подписываемся на изменения модели
  const onCustomerChanged = () => {
    const validation = customerModel.validateOrder();
    const errorsRecord: Record<string, string> = {};
    Object.entries(validation.errors).forEach(([key, value]) => {
      if (value) errorsRecord[key] = value;
    });
    
    orderForm.disabled = !validation.isValid;
    orderForm.errors = errorsRecord;
  };
  
  customerModel.on('customer:changed', onCustomerChanged);
  
  // При закрытии модалки отписываемся
  const originalClose = modal.close.bind(modal);
  modal.close = () => {
    customerModel.off('customer:changed', onCustomerChanged);
    originalClose();
  };
  
  modal.open(orderForm.render());  
});

// Обработчик ввода данных в форме заказа
events.on('order:input', (data: Partial<{ address: string; payment: TPayment }>) => {
  // Только сохраняем данные в модель
  customerModel.setData(data);
  // Модель сама вызовет 'customer:changed', который обновит форму
});
let currentContactsForm: ContactsForm | null = null;

// Обработчик открытия формы контактов
events.on('contacts:open', () => {  
  const node = cloneTemplate<HTMLElement>(templates.contacts);  
  const contactsForm = new ContactsForm(  
    node,  
    () => {  
      events.emit('order:success');  
    }, 
    (data) => { 
      events.emit('contacts:input', data);
    } 
  );  
    
  const initialData = customerModel.getData();
  const validation = customerModel.validateContacts();
   
  contactsForm.email = initialData.email; 
  contactsForm.phone = initialData.phone; 
  contactsForm.disabled = !validation.isValid; 
  
  const errorsRecord: Record<string, string> = {};
  Object.entries(validation.errors).forEach(([key, value]) => {
    if (value) errorsRecord[key] = value;
  });
  contactsForm.errors = errorsRecord;
  
  currentContactsForm = contactsForm; // Сохраняем ссылку
  modal.open(contactsForm.render());  
});

// Обработчик ввода данных в форме контактов
events.on('contacts:input', (data: Partial<{ email: string; phone: string }>) => {
  customerModel.setData(data);
  const validation = customerModel.validateContacts();
  
  // Обновляем текущую открытую форму
  if (currentContactsForm) {
    const errorsRecord: Record<string, string> = {};
    Object.entries(validation.errors).forEach(([key, value]) => {
      if (value) errorsRecord[key] = value;
    });
    
    currentContactsForm.disabled = !validation.isValid;
    currentContactsForm.errors = errorsRecord;
  }
});

// При закрытии модалки очищаем ссылку
events.on('modal:closed', () => {
  currentContactsForm = null;
});

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
      const orderSuccess = new OrderSuccess(
        cloneTemplate<HTMLElement>(templates.success), 
        () => { 
          modal.close(); 
        }
      ); 
       
      orderSuccess.total = response.total; 
      modal.open(orderSuccess.render()); 
       
      cartModel.clear(); 
      customerModel.clear(); 
      events.emit('cart:changed');
    }) 
    .catch((err) => { 
      console.error('[order:create:error]', err); 
      events.emit('notification:show');
    }); 
  })
  
      
