import { useState, FormEvent } from 'react';
import Head from "next/head";
import { toast } from 'react-toastify';

import styles from './style.module.scss';

import { Header } from "@/src/components/Header";
import { Input } from "@/src/components/ui/input";

import { setupAPIClient } from '../../services/api';
import { canSSRAuth } from '@/src/utils/canSSRAuth';

export default function Category() {
  const [category, setCategory] = useState('');

  async function handleRegister(event: FormEvent) {
    event.preventDefault();

    if (category === '') {
      toast.error('Digite o nome da categoria.');
      return;
    }

    const apiClient = setupAPIClient();
    await apiClient.post('/category', { name: category });

    toast.success('Categoria cadastrada com sucesso');
    setCategory('');
  }
  
  return(
    <>
    <Head>
      <title>Nova Cateogria - Sujeito Pizza</title>
    </Head>

    <div>
      <Header />
      
      <main className={styles.container}>
        <h1>Cadastrar categorias</h1>

        <form className={styles.form} onSubmit={handleRegister}>
          <Input type="text"
            placeholder="Digite o nome da categoria"
            value={category}
            onChange={ e => setCategory(e.target.value) }
          />

          <button type="submit" className={styles.buttonAdd}>Cadastrar</button>
        </form>
      </main>
    </div>
    </>
  )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  return {
    props: {}
  }
})