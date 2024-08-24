// src/interfaces/Country.ts

export interface Continent {
  code: string
  name: string
}

export interface Language {
  code: string
  name: string
  native: string
}

export interface State {
  code: string
  name: string
}

export interface Subdivision {
  code: string
  name: string
}

export interface Country {
  name: string
  code: string
  capital: string
  continent: Continent
  currency: string
  languages: Language[]
  phone: string
  states: State[]
  subdivisions: Subdivision[]
}
