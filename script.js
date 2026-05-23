let items = JSON.parse(localStorage.getItem('cartItems'));

if (!items || items.length === 0) {
    items = [
        { id: 1, name: 'Помідори', quantity: 2, isBought: true },
        { id: 2, name: 'Печиво', quantity: 2, isBought: false },
        { id: 3, name: 'Сир', quantity: 1, isBought: false }
    ];
}

function updateApp() {
    localStorage.setItem('cartItems', JSON.stringify(items));
    renderList();
    renderStats();
}

function addItem(name) {
    if (name.trim() === '') return;
    
    items.push({
        id: Date.now(),
        name: name,
        quantity: 1,
        isBought: false
    });
    updateApp();
}

function deleteItem(id) {
    items = items.filter(item => item.id !== id);
    updateApp();
}

function toggleBoughtStatus(id) {
    let item = items.find(item => item.id === id);
    if (item) {
        item.isBought = !item.isBought;
        updateApp();
    }
}

function changeQuantity(id, changeAmount) {
    let item = items.find(item => item.id === id);
    if (item && !item.isBought) {
        item.quantity += changeAmount;
        if (item.quantity < 1) item.quantity = 1;
        updateApp();
    }
}

function editName(id, newName) {
    let item = items.find(item => item.id === id);
    if (item && !item.isBought && newName.trim() !== '') {
        item.name = newName;
        updateApp();
    }
}

function renderList() {
    const listContainer = document.querySelector('.item-list');
    if (!listContainer) return;

    listContainer.innerHTML = '';

    items.forEach(item => {
        const li = document.createElement('li');
        li.className = 'item';

        if (item.isBought) {
            const nameSpan = document.createElement('span');
            nameSpan.className = 'item-name crossed';
            nameSpan.textContent = item.name;
            li.appendChild(nameSpan);
        } else {
            const nameSpan = document.createElement('span');
            nameSpan.className = 'item-name';
            nameSpan.textContent = item.name;
            
            nameSpan.onclick = () => {
                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'item-edit-input';
                input.value = item.name;
                
                input.onblur = () => editName(item.id, input.value);
                input.onkeydown = (e) => { if (e.key === 'Enter') input.blur(); };

                li.replaceChild(input, nameSpan);
                input.focus();
            };
            li.appendChild(nameSpan);
        }

        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'item-controls';

        if (!item.isBought) {
            const minusBtn = document.createElement('button');
            minusBtn.type = 'button';
            minusBtn.className = `btn btn-danger-circle ${item.quantity === 1 ? 'disabled' : ''}`;
            minusBtn.dataset.tooltip = 'Мінімум 1';
            minusBtn.textContent = '−';
            minusBtn.disabled = item.quantity === 1;
            minusBtn.onclick = () => changeQuantity(item.id, -1);

            const qtyBadge = document.createElement('span');
            qtyBadge.className = 'quantity-badge';
            qtyBadge.textContent = item.quantity;

            const plusBtn = document.createElement('button');
            plusBtn.type = 'button';
            plusBtn.className = 'btn btn-success-circle';
            plusBtn.dataset.tooltip = 'Збільшити кількість';
            plusBtn.textContent = '+';
            plusBtn.onclick = () => changeQuantity(item.id, 1);

            controlsDiv.appendChild(minusBtn);
            controlsDiv.appendChild(qtyBadge);
            controlsDiv.appendChild(plusBtn);
        } else {
            const qtyBadge = document.createElement('span');
            qtyBadge.className = 'quantity-badge';
            qtyBadge.textContent = item.quantity;
            controlsDiv.appendChild(qtyBadge);
        }
        
        li.appendChild(controlsDiv);

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'item-actions';

        const toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.className = 'btn btn-default';
        toggleBtn.dataset.tooltip = item.isBought ? 'Позначити як не куплене' : 'Позначити як куплене';
        toggleBtn.textContent = item.isBought ? 'Не куплено' : 'Куплено';
        toggleBtn.onclick = () => toggleBoughtStatus(item.id);
        actionsDiv.appendChild(toggleBtn);

        if (!item.isBought) {
            const deleteBtn = document.createElement('button');
            deleteBtn.type = 'button';
            deleteBtn.className = 'btn btn-danger-square';
            deleteBtn.dataset.tooltip = 'Видалити товар';
            deleteBtn.textContent = '×';
            deleteBtn.onclick = () => deleteItem(item.id);
            actionsDiv.appendChild(deleteBtn);
        }

        li.appendChild(actionsDiv);
        listContainer.appendChild(li);
    });
}

function renderStats() {
    const statsContainers = document.querySelectorAll('.tags-container');
    if (statsContainers.length < 2) return;

    const neededContainer = statsContainers[0];
    const boughtContainer = statsContainers[1];

    neededContainer.innerHTML = '';
    boughtContainer.innerHTML = '';

    const neededItems = items.filter(i => !i.isBought);
    const boughtItems = items.filter(i => i.isBought);

    neededItems.forEach(item => {
        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.innerHTML = `${item.name} <span class="tag-count">${item.quantity}</span>`;
        neededContainer.appendChild(tag);
    });

    boughtItems.forEach(item => {
        const tag = document.createElement('span');
        tag.className = 'tag crossed';
        tag.innerHTML = `${item.name} <span class="tag-count">${item.quantity}</span>`;
        boughtContainer.appendChild(tag);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.add-item-form');
    const inputField = document.querySelector('.add-item-form input');
    const addBtn = document.querySelector('.add-item-form .btn-primary');

    if (form && inputField && addBtn) {
        const handleAdd = (e) => {
            e.preventDefault();
            addItem(inputField.value);
            inputField.value = '';
            inputField.focus();
        };

        form.onsubmit = handleAdd;
        addBtn.onclick = handleAdd;
    }

    updateApp();
});