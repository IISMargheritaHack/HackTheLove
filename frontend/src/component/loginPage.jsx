import './loginPage.css'
import './loginButton'
import LButton from './loginButton';
function LoginPage() {
    return(
        
        <div id='main'>
            <div id='center' className=''>
                 <img id='lg' src={'logo.svg'} alt="Logo" /> 
                 
            </div>
            
            <div>
                <h1 className='' id='h1'>Hack The Love</h1>
            </div>
            
            <div>
                <p id='p1'>Scopri chi è la tua anima gemella nella scuola</p>
            </div>
        <div className=''>    
            <div id='services' className=''>
                <p id='p2'>Cliccando Log in accetti automaticamente i nostri termini
                    di servizio. Leggi come gestiamo i tuoi dati con la nostra Privacy Policy e Coockies Policy.
                </p>
            </div> 
            
            <div id='button'className=''>    
                <LButton >

                </LButton>
            </div>
        </div>   
        </div>
    )
}

export default LoginPage;