import { useState, ChangeEvent, FormEvent } from 'react';
import Head from "next/head";
import { FiUpload } from 'react-icons/fi';
import { toast } from 'react-toastify';

import styles from './style.module.scss';

import { canSSRAuth } from "@/src/utils/canSSRAuth";
import { Header } from '@/src/components/Header';
import { setupAPIClient } from '@/src/services/api';
import { api } from '@/src/services/apiClient';

type ItemProps = {
  id: string;
  name: string;
}

interface CateogoryProps {
  categoryList: ItemProps[];
}

export default function Product({ categoryList }: CateogoryProps) {

  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarImg, setAvatarImg] = useState(null);

  const [categories, setCategories] = useState(categoryList || []);
  const [selectedCategory, setSelectedCategory] = useState(0);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    if(!e.target.files) {
      return;
    }

    const image = e.target.files[0];
    if(!image){
      return;
    }

    if(image.type === 'image/jpeg' || image.type === 'image/png') {
      setAvatarImg(image);
      setAvatarUrl(URL.createObjectURL(image));
    }
  }

  function handleChangeCategory(e) {
    setSelectedCategory(e.target.value);
  }

  async function handleRegister(e: FormEvent) {
    e.preventDefault();

    const data = new FormData();

    if (name === '' || price === '' || description === '' || avatarImg === null) {
      toast.warning('Preencha todos os campos.');
      return;
    }

    data.append('name', name);
    data.append('price', price);
    data.append('description', description);
    data.append('category_id', categories[selectedCategory].id);
    data.append('file', avatarImg);

    try {
      const api = setupAPIClient();
      await api.post('/product', data);      
      toast.success('Produto cadastrado com sucesso.');

    } catch(err) {
      console.log(err);
      toast.error('Erro ao cadastrar o produto.')
    }

    setName('');
    setPrice('');
    setDescription('');
    setAvatarImg(null);
    setAvatarUrl('');
  }

  return(
    <>
    <Head>
      <title>Novo Produto - Sujeito Pizza</title>
    </Head>

    <div>
      <Header />

      <main className={styles.container}>
        <h1>Novo Produto</h1>

        <form className={styles.form} onSubmit={handleRegister}>

        <label className={styles.labelAvatar} >
          <span>
            <FiUpload size={30} color='#FFF' />
          </span>

          <input type="file" accept='image/png, image/jpeg' onChange={handleFile} />

          {avatarUrl && (
            <img
              className={styles.preview} 
              src={avatarUrl} 
              alt="Foto do produto"
              width={250}
              height={250}
            />
          )}

        </label>

          <select value={selectedCategory} onChange={handleChangeCategory}>

            {categories.map( (item, index) => {
              return(
                <option value={index} key={item.id}>{item.name}</option>
              )
            })}

          </select>

          <input type="text"
            placeholder='Digite o nome do produto'
            className={styles.input} 
            value={name}
            onChange={e => setName(e.target.value)}
          />

          <input type="text"
            placeholder='Preço do produto'
            className={styles.input}
            value={price}
            onChange={e => setPrice(e.target.value)}
          />

          <textarea placeholder='Descreva seu produto'
            className={styles.input}
            value={description}
            onChange={e => setDescription(e.target.value)}
          />

          <button className={styles.buttonAdd} type='submit'>
            Cadastrar
          </button>

        </form>

      </main>
    </div>
    </>
  )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const api = setupAPIClient(ctx);

  const response = await api.get('/category');

  return {
    props: {
      categoryList: response.data
    }
  }
});