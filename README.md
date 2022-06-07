# subathon-timer

***Update:** Currently, most of Indonesia's donation platform already has a subathon timer feature, so this program is now useless. Unless you still want to add more time for every new Youtube membership, this program may be still useful.*

This is my personal tool that I used on my Youtube subathon (subscriber marathon) challenge. The timer automatically increases if someone subscribes, joins membership, or makes a donation, so that I don't have to do it manually.

Disclaimer: The code is simply a crap, because I just write it on rush for my personal use... and fortunately, it works!

# Tool used
- Saweria - as the donation platform (in Indonesia)
- Streamlabs - as the streaming software and connect to Youtube API
- Node.js - as the core 

# Preparation
- Install Node.js (LTS version is recomended)
- Download all of the file in this repo
- Create new folder and paste files into the folder
- Shift + right click inside the folder, then "Open PowerShell window here" 
- Install required packages using these code:
```
npm install socket.io-client@2.1
npm install saweria
npm install timer-stopwatch
npm install cluster
````

# How to use
- Open `subathon.js` file using text editor
- Edit the data in line 12 to line 16 with your preferences and input your Streamlabs Socket API and Saweria Stream Key
  - You can get your Streamlabs Socket API [from here](https://streamlabs.com/dashboard#/settings/api-settings) > API Tokens > Your Socket API Token
  - You can get your Saweria Stream Key [from here](https://saweria.co/overlays) > URL > StreamKey
- Create a text source in Streamlabs and connect to local file `clock.txt` inside the folder
- Edit `target_time.txt` with the time you want to set in miliseconds (ex: if you want to set 1 hour timer, write 3600000)
- Open Command Prompt in your folder (by typing `cmd` in your windows explorer adress)
- `node subathon.js`
- Voila! It works!
