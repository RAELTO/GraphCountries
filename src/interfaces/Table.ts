export interface ColumnWithField<T> {
  label: string
  field: keyof T
}

export interface ColumnWithSlot {
  label: string
  slot: string
  field?: []
}

export type Column<T> = ColumnWithField<T> | ColumnWithSlot
