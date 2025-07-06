/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Cart, CartItem, AddToCartRequest, UpdateCartItemRequest } from '@/services/types/entities';
import { cartService } from '@/services';

// Cart State Interface
interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  sessionId: string;
}

// Cart Actions
type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CART'; payload: Cart | null }
  | { type: 'SET_SESSION_ID'; payload: string }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'UPDATE_ITEM'; payload: { productId: number; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'CLEAR_CART' };

// Cart Context Interface
interface CartContextType {
  state: CartState;
  addToCart: (productId: number, quantity: number, userId?: number) => Promise<void>;
  updateCartItem: (productId: number, quantity: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartSummary: () => { totalItems: number; totalAmount: number };
  refreshCart: (userId?: number) => Promise<void>;
}

// Initial State
const initialState: CartState = {
  cart: null,
  isLoading: false,
  error: null,
  sessionId: '',
};

// Cart Reducer
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_CART':
      return { ...state, cart: action.payload, isLoading: false, error: null };
    case 'SET_SESSION_ID':
      return { ...state, sessionId: action.payload };
    case 'ADD_ITEM':
      if (!state.cart) return state;
      const existingItemIndex = state.cart.cartItems.findIndex(
        item => item.productId === action.payload.productId
      );
      if (existingItemIndex >= 0) {
        const updatedItems = [...state.cart.cartItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + action.payload.quantity,
        };
        return {
          ...state,
          cart: { ...state.cart, cartItems: updatedItems },
        };
      } else {
        return {
          ...state,
          cart: {
            ...state.cart,
            cartItems: [...state.cart.cartItems, action.payload],
          },
        };
      }
    case 'UPDATE_ITEM':
      if (!state.cart) return state;
      const updatedItems = state.cart.cartItems.map(item =>
        item.productId === action.payload.productId
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return {
        ...state,
        cart: { ...state.cart, cartItems: updatedItems },
      };
    case 'REMOVE_ITEM':
      if (!state.cart) return state;
      const filteredItems = state.cart.cartItems.filter(
        item => item.productId !== action.payload
      );
      return {
        ...state,
        cart: { ...state.cart, cartItems: filteredItems },
      };
    case 'CLEAR_CART':
      return {
        ...state,
        cart: state.cart ? { ...state.cart, cartItems: [], totalItems: 0, totalAmount: 0 } : null,
      };
    default:
      return state;
  }
}

// Create Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Generate session ID
function generateSessionId(): string {
  return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
}

// Cart Provider Component
interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Initialize session ID on mount
  useEffect(() => {
    let sessionId = localStorage.getItem('cart_session_id');
    if (!sessionId) {
      sessionId = generateSessionId();
      localStorage.setItem('cart_session_id', sessionId);
    }
    dispatch({ type: 'SET_SESSION_ID', payload: sessionId });
  }, []);

  // Load cart on session ID change
  useEffect(() => {
    if (state.sessionId) {
      loadCart();
    }
  }, [state.sessionId]);

  const loadCart = async (userId?: number) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      let cart: Cart | null = null;

      if (userId) {
        cart = await cartService.get.getByUserId(userId);
      } else if (state.sessionId) {
        cart = await cartService.get.getBySessionId(state.sessionId);
      }

      dispatch({ type: 'SET_CART', payload: cart });
    } catch (error) {
      console.error('Error loading cart:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load cart' });
    }
  };

  const addToCart = async (productId: number, quantity: number, userId?: number) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const request: AddToCartRequest = {
        productId,
        quantity,
        userId,
        sessionId: userId ? undefined : state.sessionId,
      };

      const updatedCart = await cartService.post.addToCart(request);
      dispatch({ type: 'SET_CART', payload: updatedCart });
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to add item to cart' });
    }
  };

  const updateCartItem = async (productId: number, quantity: number) => {
    if (!state.cart) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const request: UpdateCartItemRequest = { quantity };
      const updatedCart = await cartService.update.updateCartItem(state.cart.id, productId, request);
      dispatch({ type: 'SET_CART', payload: updatedCart });
    } catch (error: any) {
      console.error('Error updating cart item:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to update cart item' });
    }
  };

  const removeFromCart = async (productId: number) => {
    if (!state.cart) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      await cartService.delete.removeFromCart(state.cart.id, productId);
      dispatch({ type: 'REMOVE_ITEM', payload: productId });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error: any) {
      console.error('Error removing from cart:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to remove item from cart' });
    }
  };

  const clearCart = async () => {
    if (!state.cart) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      await cartService.delete.clearCart(state.cart.id);
      dispatch({ type: 'CLEAR_CART' });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error: any) {
      console.error('Error clearing cart:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to clear cart' });
    }
  };

  const getCartSummary = () => {
    if (!state.cart) {
      return { totalItems: 0, totalAmount: 0 };
    }
    return {
      totalItems: state.cart.totalItems,
      totalAmount: state.cart.totalAmount,
    };
  };

  const refreshCart = async (userId?: number) => {
    await loadCart(userId);
  };

  const contextValue: CartContextType = {
    state,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartSummary,
    refreshCart,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to use cart context
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
