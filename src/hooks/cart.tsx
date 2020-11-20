import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const StorageProducts = await AsyncStorage.getItem('@GoMarketPlace:cart');

      if (StorageProducts) {
        setProducts(JSON.parse(StorageProducts));
      }
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(
    async product => {
      const verifyProduct = products.find(
        verifiedProduct => product.id === verifiedProduct.id,
      );

      if (!verifyProduct) {
        product.quantity = 1;
        setProducts([...products, product]);
      } else {
        product.quantity += 1;
        setProducts(allProducts => {
          const updateProducts = allProducts.map(actualProduct => {
            if (actualProduct.id !== product.id) {
              return actualProduct;
            }
            return product;
          });

          return updateProducts;
        });
      }

      await AsyncStorage.setItem(
        '@GoMarketPlace:cart',
        JSON.stringify(products),
      );
    },
    [setProducts, products],
  );

  const increment = useCallback(
    async id => {
      setProducts(allProducts => {
        const updateProducts = allProducts.map(actualProduct => {
          if (actualProduct.id !== id) {
            return actualProduct;
          }
          actualProduct.quantity += 1;

          return actualProduct;
        });

        return updateProducts;
      });

      await AsyncStorage.setItem(
        '@GoMarketPlace:cart',
        JSON.stringify(products),
      );
    },
    [products],
  );

  const decrement = useCallback(async id => {
    setProducts(allProducts => {
      const updateProducts = allProducts.map(actualProduct => {
        if (actualProduct.id !== id) {
          return actualProduct;
        }
        actualProduct.quantity -= 1;

        if (actualProduct.quantity === 0) {
          return 0;
        }

        return actualProduct;
      });

      return updateProducts.filter(product => !!product);
    });

    await AsyncStorage.setItem('@GoMarketPlace:cart', JSON.stringify(products));
  }, []);

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
