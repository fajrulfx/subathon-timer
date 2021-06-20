const io = require('socket.io-client');
const SaweriaClient = require("saweria");
const fsLibrary  = require('fs')
var Stopwatch = require('timer-stopwatch');

var sub_time = 5; //second
var member1_time = 60; //second
var member2_time = 180; //second
var member3_time = 600; //second
var sawer_time = 60; //second added per Rp 10.000
var streamlabs_socket_api = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
var saweria_key = 'xxxxxxxxxxxxxxxxxxxxxxxx';

var insert_time = fsLibrary.readFileSync('target_time.txt','utf8')

var options = {
    refreshRateMS: 1000,		
}

var timer = new Stopwatch(insert_time, options);
timer.start();

const streamlabs = io(`https://sockets.streamlabs.com?token=${streamlabs_socket_api}`, {transports: ['websocket']});
    
streamlabs.on('connect', () => { console.log('Connect to Youtube...');});

var client = new SaweriaClient();
client.setStreamKey(saweria_key);

var cluster = require('cluster');

if (cluster.isMaster) {
  cluster.fork();

  cluster.on('exit', function(worker, code, signal) {
    cluster.fork();
  });
}

if (cluster.isWorker) {
    var client = new SaweriaClient();
    setInterval(function() {
        console.log('Connect to Saweria...')
        client.setStreamKey(saweria_key);
    }, 1 * 60 * 1000);   
    
    timer.onTime(function(time) { //process per 1000ms
        var hours = Math.floor(timer.ms / (1000 * 60 * 60));
        var minutes = Math.floor((timer.ms % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((timer.ms % (1000 * 60)) / 1000);
        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;
    
        var countdown = hours + " : " + minutes	+ " : " + seconds 
        fsLibrary.writeFile('clock.txt', countdown, (error) => {
            if (error) throw err;})
        var save_time = timer.ms.toString();
        fsLibrary.writeFile('target_time.txt', save_time, (error) => {
            if (error) throw err;})
    });
    
    streamlabs.on('event', eventData => {
        if(eventData.for === 'youtube_account' && eventData.type === 'follow'){
            console.log('Subscribe ', eventData.message[0].name, ' | Tambah ', sub_time, ' detik');
            timer.reset(timer.ms + sub_time*1000);
            timer.start()
        }
        if(eventData.for === 'youtube_account' && eventData.type === 'subscription'){
            if(eventData.message[0].membershipLevel === 1){
                console.log('Member X ', eventData.message[0].name + ' | Tambah ', member1_time, ' detik');
                timer.reset(timer.ms + member1_time*1000);
                timer.start()
            }
            if(eventData.message[0].membershipLevel === 2){
                console.log('Member Y ', eventData.message[0].name + ' | Tambah ', member2_time, ' detik');
                timer.reset(timer.ms + member2_time*1000);
                timer.start()
            }
            if(eventData.message[0].membershipLevel === 3){
                console.log('Member Z ', eventData.message[0].name + ' | Tambah ', member3_time, ' menit');
                timer.reset(timer.ms + member3_time*1000);
                timer.start()
            }
        }
    });
    
    client.on("donations", (donations) => {
        console.log('Donate ' + donations[0].amount + ' ' + donations[0].donator + ' | Tambah ' + Math.floor(donations[0].amount/10000)*sawer_time + ' detik')
        timer.reset(timer.ms + Math.floor(donations[0].amount/10000)*sawer_time*1000);
        timer.start()
    });
}
