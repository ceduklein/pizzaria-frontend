import { useState } from 'react';
import Head from "next/head";
import Modal from 'react-modal'; 
import { FiRefreshCcw } from "react-icons/fi"

import styles from './style.module.scss';

import { canSSRAuth } from "@/src/utils/canSSRAuth"
import { setupAPIClient } from "@/src/services/api";

import { Header } from "@/src/components/Header";
import { ModalOrder } from '@/src/components/ModalOrder';

type OrderItem = {
  id: string;
  table: string | number;
  status: boolean;
  draft: boolean;
  name: string | null;
}
interface HomeProps {
  orders: OrderItem[];
}

export type OrderItemProps = {
  id: string;
  amount: number;
  order_id: string;
  product_id: string;
  product: {
    id: string;
    name: string;
    description: string;
    price: string;
    banner: string;
  }
  order: {
    id: string;
    table: string | number;
    status: boolean;
    name: string | null;
  }
}

export default function Dashboard({orders}: HomeProps) {
  const [orderList, setOrderList] = useState(orders || []);

  const [modalItem, setModalItem] = useState<OrderItemProps[]>();
  const [modalVisivle, setModalVisible] = useState(false);
  
  const api = setupAPIClient();

  async function handleOpenModal(id: string) {
    const response = await api.get('order/detail', {
      params: { order_id: id}
    });

    setModalItem(response.data);
    setModalVisible(true);
  }

  function handleCloseModal() {
    setModalVisible(false);
  }

  async function handleFinishOrder(id: string) {
    await api.put('/order/finish', { order_id: id });

    const response = await api.get('/order');
    setOrderList(response.data);

    handleCloseModal();
  }

  async function handleRefreshOrders() {
    const response = await api.get('/order');
    setOrderList(response.data);
  }

  Modal.setAppElement('#__next');

  return(
    <>
    <Head>
      <title>Dashboard - Sujeito Pizza</title>
    </Head>
    <div>
      <Header />
      
      <main className={styles.container}>
        <div className={styles.containerHeader}>
          <h1>Últimos Pedidos</h1>

          <button>
            <FiRefreshCcw size={25} color="#3fffa3" onClick={handleRefreshOrders} />
          </button>
        </div>

        <article className={styles.listOrder}>

          {orderList.length === 0 && (
            <span className={styles.emptyList}>
              Nenhum pedido aberto.
            </span>
          )}

          {orderList.map( order => {
            return (
              <section key={order.id} className={styles.orderItem}>
                <button onClick={() => handleOpenModal(order.id)}>
                  <div className={styles.tag}></div>
                  <span>Mesa {order.table}</span>
                </button>
              </section>
            )
          })}

        </article>
      </main>

      {modalVisivle && (
        <ModalOrder isOpen={modalVisivle}
         onRequestClose={handleCloseModal}
         order={modalItem}
         handleFinishOrder={handleFinishOrder} />
      )}

    </div>
    </>
  )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const api = setupAPIClient(ctx);

  const response = await api.get('/order');

  return {
    props: {
      orders: response.data
    }
  }
});