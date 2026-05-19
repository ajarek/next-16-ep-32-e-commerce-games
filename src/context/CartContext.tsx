'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { insforge } from '@/lib/insforge';
import { useAuth } from './AuthContext';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image_url: string;
  category_id: number;
  is_on_deal: boolean;
  discount_percent: number;
  stock: number;
}

export interface CartItem {
  id: number;
  user_id: string;
  product_id: number;
  quantity: number;
  price_at_add: string;
  added_at: string;
  products: Product; // Embed product details
}

interface CartContextType {
  cartItems: CartItem[];
  loading: boolean;
  addToCart: (productId: number, price: number, quantity?: number) => Promise<{ success: boolean; error?: string }>;
  updateQuantity: (itemId: number, newQty: number) => Promise<{ success: boolean; error?: string }>;
  removeFromCart: (itemId: number) => Promise<{ success: boolean; error?: string }>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCartItems([]);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await insforge.database
        .from('cart_items')
        .select('*, products(*)')
        .eq('user_id', user.id);

      if (error) {
        console.error('Failed to fetch cart:', error);
      } else if (data) {
        setCartItems(data as CartItem[]);
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId: number, price: number, quantity = 1) => {
    if (!user) {
      return { success: false, error: 'Musisz się zalogować, aby dodać produkt do koszyka.' };
    }

    try {
      // Check if item already exists in cart
      const existingItem = cartItems.find((item) => item.product_id === productId);

      if (existingItem) {
        // Update quantity
        const newQty = existingItem.quantity + quantity;
        const { data, error } = await insforge.database
          .from('cart_items')
          .update({ quantity: newQty })
          .eq('id', existingItem.id)
          .select('*, products(*)');

        if (error) return { success: false, error: error.message };
        
        if (data && data.length > 0) {
          setCartItems(prev => prev.map(item => item.id === existingItem.id ? (data[0] as CartItem) : item));
        } else {
          await fetchCart();
        }
      } else {
        // Insert new item (SDK inserts must be array format: `[{...}]`)
        const { data, error } = await insforge.database
          .from('cart_items')
          .insert([
            {
              user_id: user.id,
              product_id: productId,
              quantity,
              price_at_add: price.toString(),
            },
          ])
          .select('*, products(*)');

        if (error) return { success: false, error: error.message };

        if (data && data.length > 0) {
          setCartItems(prev => [...prev, data[0] as CartItem]);
        } else {
          await fetchCart();
        }
      }
      return { success: true };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Wystąpił błąd';
      return { success: false, error: errorMsg };
    }
  };

  const updateQuantity = async (itemId: number, newQty: number) => {
    if (newQty <= 0) {
      return removeFromCart(itemId);
    }

    try {
      const { data, error } = await insforge.database
        .from('cart_items')
        .update({ quantity: newQty })
        .eq('id', itemId)
        .select('*, products(*)');

      if (error) return { success: false, error: error.message };

      if (data && data.length > 0) {
        setCartItems(prev => prev.map(item => item.id === itemId ? (data[0] as CartItem) : item));
      } else {
        await fetchCart();
      }
      return { success: true };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Wystąpił błąd';
      return { success: false, error: errorMsg };
    }
  };

  const removeFromCart = async (itemId: number) => {
    try {
      const { error } = await insforge.database
        .from('cart_items')
        .delete()
        .eq('id', itemId);

      if (error) return { success: false, error: error.message };

      setCartItems(prev => prev.filter(item => item.id !== itemId));
      return { success: true };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Wystąpił błąd';
      return { success: false, error: errorMsg };
    }
  };

  const clearCart = async () => {
    if (!user) return;
    try {
      const { error } = await insforge.database
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Failed to clear cart:', error);
      } else {
        setCartItems([]);
      }
    } catch (err) {
      console.error('Error clearing cart:', err);
    }
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Total calculation takes discount_percent into account if products are on deal!
  const cartTotal = cartItems.reduce((acc, item) => {
    const itemPrice = parseFloat(item.products.price);
    const finalPrice = item.products.is_on_deal
      ? itemPrice * (1 - item.products.discount_percent / 100)
      : itemPrice;
    return acc + finalPrice * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        fetchCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
