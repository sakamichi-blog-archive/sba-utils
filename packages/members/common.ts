export interface Generation {
  key: string
  name: string
  seq: number
}

export interface Member {
  birthdate?: string
  generation: Generation
  graduatedAt?: string
  name: string
  nameSpaced: string
  uid: string
}
