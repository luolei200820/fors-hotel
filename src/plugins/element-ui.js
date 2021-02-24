import {
    Aside,
    Button,
    Carousel,
    CarouselItem,
    Col,
    Container,
    Dialog,
    Footer,
    Form,
    FormItem,
    Header,
    Input,
    Link,
    Main,
    Menu,
    Message,
    MenuItem,
    Option,
    PageHeader,
    Row,
    Select,
    Table,
    TableColumn,
    TabPane,
    Tabs,
    Tag,
    Upload,
    Image,
    Loading,
    Checkbox,
    CheckboxGroup,
    Notification,
} from 'element-ui'

const element = {
    install: function (Vue) {
        Vue.use(Button)
        Vue.use(Col)
        Vue.use(Row)
        Vue.use(Select)
        Vue.use(Option)
        Vue.use(Container)
        Vue.use(Header)
        Vue.use(Aside)
        Vue.use(Main)
        Vue.use(Footer)
        Vue.use(Menu)
        Vue.use(MenuItem)
        Vue.use(Tabs)
        Vue.use(TabPane)
        Vue.use(Form)
        Vue.use(FormItem)
        Vue.use(Input)
        Vue.use(Upload)
        Vue.use(PageHeader)
        Vue.use(Link)
        Vue.use(Table)
        Vue.use(TableColumn)
        Vue.use(Dialog)
        Vue.use(Carousel)
        Vue.use(CarouselItem)
        Vue.use(Tag)
        Vue.use(Image)
        Vue.use(Checkbox)
        Vue.use(CheckboxGroup)
        Vue.use(Loading.directive)

        Vue.prototype.$notify = Notification
        Vue.prototype.$message = Message
    }
}

export default element