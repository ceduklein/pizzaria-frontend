import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { parseCookies } from 'nookies';

//função para as páginas que só podem ser acessadas por visitantes
export function cannSSRGuest<P>(fn: GetServerSideProps<P>) {
  return async (ctx:GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx);

    //se o usuário já possuir login e token salvos nos cookies, redirecionamos
    if(cookies['@nextauth.token']) {
      return {
        redirect: { destination: '/dashboard', permanent: false }
      }
    }

    return await fn(ctx);
  }
}