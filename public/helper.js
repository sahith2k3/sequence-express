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

        img.addEventListener('click', () => {
          handleClick(card);
        })
      });

      var $cards = $(".hand_card");
      var $style = $(".hover");

      $cards.on("mousemove touchmove", function (e) {
        highlightcards(this.id);
        console.log(this.id);
        // normalise touch/mouse
        var pos = [e.offsetX, e.offsetY];
        e.preventDefault();
        if (e.type === "touchmove") {
          pos = [e.touches[0].clientX, e.touches[0].clientY];
        }
        var $card = $(this);
        // math for mouse position
        var l = pos[0];
        var t = pos[1];
        var h = $card.height();
        var w = $card.width();
        var px = Math.abs(Math.floor(100 / w * l) - 100);
        var py = Math.abs(Math.floor(100 / h * t) - 100);
        var pa = (50 - px) + (50 - py);
        // math for gradient / background positions
        var lp = (50 + (px - 50) / 1.5);
        var tp = (50 + (py - 50) / 1.5);
        var px_spark = (50 + (px - 50) / 7);
        var py_spark = (50 + (py - 50) / 7);
        var p_opc = 20 + (Math.abs(pa) * 1.5);
        var ty = ((tp - 50) / 2) * -1;
        var tx = ((lp - 50) / 1.5) * .5;
        // css to apply for active card
        var grad_pos = `background-position: ${lp}% ${tp}%;`
        var sprk_pos = `background-position: ${px_spark}% ${py_spark}%;`
        var opc = `opacity: ${p_opc / 100};`
        var tf = `transform: rotateX(${ty}deg) rotateY(${tx}deg) translateY(-50px)`
        // need to use a <style> tag for psuedo elements
        var style = `
          .card:hover:before { ${grad_pos} }  /* gradient */
          .card:hover:after { ${sprk_pos} ${opc} }   /* sparkles */ 
          `
        // set / apply css class and style

        $cards.removeClass("active");
        $card.removeClass("animated");
        $card.attr("style", tf);
        $style.html(style);
        if (e.type === "touchmove") {
          return false;
        }
        clearTimeout(x);
      }).on("mouseout touchend touchcancel", function () {
        removeHighlight();
        // remove css, apply custom animation on end
        var $card = $(this);
        $style.html("");
        $card.removeAttr("style");
        x = setTimeout(function () {
          $card.addClass("animated");
        }, 2500);
      });

    }
  });



  // Send a message when a player makes a move (you can call this function when needed)
  const sendMove = (moveData) => {
    socket.send(JSON.stringify(moveData)); // Send move data as a JSON string
  };

  const boardCards = document.querySelectorAll('.board .card-container');

  boardCards.forEach((card) => {
    card.addEventListener('click', (e) => {
      handleMove(e, card)
    })
  })

  function handleMove(e, cardElementDiv) {
    if (!selectedHandCard) return;
    //get img element in cardElementDiv
    const cardElement = cardElementDiv.querySelector('.card');

    console.log('Selected card: ', cardElement.alt);
    let name = cardElement.alt;

    if (name === selectedHandCard) {
      cardElement.addEventListener('click', () => dummy(cardElementDiv));

      //TODO : send to server which card was selected
      socket.send(JSON.stringify({ type: 'move', card: selectedHandCard, index: cardElementDiv.data-card-name }));

    } else {
      cardElement.removeEventListener('click', dummy)
    }
  }

  var highlightedcards = [];

  function highlightcards(card) {
    let cards = document.querySelectorAll('.board .card');
    // console.log(cards);

    cards.forEach((c) => {
      if (c.alt === card) {
        c.classList.add('highlight');
        highlightedcards.push(c);
        return c;
      }
    });
  }

  function removeHighlight() {
    highlightedcards.forEach((c) => {
      c.classList.remove('highlight');
    });
  }

  function handleClick(card) {
    removeHighlight();
    console.log(`Clicked Card ${card}`);
    selectedHandCard = card;

    highlightcards(card);
  }

  function dummy(boardCardDivElement) {
    console.log('Matches');
  
    // Remove any existing highlights
    removeHighlight();
  
    // Remove the card from the hand if it exists
    if (selectedHandCard) {
      const handCardDiv = document.getElementById('hand-cards');
      const card = document.getElementById(selectedHandCard);
  
      if (card) {
        handCardDiv.removeChild(card);
      }
    }
  
    // Draw a circle on the board card element
    drawCircleOnCard(boardCardDivElement);
  }
  
  function drawCircleOnCard(cardDivElement) {
    // Remove any existing circle to avoid duplicates
    const existingCircle = cardDivElement.querySelector('.circle');
    if (existingCircle) {
      cardDivElement.removeChild(existingCircle);
    }
  
    // Create a new circle element
    const circle = document.createElement('div');
    circle.classList.add('circle');
  
    // Append the circle to the card element
    cardDivElement.appendChild(circle);
  }

});