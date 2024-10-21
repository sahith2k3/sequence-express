var x;
var selectedHandCard;

document.addEventListener('DOMContentLoaded', () => {
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const socket = new WebSocket(`${protocol}://${window.location.host}`);

    let clientID;
    const username = window.username;

    // Connection opened
    socket.addEventListener('open', (event) => {
      console.log('WebSocket connection established');
      
      // Send a message to the server
      socket.send(JSON.stringify({ type: 'join', username: username }));
    });
  
    // Listen for messages from the server
    socket.addEventListener('message', (event) => {
      console.log('Message from server: ', event.data);

      const message = JSON.parse(event.data);


      if (message.type === 'hand') {
        console.log('Initial hand: ', message.hand);

        const handCardDiv = document.getElementById('hand-cards');
        handCardDiv.innerHTML = '';
        message.hand.forEach(card => {
            const img = document.createElement('img');
            img.src = `images/${card}.png`
            img.classList.add('hand_card');
            img.id = card;
            handCardDiv.appendChild(img);

            img.addEventListener('click',()=>{
              handleClick(card);
            })
        });
        
        var $cards = $(".hand_card");
        var $style = $(".hover");

        $cards.on("mousemove touchmove", function(e) { 
          // normalise touch/mouse
          var pos = [e.offsetX,e.offsetY];
          e.preventDefault();
          if ( e.type === "touchmove" ) {
          pos = [ e.touches[0].clientX, e.touches[0].clientY ];
          }
          var $card = $(this);
          // math for mouse position
          var l = pos[0];
          var t = pos[1];
          var h = $card.height();
          var w = $card.width();
          var px = Math.abs(Math.floor(100 / w * l)-100);
          var py = Math.abs(Math.floor(100 / h * t)-100);
          var pa = (50-px)+(50-py);
          // math for gradient / background positions
          var lp = (50+(px - 50)/1.5);
          var tp = (50+(py - 50)/1.5);
          var px_spark = (50+(px - 50)/7);
          var py_spark = (50+(py - 50)/7);
          var p_opc = 20+(Math.abs(pa)*1.5);
          var ty = ((tp - 50)/2) * -1;
          var tx = ((lp - 50)/1.5) * .5;
          // css to apply for active card
          var grad_pos = `background-position: ${lp}% ${tp}%;`
          var sprk_pos = `background-position: ${px_spark}% ${py_spark}%;`
          var opc = `opacity: ${p_opc/100};`
          var tf = `transform: rotateX(${ty}deg) rotateY(${tx}deg) translateY(-50px)`
          // need to use a <style> tag for psuedo elements
          var style = `
          .card:hover:before { ${grad_pos} }  /* gradient */
          .card:hover:after { ${sprk_pos} ${opc} }   /* sparkles */ 
          `
          // set / apply css class and style
          
          $cards.removeClass("active");
          $card.removeClass("animated");
          $card.attr( "style", tf );
          $style.html(style);
          if ( e.type === "touchmove" ) {
          return false; 
          }
          clearTimeout(x);
      }).on("mouseout touchend touchcancel", function() {
          // remove css, apply custom animation on end
          var $card = $(this);
          $style.html("");
          $card.removeAttr("style");
          x = setTimeout(function() {
          $card.addClass("animated");
          },2500);
      });

  }
    });


  
    // Send a message when a player makes a move (you can call this function when needed)
    const sendMove = (moveData) => {
      socket.send(JSON.stringify(moveData)); // Send move data as a JSON string
    };
    
  });

  const boardCards = document.querySelectorAll('.board .card');
  boardCards.forEach((card)=>{
    card.addEventListener('mousemove',(e)=>{
        handleMove(e,card)
    })
  })

  function handleMove(e,cardElement){
    if(!selectedHandCard) return ;

    let name = cardElement.alt;

    if(name === selectedHandCard){
        cardElement.addEventListener('click',()=> dummy(cardElement));
    }else{
        cardElement.removeEventListener('click',dummy)
    }
  }

  function handleClick(card){
    console.log(`Clicked Card ${card}`);
    selectedHandCard = card;
  }

  function dummy(c) {
    console.log('Matches');

    // Remove the card from the hand
    if(selectedHandCard){
      const handCardDiv = document.getElementById('hand-cards');
      const card = document.getElementById(selectedHandCard);

      if(card){
        handCardDiv.removeChild(card);
      }

    }
}


