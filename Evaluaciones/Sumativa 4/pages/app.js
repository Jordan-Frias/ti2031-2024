document.addEventListener('DOMContentLoaded', function() {
    const nicknameForm = document.getElementById('nicknameForm');
    const nombreInput = document.getElementById('nombre');
    const apellidoInput = document.getElementById('apellido');
    const emailInput = document.getElementById('email');
    const nicknameInput = document.getElementById('nickname');
    const bienvenida = document.getElementById('bienvenida');
    const nicknameDisplay = document.getElementById('nicknameDisplay');
    const logoutButton = document.getElementById('logout');
    const gameList = document.getElementById('gameList');
    const cart = document.getElementById('cart');
    const agendarPedidoBtn = document.createElement('button');

    let user = null;
    let cartItems = [];
    let currentLocation = null;

    agendarPedidoBtn.textContent = "Agendar Pedido";
    agendarPedidoBtn.style.display = 'none';
    agendarPedidoBtn.addEventListener('click', function() {
        alert('Tu pedido se ha agendado :)');
        cartItems = [];
        currentLocation = null;
        renderCart();
        renderCatalog();
    });

    nicknameForm.addEventListener('submit', function(event) {
        event.preventDefault();
        user = {
            nombre: nombreInput.value,
            apellido: apellidoInput.value,
            email: emailInput.value,
            nickname: nicknameInput.value
        };
        updateNicknameDisplay();
        renderCatalog();
    });

    logoutButton.addEventListener('click', function() {
        user = null;
        cartItems = [];
        currentLocation = null;
        updateNicknameDisplay();
        renderCatalog();
        renderCart();
    });

    function updateNicknameDisplay() {
        if (user) {
            nicknameForm.style.display = 'none';
            bienvenida.style.display = 'block';
            nicknameDisplay.textContent = `${user.nombre} ${user.apellido} (${user.nickname})`;
        } else {
            nicknameForm.style.display = 'block';
            bienvenida.style.display = 'none';
            nombreInput.value = '';
            apellidoInput.value = '';
            emailInput.value = '';
            nicknameInput.value = '';

            
            nicknameForm.style.padding = '20px';
            nicknameForm.style.background = 'rgba(255, 255, 255, 0.1)';
            nicknameForm.style.borderRadius = '5px';
            nicknameForm.style.width = '50%';
            nicknameForm.style.margin = '0 auto';
            nicknameForm.style.textAlign = 'center';
            nicknameForm.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
        }
    }

    const catalog = [
        { id: 1, name: 'Catan', image: 'imagenes/Catan.jpeg', available: 5, location: 'INACAP La Granja' },
        { id: 2, name: 'Cthulhu', image: 'imagenes/Cthulhu.jpeg', available: 3, location: 'INACAP La Granja' },
        { id: 3, name: 'D&D', image: 'imagenes/D&D.jpeg', available: 2, location: 'INACAP La Granja' },
        { id: 4, name: 'Dixit', image: 'imagenes/Dixit.jpeg', available: 4, location: 'INACAP Renca' },
        { id: 5, name: 'Numenera', image: 'imagenes/Numenera.jpeg', available: 6, location: 'INACAP Renca' },
        { id: 6, name: 'Pathfinder', image: 'imagenes/pathfinder.jpeg', available: 7, location: 'INACAP Renca' },
        { id: 7, name: 'Pictionary', image: 'imagenes/Pictionary.jpeg', available: 8, location: 'INACAP Ñuñoa' },
        { id: 8, name: 'Risk', image: 'imagenes/Risk.jpeg', available: 9, location: 'INACAP Ñuñoa' },
        { id: 9, name: 'TEG', image: 'imagenes/TEG.jpeg', available: 10, location: 'INACAP Ñuñoa' },
        { id: 10, name: 'Uno', image: 'imagenes/Uno.jpeg', available: 11, location: 'INACAP Santiago Sur' },
        { id: 11, name: 'Vampire', image: 'imagenes/Vampire.jpeg', available: 12, location: 'INACAP Santiago Sur' },
        { id: 12, name: 'Warhammer', image: 'imagenes/Warhammer.jpeg', available: 13, location: 'INACAP Santiago Sur' },
    ];

    function renderCatalog() {
        gameList.innerHTML = '';
        catalog.forEach(item => {
            const gameElement = document.createElement('div');
            gameElement.classList.add('game');
            gameElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <p>${item.name}</p>
                <p>Sede: ${item.location}</p>
                <p>Disponibles: ${item.available}</p>
                <button ${!user ? 'disabled' : ''} data-id="${item.id}">Agregar al Carrito</button>
            `;
            gameList.appendChild(gameElement);
        });

        const buttons = document.querySelectorAll('button[data-id]');
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                addToCart(id);
            });
        });
    }

    function addToCart(id) {
        const item = catalog.find(product => product.id === id);
        if (item && item.available > 0) {
            if (currentLocation === null || currentLocation === item.location) {
                const cartItem = cartItems.find(product => product.id === id);
                if (cartItem) {
                    if (cartItem.quantity < item.available + cartItem.quantity) {
                        cartItem.quantity++;
                        item.available--;
                    }
                } else {
                    cartItems.push({ ...item, quantity: 1 });
                    item.available--;
                    currentLocation = item.location;
                }
                renderCatalog();
                renderCart();
            } else {
                alert('Solo puedes agregar juegos de la misma sede.');
            }
        }
    }

    function renderCart() {
        cart.innerHTML = '';
        if (cartItems.length === 0) {
            cart.innerHTML = '<p>El carrito está vacío.</p>';
            agendarPedidoBtn.style.display = 'none';
            currentLocation = null;
            return;
        }
        cartItems.forEach(item => {
            const cartElement = document.createElement('div');
            cartElement.classList.add('cart-item');
            cartElement.innerHTML = `
                <p>${item.name} - Cantidad: 
                    <input type="number" min="1" max="${item.available + item.quantity}" value="${item.quantity}" data-id="${item.id}">
                - Sede: ${item.location}</p>
                <button data-id="${item.id}">Eliminar</button>
            `;
            cart.appendChild(cartElement);
        });

        cart.appendChild(agendarPedidoBtn);
        agendarPedidoBtn.style.display = 'block';

        const buttons = cart.querySelectorAll('button[data-id]');
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                removeFromCart(id);
            });
        });

        const inputs = cart.querySelectorAll('input[type="number"]');
        inputs.forEach(input => {
            input.addEventListener('change', function() {
                const id = parseInt(this.getAttribute('data-id'));
                const newQuantity = parseInt(this.value);
                updateCartQuantity(id, newQuantity);
            });
        });
    }

    function updateCartQuantity(id, newQuantity) {
        const cartItem = cartItems.find(product => product.id === id);
        if (cartItem) {
            const catalogItem = catalog.find(product => product.id === id);
            const difference = newQuantity - cartItem.quantity;
            if (difference <= catalogItem.available) {
                cartItem.quantity = newQuantity;
                catalogItem.available -= difference;
                renderCatalog();
                renderCart();
            } else {
                alert('No hay suficientes productos disponibles.');
                renderCart(); 
            }
        }
    }

    function removeFromCart(id) {
        const cartItem = cartItems.find(product => product.id === id);
        if (cartItem) {
            const catalogItem = catalog.find(product => product.id === id);
            catalogItem.available += cartItem.quantity;  
            cartItems = cartItems.filter(product => product.id !== id);
            renderCatalog();
            renderCart();
        }
    }

    renderCatalog();
    renderCart();
});