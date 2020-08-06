import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import NavbarBrand from "react-bootstrap/NavbarBrand";
import Nav from "react-bootstrap/Nav";
//import axios from 'axios';
import './App.css';
import vlcUtil from "./utils/vlcUtil";
import EPG, { Channel, TimeLine, TimeSlot, Show } from 'react-epg';

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
        // TODO: do not hardcode!
        var fileName = "file:///home/david/projects/iptv/src/sources/detroit.m3u";

        await vlcUtil.loadFile(fileName);
        var playListData = await vlcUtil.getCurrentPlaylist();
        console.log(playListData);
 
        const channelList = playListData;
        console.log('channelList', channelList);

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

    async chooseChannel(e, channel) {        
        e.preventDefault();

        console.log('Changed Channel 2', channel);
        var playResult = await vlcUtil.play(channel.id);
        console.log('playResult', playResult);
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
                <EPG>
    <TimeLine channel={<Channel name="Sky" />}>
      <TimeSlot start={new Date('1/1/97 16:00')} end={new Date('1/1/97 16:30')}>
        <Show title="The Simpsons" />
      </TimeSlot>
      <TimeSlot start={new Date('1/1/97 16:30')} end={new Date('1/1/97 17:30')}>
        <Show title="Inception" />
      </TimeSlot>
    </TimeLine>
    <TimeLine channel={<Channel name="Dave" />}>
      <TimeSlot start={new Date('1/1/97 16:00')} end={new Date('1/1/97 17:00')}>
        <Show title="Top Gear" />
      </TimeSlot>
      <TimeSlot start={new Date('1/1/97 17:00')} end={new Date('1/1/97 18:45')}>
        <Show title="Shrek 3" />
      </TimeSlot>
    </TimeLine>
  </EPG>
               
            </Container>
        );
    }
}

export default App;
