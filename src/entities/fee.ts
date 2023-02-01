export type FeeUnit = '%' | '€'

export default interface Fee {
  id?: number
  ammount: number
  unit: FeeUnit
  label: string
}
