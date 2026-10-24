import type { SubmitEventHandler } from 'react'

type ProductFormViewProps = {
  name: string
  price: string
  message: string
  onNameChange: (value: string) => void
  onPriceChange: (value: string) => void
  onSubmit: SubmitEventHandler<HTMLFormElement>
}

export default function ProductFormView({
  name,
  price,
  message,
  onNameChange,
  onPriceChange,
  onSubmit,
}: ProductFormViewProps) {
  return (
    <>
      <h1>商品登録</h1>

      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="product-name">商品名</label>
          <input
            id="product-name"
            type="text"
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="product-price">価格</label>
          <input
            id="product-price"
            type="number"
            value={price}
            onChange={(event) => onPriceChange(event.target.value)}
            min="0"
            required
          />
        </div>

        <button type="submit">登録</button>
      </form>

      <p>{message}</p>
    </>
  )
}