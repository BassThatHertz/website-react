import { Link } from 'react-router-dom';
const topBar = () => {
    return (
        <div className="top">
            <Link to="javascript:void(0);" className="hamburger"> <i className="fa fa-bars"></i></Link>
            <Link to="/">Home</Link>
            <Link to="about">About</Link>
            <Link to="filetypes">Filetypes</Link>
            <Link to="yt">YT downloader</Link>
            <Link to="trimmer">Audio Trimmer</Link>
            <Link to="contact">Contact</Link>
            <Link to="game">Game 1</Link>
            <Link to="game2">Game 2</Link>
            <Link to="chat">Chat</Link>
            <div id='coffee'>
                <script type="text/javascript" src="https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js" data-name="bmc-button" data-slug="fezcgrfkb" data-color="#000000" data-emoji="" data-font="Cookie" data-text="Buy me a coffee" data-outline-color="#fff" data-font-color="#fff" data-coffee-color="#fd0" ></script>
            </div>
        </div>
    )
}
export default topBar;