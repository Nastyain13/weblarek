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

 CatalogCard 
Создание и управление отображением каталога товаров в виде карточек на странице.
constructor(container: HTMLElement) {
Методы:
renderProducts(products: IProduct[]): void -  для отображения списка товаров

Параметры: принимает массив объектов товаров. Преобразует товары в HTML-элементы и отображает их в галерее

setItems(nodes: HTMLElement[]): void
 Заменяет содержимое галереи новыми элементами

Параметры: массив HTML-элементов


 clear(): void -удаляет все дочерние элементы из галереи
 
 
 abstract class Card 
  Абстрактный базовый класс карточки каталога

Конструктор: (container: HTMLElement) 
Поля:
id: string - идентификатор товара
titleElement: HTMLElement - элемент для отображения названия
imageElement?: HTMLImageElement - опциональный элемент изображения
categoryElement?: HTMLElement - опциональный элемент категории
priceElement: HTMLElement - элемент для отображения цены
Сеттер product
typescript

МЕТОДЫ:
set product(data: IProduct): void - Основной метод для установки данных товара
 setId(id: string): void - Устанавливает ID товара
 setTitle(title: string): void - Устанавливает текст названия товара
 setImageSrc(src: string, alt?: string): void-Устанавливает источник изображения
 setCategory(category: string): void-Устанавливает категорию товара
 setPrice(price: number | null): void-Устанавливает цену товара
 onClick(handler: (id: string) => void): void-Добавляет обработчик клика на карточку

Класс CatalogItem предназначен для отображения карточек товаров в каталоге с функциональностью добавления/удаления из корзины.,
constructor(container: HTMLElement) - конструктор
Поля:
id: string
titleElement: HTMLElement
imageElement?: HTMLImageElement
categoryElement?: HTMLElement
priceElement: HTMLElement
Добавленные в CatalogItem:
buttonElement: HTMLButtonElement - кнопка добавления в корзину
методы:
setInCart(inCart: boolean): void
typescript
setInCart(inCart: boolean): void- Обновляет состояние кнопки корзины
- onAddToCart(handler: (id: string) => void): void
typescript
onAddToCart(handler: (id: string) => void): void-Добавляет обработчик клика на кнопку корзины
-render(data: IProduct): HTMLElement
typescript
render(data: IProduct): HTMLElement -Основной метод для отрисовки карточки товара

Класс PreviewCard - карточка предпросмотра товара.
Класс предназначен для отображения детальной информации о товаре в режиме предпросмотра
constructor(container: HTMLElement, onAddToBasket?: () => void)- конструктор
Параметры:

container: HTMLElement - DOM-элемент контейнера карточки
onAddToBasket?: () => void - опциональный обработчик добавления в корзину

Методы:
Сеттер  set description(value: string): void - Устанавливает текст описания товара

Унаследованные методы от Card<IPreviewCard>:
set product(data: IPreviewCard) - основной метод установки данных
setId(id: string)
setTitle(title: string)
setImageSrc(src: string, alt?: string)
setCategory(category: string)

Класс BasketCard - карточка товара в корзине
Класс предназначен для отображения товаров в корзине покупок. 
constructor(container: HTMLElement, onDelete?: () => void) - конструктор
Параметры:
container: HTMLElement - DOM-элемент контейнера карточки товара в корзине
onDelete?: () => void - опциональный обработчик удаления товара из корзины

Методы:
Сеттер index
set index(value: number): void -Устанавливает порядковый номер товара в списке корзины

Унаследованные методы от Card<IBasketCard>:
set product(data: IBasketCard) - основной метод установки данных товара в корзине
setId(id: string) - установка идентификатора
setTitle(title: string) - установка названия товара
setImageSrc(src: string, alt?: string) - установка изображения
setCategory(category: string) - установка категории
setPrice(price: number | null) - установка цены
onClick(handler: (id: string) => void) - обработчик клика по карточке

Класс Modal - модальное окно
Класс предназначен для управления модальными (всплывающими) окнами на веб-странице. 

constructor(container: HTMLElement, onClose?: () => void)-конструктор
Параметры
container: HTMLElement - DOM-элемент контейнера модального окна
onClose?: () => void - опциональный колбэк, вызываемый при закрытии модалки

Методы:
Приватные методы:
1. setupEventListeners(onClose?: () => void): void
 Настраивает все обработчики событий для модального окна
 Реализует три способа закрытия:
 По клику на кнопку закрытия
 По клику на оверлей (фон)
 По клавише ESC

Публичные методы:
2. open(content: HTMLElement): void
 Открывает модальное окно с переданным содержимым

Параметры: content - HTML-элемент для отображения внутри модалки
Очищает предыдущее содержимое
Добавляет новое содержимое
Добавляет CSS-класс modal_active для показа
Устанавливает флаг isOpen = true

3. close(): void
typescript
close(): void
 Закрывает модальное окно

Действия:
Убирает CSS-класс modal_active для скрытия
Очищает содержимое
Устанавливает флаг isOpen = false

ФОРМЫ:
Класс Form<T> - абстрактная базовая форма
Абстрактный класс предназначен для создания интерактивных форм с валидацией. 

Конструктор:
constructor(container: HTMLFormElement)
Параметры:
container: HTMLFormElement - DOM-элемент формы (тег <form>)
Методы:
Публичные методы:
1. setDisabled(disabled: boolean): void- Блокирует или разблокирует кнопку отправки формы
2. setErrors(errors: Record<string, string>): void - Назначение: Отображает ошибки валидации в форме
Абстрактные методы:
3. validate(): boolean
protected abstract validate(): boolean- Абстрактный метод для реализации валидации формы

Класс ContactsForm - форма контактов
Конкретная реализация формы для ввода контактных данных (email и телефон).

Конструктор:
constructor(
    container: HTMLFormElement,
    protected onSubmit: () => void,
    protected onInput?: (data: Partial<IContactsFormData>) => void
)
Параметры:
container: HTMLFormElement - DOM-элемент формы
onSubmit: () => void - обязательный обработчик отправки формы
onInput?: (data: Partial<IContactsFormData>) => void - опциональный обработчик ввода данных

Методы:
Приватные методы:
1. setupValidation(): void
Назначение: Настраивает валидацию формы в реальном времени

Логика:

Добавляет обработчики input на оба поля

При каждом вводе вызывает валидацию

Вызывает onInput с текущими данными

2. setupSubmit(): void
Назначение: Настраивает обработку отправки формы

Логика:

Предотвращает стандартную отправку формы

Вызывает валидацию

Если форма валидна - вызывает onSubmit

Публичные методы:
3. setEmail(email: string): void
typescript
setEmail(email: string): void
Назначение: Устанавливает значение email и запускает валидацию

Использование: для программного заполнения поля

4. setPhone(phone: string): void
typescript
setPhone(phone: string): void
Назначение: Устанавливает значение телефона и запускает валидацию

Использование: для программного заполнения поля
