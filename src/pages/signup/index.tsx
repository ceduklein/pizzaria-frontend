import { useState, FormEvent, useContext } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-toastify';

import styles from '../../../styles/home.module.scss'

import logoImg from '../../../public/logo.svg'

import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { AuthContext } from '../../contexts/Autcontext';

export default function SignUp() {
  const { signUp } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignUp(event: FormEvent) {
    event.preventDefault();

    if (name === '' || email === '' || password === '') {
      toast.warning('Favor preencher todos os campos.')
      return;
    }

    setLoading(true);

    let data = { name, email, password };

    await signUp(data);

    setLoading(false);
  }

  return (
    <>
      <Head>
        <title>Faça seu cadastro!</title>
      </Head>

      <div className={styles.containerCenter}>
        <Image src={logoImg} alt='Logo Sujeito Pizza' />

        <div className={styles.login}>
          <h1>Criando sua conta</h1>
          <form onSubmit={handleSignUp}>
            <Input type='text'
              placeholder='Digite seu nome'
              value={name}
              onChange={ e => setName(e.target.value)} />

            <Input type='text'
            placeholder='Digite seu email'
            value={email}
            onChange={ e => setEmail(e.target.value)} />

            <Input type='password'
            placeholder='Sua senha'
            value={password}
            onChange={ e => setPassword(e.target.value)} />
            
            <Button type="submit" loading={loading}>Cadastrar</Button>
          </form>

          <Link className={styles.text} href='/'>
            Já possui uma conta? Faça login
          </Link>
        </div>
      </div>
    </>
  )
}
