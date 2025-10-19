# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

Данные :

Описаны следующие три класса в отдельных файлах :


1.каталог товаров Catalog.ts.  Class Catalog хранит массив всех товаров; хранит товар, выбранный для подробного отображения;
private products: IProduct[] = []; - массив товаров, хранит все товары
private selectedProduct: IProduct | null = null;  - выбранный товар;
private - модификатор доступа.
   методы:
сохранение массива товаров полученного в параметрах метода setProducts(products: IProduct[]): void-  записывает/устанавливает  весь массив товаров в каталоге. 
получение массива товаров из модели -   getProducts(): IProduct[]  геттер(прочитать получить данные)
получение одного товара по его id  - getProductById(id: string): IProduct | null {   
сохранение товара для подробного отображения - setSelectedProduct(product: IProduct): void                                 
                                                this.selectedProduct = product;             
получение товара для подробного отображения. getSelectedProduct(): IProduct | null {
                                                return this.selectedProduct;



2. Корзина Cart.ts; класс Cart - корзина покупок.
Методы:
 массив товаров, хранящий все товары, добавленные в корзину- private items: IProduct[];
Получение массива товаров, которые находятся в корзине getItems(): IProduct[];
Добавление товара, который был получен в параметре, в массив корзины addItem(product: IProduct): void; 
 Удаление товара, полученного в параметре из массива корзины removeItem(product: IProduct): void   
 Очистка корзиныclear(): void 
 Получение стоимости всех товаров в корзине getTotalPrice(): number   
 Получение количества товаров в корзине getItemsCount(): number 
 Проверка наличия товара в корзине по его id, полученного в параметр метода- hasItem(productId: string): boolean 

3. Покупатели Customer.ts. класс Customer - данные покупателя в приложении.
private payment: TPayment | null - способ оплаты, выбранный покупателем (может быть null если не выбран)
методы:
Сохранение данных покупателя (общий метод) - setData(data: Partial<IBuyer>): void ;
 Сохранение отдельных полей - setPayment(payment: TPayment): void; setEmail(email: string): void , setPhone(phone: string): void , setAddress(address: string): void,
 Получение всех данных покупателя - getData(): IBuyer;
 Получение текущих данных (частично заполненных) - getCurrentData(): Partial<IBuyer> ;
 Очистка данных покупателя - clear(): void 
 Проверка, все ли данные заполнены
  isComplete(): boolean {
    return !!this.payment && !!this.email && !!this.phone && !!this.address;
  }
Валидация данных
  validate(): IValidationResult {
    const errors: IValidationResult['errors'] = {}
 Валидация отдельного поля
  validateField(field: keyof IBuyer): { isValid: boolean; error?: string } 


 файл ApiClient.ts  Класс ApiClient отвечает за взаимодействие с серверным API. 
 конструктор constructor(api: IApi)
 Параметр api: IApi

 методы:
Получает каталог товаров с сервера  async getProducts(): Promise<IProduct[]> {
 Отправляет заказ на сервер для обработки async createOrder(orderData: IOrderData): Promise<IOrderResult> 
 
 
 В файле main.ts - экземпляры классов Сart, Catalog, Customer,  - нужно для проверки работы моделей данных.
Экземпляр класса ApiClient - получение данных с сервера и отправку данных на сервер.
 
Классы представления:
Есть класс Component -базовый для всех классов представления.
Модальные окна:
- Карточка товара - Card.ts
- Корзина - BasketCard
- Форма вид оплаты; 
-Форма- email, телефон;
-Представление;
-Модальное окно;

Части и блоки:
- корзина со счетчиком - шапка header
-каталог с карточками товара;
- карточки товара в каталоге;
-карточки товара в корзине;

Переиспользуемые сущности:
-формы;
- Карточки товара, товар.

Header
 Шапка сайта, отображает логотип, счётчик корзины и кнопки.

constructor(protected events: IEvents, container: HTMLElement) {
        super(container);
        
Поля:
protected counterElement: HTMLElement; 
protected basketButton: HTMLButtonElement;

Методы:
 set counter(value: number) - Устанавливает значение счетчика корзины

Класс Card - Назначение: Базовая карточка товара
Поля класса Card:
protected _id: string = ''

Внутреннее поле для хранения ID товара

protected titleElement: HTMLElement

Элемент для отображения названия товара

Находится в DOM по селектору .card__title

protected priceElement: HTMLElement

Элемент для отображения цены товара

Находится в DOM по селектору .card__price

Методы класса Card:
constructor(container: HTMLElement)

Инициализирует базовую карточку товара

container - DOM-контейнер карточки

set id(value: string)

Сеттер для установки ID товара

Сохраняет ID во внутреннем поле _id и в data-атрибуте контейнера

set title(value: string)

Сеттер для установки названия товара

Устанавливает текст в titleElement

set price(value: number | null)

Сеттер для установки цены товара

Если цена null - показывает "Бесценно", иначе форматирует цену

onClick(handler: (id: string) => void): void

Публичный метод для установки обработчика клика на карточку

При клике вызывает переданный handler с ID товара

 Класс CatalogCard - Назначение: Отображение товара в каталоге
 Поля класса CatalogCard:
protected categoryElement: HTMLElement

Элемент для отображения категории товара

Находится в DOM по селектору .card__category

protected imageElement: HTMLImageElement

Элемент для отображения изображения товара

Находится в DOM по селектору .card__image

Методы класса CatalogCard:
constructor(container: HTMLElement, onSelect?: (id: string) => void)

Инициализирует карточку товара в каталоге

container - DOM-контейнер карточки

onSelect - опциональный callback при клике на карточку

set category(value: string)

Сеттер для установки категории товара

Устанавливает текст категории и добавляет CSS-класс из categoryMap

set image(value: string)

Сеттер для установки изображения товара

Устанавливает src и alt для изображения

setImageSrc(src: string, alt: string): void

Публичный метод для установки источника изображения

Устанавливает src и alt атрибуты

Наследуемые от родительского класса Card:
set id(value: string) - установка ID товара
set title(value: string) - установка названия товара
set price(value: number | null) - установка цены товара
render(): HTMLElement - рендер карточки
 
класс BasketCard- Назначение: Отображение товара в корзине
 Поля класса BasketCard:
protected indexElement: HTMLElement

Элемент для отображения порядкового номера товара в корзине

Находится в DOM по селектору .basket__item-index

protected deleteButton: HTMLButtonElement

Кнопка для удаления товара из корзины

Находится в DOM по селектору .basket__item-delete

Методы класса BasketCard:
constructor(container: HTMLElement, onDelete?: (id: string) => void)

Инициализирует карточку товара в корзине

container - DOM-контейнер карточки

onDelete - опциональный callback при клике на кнопку удаления

set index(value: number)

Сеттер для установки порядкового номера товара

Преобразует число в строку и устанавливает в indexElement

Наследуемые от родительского класса Card:
set id(value: string) - установка ID товара
set title(value: string) - установка названия товара
set price(value: number | null) - установка цены товара
render(): HTMLElement - рендер карточки

Формы:
Form (абстрактный базовый класс)
Назначение:
Базовый класс для всех форм в приложении. Инкапсулирует общую логику работы с формами: отправка, валидация, отображение ошибок.

Поля:
protected formElement: HTMLFormElement

DOM-элемент формы

protected submitButton: HTMLButtonElement

Кнопка отправки формы

protected errorContainer: HTMLElement

Контейнер для отображения ошибок валидации

Конструктор:

constructor(container: HTMLElement, onFormSubmit?: () => void)
container - DOM-контейнер формы

onFormSubmit - опциональный callback при отправке формы

Логика конструктора:

Находит или создает элемент формы

Находит кнопку отправки и контейнер ошибок

Настраивает обработчик отправки формы

Методы:
set disabled(value: boolean)

Сеттер для блокировки/разблокировки кнопки отправки

set errors(value: Record<string, string>)

Сеттер для отображения ошибок валидации

Фильтрует пустые сообщения и показывает в контейнере

protected abstract getFormData(): T

Абстрактный метод - должен быть реализован в наследниках

Возвращает данные формы в типизированном виде

OrderForm (Форма заказа)
Назначение:
Форма первого шага оформления заказа. Управляет выбором способа оплаты и вводом адреса доставки.

Поля:
protected ButtonsPayment: HTMLButtonElement[]

Массив кнопок выбора способа оплаты

protected Adress: HTMLInputElement

Поле ввода адреса доставки

Конструктор:
constructor(
  container: HTMLElement, 
  onFormSubmit?: () => void, 
  onFormChange?: (formData: Partial<OrderFormData>) => void
)
onFormChange - callback при изменении данных формы

Логика конструктора:

Находит контейнер с кнопками оплаты

Находит поле ввода адреса

Настраивает обработчики для кнопок оплаты и поля адреса

Методы:
set payment(value: TPayment)

Сеттер для программного выбора способа оплаты

set address(value: string)

Сеттер для установки значения адреса

set errors(value: Record<string, string>)

Переопределенный сеттер для отображения ошибок оплаты и адреса

protected getFormData(): OrderFormData

Реализация абстрактного метода - возвращает полные данные формы

protected getPartialFormData(): Partial<OrderFormData>

Вспомогательный метод - возвращает частичные данные для onFormChange

protected selectPaymentMethod(method: TPayment)

Внутренний метод - переключает активное состояние кнопок оплаты
ContactsForm (Форма контактов)
Назначение:
Форма второго шага оформления заказа для ввода контактных данных (email и телефон).

Поля:
protected emailInput: HTMLInputElement

Поле ввода email

protected phoneInput: HTMLInputElement

Поле ввода телефона

protected onFormChange?: (data: Partial<IContactsFormData>) => void

Опциональный callback для обработки изменений данных формы

Конструктор:
constructor(
  container: HTMLElement, 
  onFormSubmit?: () => void,
  onFormChange?: (data: Partial<IContactsFormData>) => void 
)
Логика конструктора:

Находит поля ввода email и телефона

Сохраняет callback для изменений

Настраивает обработчики input событий для полей

Методы:
set email(value: string)

Сеттер для установки значения email

set phone(value: string)

Сеттер для установки значения телефона

protected getFormData(): IContactsFormData

Реализация абстрактного метода - возвращает данные формы

validateContacts(): { isValid: boolean; errors: Record<string, string> }

Публичный метод валидации контактных данных

Проверяет заполненность и формат email/телефона

private handleInputChange(): void

Внутренний метод обработки изменений полей

Вызывает onFormChange и обновляет состояние формы

private isValidEmail(email: string): boolean

Внутренний метод проверки формата email

private isValidPhone(phone: string): boolean

Внутренний метод проверки формата телефона

BasketView (Представление корзины)
Назначение:
Визуальное представление корзины товаров. Отображает список товаров, общую сумму и управляет состоянием кнопки оформления заказа.

Поля:
protected basketContainer: HTMLElement

Контейнер для списка товаров в корзине (селектор .basket__list)

protected totalPrice: HTMLElement

Элемент для отображения общей суммы заказа (селектор .basket__price)

protected basketButton: HTMLButtonElement

Кнопка оформления заказа (селектор .basket__button)

protected events: EventEmitter

Система событий для коммуникации с другими компонентами

Конструктор:

constructor(container: HTMLElement, protected events: EventEmitter)

Методы:
set basketList(items: HTMLElement[])

Сеттер для обновления списка товаров в корзине

Заменяет все дочерние элементы в контейнере

set total(value: number)

Сеттер для установки общей суммы заказа

Форматирует и отображает сумму в "синапсах"

set state(value: boolean)

Сеттер для управления состоянием корзины

value = true - корзина пуста, показывает сообщение и блокирует кнопку

value = false - корзина не пуста, разблокирует кнопку

Gallery (Галерея/Каталог товаров)
Назначение:
Компонент для отображения и управления каталогом товаров. Отвечает за рендеринг списка товаров в виде галереи.

Поля:
protected Catalog: HTMLElement

Контейнер для отображения каталога товаров (селектор .gallery)

Конструктор:
constructor(container: HTMLElement)
Логика конструктора:

Принимает DOM-контейнер галереи

Находит элемент каталога внутри контейнера

Методы:
setItems(nodes: HTMLElement[]): void

Публичный метод для установки списка товаров

Полностью заменяет содержимое каталога переданными элементами

Использует replaceChildren() для эффективного обновления

clear(): void

Публичный метод для очистки каталога

Удаляет все дочерние элементы из контейнера

Modal (Модальное окно)
Назначение:
Универсальный компонент модального окна для отображения различного контента поверх основного интерфейса.

Поля:
protected contentElement: HTMLElement

Контейнер для контента модального окна (селектор .modal__content)

protected closeButton: HTMLButtonElement

Кнопка закрытия модального окна (селектор .modal__close)

protected isOpen: boolean = false

Флаг состояния модального окна (открыто/закрыто)

Конструктор:
constructor(container: HTMLElement, onClose?: () => void)
Методы:
setupEventListeners(onClose?: () => void): void

Внутренний метод настройки обработчиков событий:

 Клик по кнопке закрытия

 Клик по оверлею (вне контента)

Esc - закрытие по клавише Escape

open(content: HTMLElement): void

Публичный метод открытия модального окна

Блокирует скроллинг страницы

Очищает и заполняет контент

Добавляет CSS-класс для отображения

close(): void

Публичный метод закрытия модального окна



OrderSucsess (Успешное оформление заказа)
Назначение:
Компонент для отображения страницы успешного завершения заказа. Показывает подтверждение оплаты и сумму списания.

Поля:
protected headerElement: HTMLElement

Заголовок успешного заказа (селектор .order-success__title)

protected summaryElement: HTMLElement

Элемент для отображения суммы списания (селектор .order-success__description)

protected actionButton: HTMLButtonElement

Кнопка закрытия/продолжения (селектор .order-success__close)

Конструктор:

constructor(template: HTMLTemplateElement, onDismiss?: () => void)

Методы:
updateTotalAmount(amount: number): void

Публичный метод для обновления информации о сумме заказа

Форматирует и отображает сообщение "Списано X синапсов"

События в приложении
Загрузка данных
catalog:changed - каталог товаров обновлен

Работа с товарами
product:selected - выбран товар для просмотра

cart:changed - изменено содержимое корзины

Корзина
basket:open - открытие корзины

Оформление заказа
order:open - открытие формы заказа (1 шаг)

contacts:open - открытие формы контактов (2 шаг)

order:success - успешное оформление заказа

Уведомления
notification:show - показать уведомление

Модальные окна
modal:closed - модальное окно закрыто





