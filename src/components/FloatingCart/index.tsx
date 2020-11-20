import React, { useState, useMemo } from 'react';

import { useNavigation } from '@react-navigation/native';

import FeatherIcon from 'react-native-vector-icons/Feather';
import {
  Container,
  CartPricing,
  CartButton,
  CartButtonText,
  CartTotalPrice,
} from './styles';

import formatValue from '../../utils/formatValue';

import { useCart } from '../../hooks/cart';

// Calculo do total
// Navegação no clique do TouchableHighlight

const FloatingCart: React.FC = () => {
  const { products } = useCart();

  const navigation = useNavigation();

  const cartTotal = useMemo(() => {
    let totalProductsPrice;

    if (products.length !== 0) {
      const allProductsQuantityPrice = products.map(product => {
        return product.quantity * product.price;
      });

      totalProductsPrice = allProductsQuantityPrice.reduce(
        (prev, next) => prev + next,
      );
    } else {
      totalProductsPrice = 0;
    }

    return formatValue(totalProductsPrice);
  }, [products]);

  const totalItensInCart = useMemo(() => {
    let totalProductsQuantity = 0;

    if (products.length !== 0) {
      const productsQuantity = products.map(product => product.quantity);

      totalProductsQuantity = productsQuantity.reduce(
        (prev, next) => prev + next,
      );
    }

    return totalProductsQuantity;
  }, [products]);

  return (
    <Container>
      <CartButton
        testID="navigate-to-cart-button"
        onPress={() => navigation.navigate('Cart')}
      >
        <FeatherIcon name="shopping-cart" size={24} color="#fff" />
        <CartButtonText>{`${totalItensInCart} itens`}</CartButtonText>
      </CartButton>

      <CartPricing>
        <CartTotalPrice>{cartTotal}</CartTotalPrice>
      </CartPricing>
    </Container>
  );
};

export default FloatingCart;
