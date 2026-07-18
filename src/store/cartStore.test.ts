import { beforeEach, describe, expect, it } from 'vitest';
import { Product } from '../types/supabase';
import { useCartStore } from './cartStore';

const product: Product = {
  id: 'product-1',
  name: 'Producto de prueba',
  description: 'Descripcion',
  price: 15000,
  image_url: '/branding/avatar-placeholder.svg',
  category: 'Repuestos',
  stock: 2,
  created_at: '2026-07-18T00:00:00.000Z',
};

describe('cart store', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  it('never increases a cart line beyond available stock', () => {
    const store = useCartStore.getState();

    store.addItem(product, 'Negro');
    store.addItem(product, 'Negro');
    store.addItem(product, 'Negro');

    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].quantity).toBe(2);
  });

  it('keeps different colors as separate cart lines', () => {
    const store = useCartStore.getState();

    store.addItem(product, 'Negro');
    store.addItem(product, 'Rojo');

    expect(useCartStore.getState().items.map((item) => item.id)).toEqual([
      'product-1::Negro',
      'product-1::Rojo',
    ]);
  });

  it('removes a line when its quantity becomes zero', () => {
    const store = useCartStore.getState();
    store.addItem(product);

    useCartStore.getState().updateQuantity(product.id, 0);

    expect(useCartStore.getState().items).toHaveLength(0);
  });
});
