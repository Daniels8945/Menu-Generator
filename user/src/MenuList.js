
const MenuList = ({ menus }) => {
   
    return (
        // <div className="menu-list">
        //     { menus.map((menu) =>(
        //         <ul className="menu-preview">
        //             <li key={ menu.id }>
        //                 <h3> { menu.category }</h3>
        //                 <h2> { menu.name }</h2>
        //                 <span>{ menu.price }</span>
        //             </li>
        //         </ul>
        //     ))}
        // </div>

        <div className="menu-list">
                { menus.map((menu) => (
                <div className='menu-preview' key={ menu.id }>
                    <h3> { menu.category }</h3>
                    <h2> { menu.name }</h2>
                    <span>{ menu.price }</span>
                </div>
            ))}
        </div>
    );
}
export default MenuList;

