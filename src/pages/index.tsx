import { useContext, useState, FormEvent } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

import styles from '../../styles/home.module.scss'

import logoImg from '../../public/logo.svg'

import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { AuthContext } from '../contexts/Autcontext';

export default function Home() {
  const { signIn } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent) {
    event.preventDefault();

    if (email === '' || password === '') {
      alert("Preencha os campos");
      return;
    }

    setLoading(true);

    let data = { email, password };

    await signIn(data);
    setLoading(false);
  }

  return (
    <>
      <Head>
        <title>SujeitoPizza - Faça seu login</title>
      </Head>

      <div className={styles.containerCenter}>
        <Image src={logoImg} alt='Logo Sujeito Pizza' />

        <div className={styles.login}>
          <form onSubmit={handleLogin}>
            <Input type='text'
              placeholder='Digite seu email'
              value={email}
              onChange={ e => setEmail(e.target.value) } />

            <Input type='password'
              placeholder='Sua senha'
              value={password}
              onChange={ e => setPassword(e.target.value) } />
            
            <Button type="submit" loading={loading}>Acessar</Button>
          </form>

          <Link className={styles.text} href='/signup'>
            Não possui uma conta? Cadastra-se
          </Link>
        </div>
      </div>
    </>
  )
}
