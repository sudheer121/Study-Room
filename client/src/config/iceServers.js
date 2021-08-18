// STUN/TURN servers for voice channel 
export const iceServerConfig = (twilioObj) => {
    return {
        config : {
        'iceServers' : [
        {
            url: 'stun:global.stun.twilio.com:3478?transport=udp',
            urls: 'stun:global.stun.twilio.com:3478?transport=udp'
        },
        {
            url: 'turn:numb.viagenie.ca',
            credential: 'muazkh',
            username: 'webrtc@live.com'
        },
        {
            url: 'turn:192.158.29.39:3478?transport=udp',
            credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
            username: '28224511:1379330808'
        },
        {
            url: 'turn:192.158.29.39:3478?transport=tcp',
            credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
            username: '28224511:1379330808'
        },
        {
            url: 'turn:turn.bistri.com:80',
            credential: 'homeo',
            username: 'homeo'
        },
        {
            url: 'turn:turn.anyfirewall.com:443?transport=tcp',
            credential: 'webrtc',
            username: 'webrtc'
        },  
        //remove the below three objects if you are running locally without twilio 
        {
            url: 'turn:global.turn.twilio.com:3478?transport=udp',
            username : twilioObj.username,
            urls: 'turn:global.turn.twilio.com:3478?transport=udp',
            credential: twilioObj.cred
        },
        {
            url: 'turn:global.turn.twilio.com:3478?transport=tcp',
            username: twilioObj.username,
            urls: 'turn:global.turn.twilio.com:3478?transport=tcp',
            credential: twilioObj.cred
        },
        {
            url: 'turn:global.turn.twilio.com:443?transport=tcp',
            username:twilioObj.username,
            urls: 'turn:global.turn.twilio.com:443?transport=tcp',
            credential: twilioObj.cred
        }
        ]
        } 
    };
}
