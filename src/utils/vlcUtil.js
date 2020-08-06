class vlcUtil {

    vclUrl = 'http://localhost:8181/';

    add(num1, num2) {
        console.log(num1);
        console.log(num2);
        return num1 + num2;
    }

    async runVlc(command) {
        let url = this.vclUrl + command;

        try {
            const response = await fetch(url);
            return await response.text();
        }
        catch (error) {
            return console.error(error);
        }
    }

    async loadFile(fileName) {
        var loadm3UCommand = 'in_play&input=' + fileName;//file:///home/david/projects/iptv/src/sources/detroit.m3u";

        try {
            // Won't wait for this to finish... just assume it is correct        
            this.runVlc('pl_empty');
            const jsonData = await this.runVlc(loadm3UCommand);
            
            // Need to call the stop command because it will autoplay
            this.runVlc('pl_stop');
            return JSON.parse(jsonData);
        }
        catch (error) {
            return console.error(error);
        }
    } 

    async getCurrentPlaylist() {
        try {
            const playlist = await this.runVlc('playlist');

            var actualChannels = JSON.parse(playlist).item.item[0].item;
            
            if (actualChannels) {
                var cleanChannels = actualChannels.map(function (channel) {
                    var cleanChannel = channel._attributes;
                    cleanChannel.id = cleanChannel.id.substr(5);
                
                    return cleanChannel;
                });

                return cleanChannels;
            }

            return [];
        }
        catch (error) {
            return console.error(error);
        }
    }

    async play(id) {
        return this.runVlc('pl_play&id=' + id);
    }

}
   
export default new vlcUtil();