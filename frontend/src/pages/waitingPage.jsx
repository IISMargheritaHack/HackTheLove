import Header from '@components/header';

export default function PaginaWaiting() {
  return (
    <div className='h-screen w-screen content-center'>
      <div>
        <Header />
        <h1 className='font-bold text-2xl text-center m-2'>Grazie! Hack the Love <br /> è in aggiornameto</h1>
        <p className='text-center text-[0.8rem] mr-5 ml-5'>Grazie per le tue risposte Hack the Love ti farà scoprire i tuoi potenziali match a breve... stay tuned</p>
      </div>
    </div>
  )
}
