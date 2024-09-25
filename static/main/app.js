document.addEventListener('DOMContentLoaded', function() {

    // dropdown buttons to add to 
    const dropMenu = document.getElementById('dropdown');
    const nav = document.getElementsByTagName('nav')[1];
    const addMenu = document.getElementById('add-menu');
    const arrow = document.getElementsByTagName('svg')[0];
    const submitBtn = document.getElementById('menu-form');
    const txtInpt = document.querySelectorAll('input');

    // dropddown event for add to menu button
    function dropBtn(){
        document.getElementById('dropdownbtn').addEventListener('click', () =>{
            dropMenu.classList.toggle('show');
            arrow.classList.toggle('svg');

            if (dropMenu.classList.contains('show')) {
                nav.classList = '';
                addMenu.style = 'height: 245px'
                addMenu.style = 'padding: 10px'
            } else {
                addMenu.style = 'height: 0px';
                nav.classList = 'position: absolute';
            }
            clearInput();
        });
    }
    dropBtn();

    function emptyInput(event){
    if (!txtInpt[0].value || !txtInpt[1].value|| !txtInpt[2].value ){
        clearInput()
        }else {
            submitMenu()
            closeDropdown()
        }
    }

    // keypad and Enter key function
    document.addEventListener('submit', function(event){
        if ((event.code === 'Enter' || event.code === 'NumpadEnter') && submitBtn){
            event.preventDefault()
            emptyInput()
        }
    })

    submitBtn.addEventListener('submit', function(event){
        event.preventDefault();
        emptyInput()
    })

    // input clear
    function clearInput(){
        txtInpt[0].value = '';
        txtInpt[1].value = '';
        txtInpt[2].value = '';
    };

    //function to close form on click create menu or press enter
    function closeDropdown(){
        if(dropMenu.classList.contains('show')){
            dropMenu.classList.toggle('show');
            arrow.classList.toggle('svg');
            addMenu.style = 'height: 0px';
            nav.classList = 'position: absolute';
        } 
    }


    // input variable
    const menuName = document.getElementById('name');
    const menuCategory = document.getElementById('category');
    const menuPrice = document.getElementById('price');

    function submitMenu(){
        const data = {
            name: menuName.value,
            category: menuCategory.value,
            price: parseFloat(menuPrice.value)
            // name: txtInpt[0].value,
            // category: txtInpt[1].value,
            // price: parseFloat(txtInpt[2].value)
        };

        fetch('/add_menu',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            if(data.success){      
        // dynamiclly Creating the elements
        const list = document.querySelector('#list ul');
        const li = document.createElement('li');
        li.dataset.id = data.id;
        li.innerHTML = `
            <span>${data.name}</span>
            <span>${data.category}</span>
            <span>${data.price}</span>
            <span>${new Date().toLocaleDateString()}</span>
            <span>${new Date().toLocaleDateString()}</span>
            <span class="status">Hidden</span>
            <span class="action-dropdown">
                <button class="action">...</button>
                <div class="dropdown-content">
                    <button class="edit" data-id="${data.id}">Edit</button>
                    <button class="remove" data-id="${data.id}">Delete</button>
                </div>
            </span>
        `;


        // const foodName = document.createElement('span');
        // const foodCategory = document.createElement('span');
        // const foodPrice = document.createElement('span');
        // foodName.textContent = menuName.value;
        // foodCategory.textContent = menuCategory.value;
        // foodPrice.textContent =  menuPrice.value;
        
        // Appending eliments to the DOM
        list.appendChild(li);
        // li.appendChild(foodName);
        // li.appendChild(foodCategory);
        // li.appendChild(foodPrice);

        clearInput()
        } else {
            console.error('Failed to add menu item:', data.error)
            }
                }).catch(error => console.error('Error:', error))
    }

    const actionBtn = document.querySelectorAll('.action');
    const actionContent = document.querySelectorAll('.dropdown-content');

    function toggleAction(dropDwn){
        dropDwn.classList.toggle('show-action');
    }

    actionBtn.forEach((actionBtn) =>{   
        actionBtn.addEventListener('click', (event) => {

        const dropDwn = actionBtn.nextElementSibling;
        if(dropDwn && dropDwn.classList.contains('dropdown-content')){
            toggleAction(dropDwn)
            }
            event.stopPropagation()

        })
    })

    document.documentElement.addEventListener('click', ()=>{
        actionContent.forEach((dropDwn) => {
            if (dropDwn.classList.contains('show-action')){
                toggleAction(dropDwn);
            }
        })
    })

    // remove function
    function removeMenu(event, id){
        if(!id){
            console.error('Error: ID is undefinde');
            return
        };

        fetch('/delete_menu/' + id, {
            method: 'DELETE',
            headers: {
            'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if(data.success){

                const removeList = event.target.closest('li');
                if (removeList) {
                    const list = document.querySelector('#list ul');
                    list.removeChild(removeList); 
                } else {
                    console.error('Failed to delete menu item:', data.error);
                }
            }
        })
        .catch(error => console.error('Error:', error))
        
        const removeList = event.target.closest('li');
        if (removeList) {
            const list = document.querySelector('#list ul');
            list.removeChild(removeList);
        }
    }

    window.addEventListener('DOMContentLoaded', () => {
        const remove = document.querySelectorAll('.remove')
        remove.forEach((remove) => {
            remove.addEventListener('click', function(event){
                const id = this.dataset.id
            removeMenu(event, id)
            });
        });
    });
});