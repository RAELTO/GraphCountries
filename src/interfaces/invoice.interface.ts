export interface Invoices {
    id:               string
    date:             Date
    dueDate:          Date
    datetime:         Date
    observations:     string
    anotation:        null
    termsConditions:  string
    status:           string
    client:           Client
    numberTemplate:   NumberTemplate
    subtotal:         number
    discount:         number
    tax:              number
    total:            number
    totalPaid:        number
    balance:          number
    decimalPrecision: string
    warehouse:        Warehouse
    term:             string
    barCodeContent:   string
    seller:           Seller
    priceList:        PriceList
    items:            Item[]
    costCenter:       null
    printingTemplate: PrintingTemplate
}

export interface Client {
    id:                   string
    name:                 string
    identification:       null
    phonePrimary:         string
    phoneSecondary:       null
    fax:                  null
    mobile:               string
    email:                string
    address:              Address
    kindOfPerson:         string
    regime:               string
    identificationObject: IdentificationObject
}

export interface Address {
    address:    string
    department: null
    city:       string
}

export interface IdentificationObject {
    type:   null
    number: null
}

export interface Item {
    name:        string
    description: string
    price:       number
    discount:    number
    reference:   null
    quantity:    number
    id:          number
    productKey:  null
    unit:        null
    tax:         any[]
    total:       number
}

export interface NumberTemplate {
    id:              string
    prefix:          null
    number:          string
    text:            null
    documentType:    string
    fullNumber:      string
    formattedNumber: string
}

export interface PriceList {
    id:   number
    name: string
}

export interface PrintingTemplate {
    id:       string
    name:     string
    pageSize: string
}

export interface Seller {
    id:             number
    name:           string
    identification: string
    observations:   string
}

export interface Warehouse {
    id:   string
    name: string
}
