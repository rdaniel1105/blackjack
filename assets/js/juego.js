const miModulo = (() => {
    'use strict' //siempre dejarlo habilitado para evitar errores

    let deck = [];
    const tipos = ['C', 'D', 'H', 'S'],
    especiales = ['A','J','Q','K'];


    let puntosJugadores = [];

    // Referencias del HTML
    const btnPedir = document.querySelector('#btnPedir'),
    btnDetener = document.querySelector('#btnDetener'),
    btnNuevo = document.querySelector('#btnNuevo');

    const divCartasJugadores = document.querySelectorAll('.divCartas'),
          puntosHTML = document.querySelectorAll('small');
    
    const inicializarJuego = ( numJugadores = 2 ) => {
        deck = crearDeck();
        puntosJugadores = [];
        for (let i = 0; i < numJugadores; i++) {
            puntosJugadores.push(0);    
        }

        puntosHTML.forEach( elem => elem.innerText = 0);
        divCartasJugadores.forEach( elem => elem.innerHTML = '');
        
        btnDetener.disabled = false;
        btnPedir.disabled = false;
    }

    // Esta función crea una nueva baraja
    const crearDeck = () => {
        for (let i = 2; i <= 10; i++) {
            for (const tipo of tipos) {
                deck.push( i + tipo );
            }
        }

        for (const tipo of tipos) {
            for (const especial of especiales) {
                deck.push( especial + tipo );
            }
        }

        return _.shuffle(deck);;
    }

// Esta función me permite pedir una carta

    const pedirCarta = () => {

        if (deck.length === 0) {
            throw 'Ya no hay cartas en el deck.';
        }
        /*const carta = _.sample(deck);
        console.log(carta);
        const index = deck.indexOf(carta);
        deck.splice(index,1);*/

        return deck.pop();

    }

    //pedirCarta();

    const valorCarta = (carta) => {

        const valor = carta.substring(0,carta.length-1); //toda string se puede trabajar como array.
    /*    let puntos = 0;

        if (isNaN(valor)) {
            
            puntos = ( valor === 'A' ) ? 11: 10;

        }else{
            puntos = valor *1;
        }
        console.log(puntos);
        */

        return (isNaN(valor)) ? ((valor === 'A' ) ? 11: 10) : valor *1;
    }

    //turno: 0 = primer jugador. ultimo turno de computadora.
    const acumularPuntos = ( carta, turno )=> {
        puntosJugadores[turno] = puntosJugadores[turno] + valorCarta(carta);
        puntosHTML[turno].innerText = puntosJugadores[turno];
        return puntosJugadores[turno];
    }

    const crearCarta = (carta, turno) => {
        const imgCarta = document.createElement('img');
        imgCarta.src = `assets/cartas/${ carta }.png`;
        imgCarta.classList.add('carta');
        divCartasJugadores[turno].append(imgCarta);
    }

    const determinarGanador = () => {
        setTimeout(() => {
            mensaje();
        }, 20);
    }


//Turno de la computadora
    const turnoComputadora = (puntosMinimos) => {
        let puntosComputadora = 0;
        do {
        const carta = pedirCarta();
        acumularPuntos(carta, puntosJugadores.length - 1);
        puntosComputadora = puntosJugadores[puntosJugadores.length-1];
        crearCarta(carta, puntosJugadores.length - 1);

        if (puntosMinimos > 21) {
            break;
        }
        } while ((puntosComputadora<puntosMinimos) && puntosMinimos<=21);
        determinarGanador();
    }

    const mensaje = () => {
        const [puntosJugador, puntosComputadora] = puntosJugadores;

        if (puntosJugador<21 && puntosComputadora>21) {
            alert('Felicidades, has ganado!');
        } else if (puntosJugador===puntosComputadora) {
            alert('Empate!');
        } else if (puntosJugador<21 && puntosComputadora<21) {
            if (puntosJugador>puntosComputadora) {
                alert('Felicidades, has ganado!');
            } else {
                alert('Has perdido :(');
            }
        } else if (puntosJugador>21){
            alert('Has perdido :(');
        } else if (puntosJugador===21){
            alert('Felicidades, has ganado!');
        }else{
            alert('Has perdido :(');
        }
    }

    //Eventos
    btnPedir.addEventListener('click', () => {
        const carta = pedirCarta();
        const puntosJugador = acumularPuntos(carta, 0);

        crearCarta(carta, 0);

        if (puntosJugador > 21) {
            console.warn('Lo siento, has perdido.');
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora(puntosJugador);
        }else if (puntosJugador === 21) {
            console.warn('21, genial!');
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora(puntosJugador);
        }
    });

    btnDetener.addEventListener('click', () => {
        btnDetener.disabled = true;
        btnPedir.disabled = true;

        turnoComputadora(puntosJugadores[0]);
    })

    //btnNuevo.addEventListener('click', () => {

    //    inicializarJuego();

    //})

    return {
        nuevoJuego: inicializarJuego
    };
})();


