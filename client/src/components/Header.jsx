import { Link } from 'react-router-dom';
import Navbar from './Navbar';

import home from '../assets/home.svg';

import './header.css';

const Header = () => {
    return (
        <header className='header'>
            <Navbar/>
            <Link to="/"><img src={home} alt="home" className='link__home'/></Link>
            <Link to="/qa-page">Доп работы</Link>
            <Link to="/favorites">Избранное</Link>
        </header>
    )
}

export default Header
