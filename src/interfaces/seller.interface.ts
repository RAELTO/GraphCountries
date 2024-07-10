import type {Invoices} from '../interfaces/invoice.interface'

export interface Sellers {
    id:             number
    name:           string
    identification: string
    observations:   string
    status:         string
    points:         number
    image:          string
    invoice:        Invoices | null
    product:        string
}