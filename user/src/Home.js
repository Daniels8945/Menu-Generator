import useFetch from './UseFetch';
import MenuList from './MenuList';

const Home = () => {
    const { data: menus, isPending, error } = useFetch('http://localhost:5000/all_menu');
  
    return (
        <div className="home">
             { error && <div>{ error }</div>}
             { isPending && <div>Loading...</div>}
            { menus && <MenuList menus={ menus } />}
        </div>
    );
}
export default Home;