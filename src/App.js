import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import NavbarBrand from "react-bootstrap/NavbarBrand";
import Nav from "react-bootstrap/Nav";
//import axios from 'axios';
import ReactPlayer from "react-player";
import './App.css';
import Splash from "./components/Splash";
import m3uList from "./sources/m3u"

// these channels are excluded as their CORS policies don't allow them to load
//const excludedChannels = [
//    "tv.28",
//    "tv.37",
//    "tv.58",
//    "tv.21",
//    "tv.36",
//    "tv.49",
//    "tv.63",
//    "tv.56"
//];

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            channels: [],
            selected: null
        };
        this.chooseChannel = this.chooseChannel.bind(this);
        this.getChannelList = this.getChannelList.bind(this);
    }

    async componentDidMount() {
        await this.getChannelList();
    }

    async getChannelList() {
        // const res = await axios.get('https://i.mjh.nz/nz/tv.json');
        // const channelList = res.data;
        console.log(m3uList); 
        const channelList = m3uList.channels;
        console.log(channelList);

        //Object.keys(channelList)
        //    .filter(key => excludedChannels.includes(key))
        //    .forEach(key => delete channelList[key]);
        
        this.setState({
            channels: channelList
        });
    }

    getSecureStreamingUrl(channel) {
        //const uri = channel.mjh_master.split('//')[1];
        //return 'https://' + uri;
        return channel.url;
    }

    chooseChannel(e, channel) {
        e.preventDefault();
        this.setState({
            selected: channel
        })
    }

    render() {
        const channels = this.state.channels.map(ch => (
            <NavDropdown.Item key={ch.id} onClick={(e) => this.chooseChannel(e, ch)}>{ch.name}</NavDropdown.Item>));

        return (
            <Container fluid style={{backgroundColor: 'black'}}>
                <Navbar bg="dark" variant="dark">
                    <NavbarBrand>Freeview NZ</NavbarBrand>
                    <Nav className="mr-auto">
                        <NavDropdown id="channelDropdown" title="Channels">
                            {channels}
                        </NavDropdown>
                    </Nav>
                    {this.state.selected ?
                        <Navbar.Text>
                            Currently Playing: {this.state.selected.name}
                        </Navbar.Text>
                    : null}
                </Navbar>
                <ReactPlayer className="player-wrapper" url={this.state.selected ? this.getSecureStreamingUrl(this.state.selected) : ''} controls playing width='100%'
                             height='100%'/>
                {this.state.selected === null ? <Splash/> : null}
            </Container>
        );
    }
}

export default App;
