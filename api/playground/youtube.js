require('dotenv').config();
const { response } = require('express');
const { google } = require('googleapis')

google.youtube('v3').search.list({
    key: process.env.YOUTUBE_TOKEN,
    part: 'snippet',
    q: 'joji'
}).then((res) => {
    const { data } = res
    data.items.forEach((item) => {
        console.log(`Title: ${item.snippet.title}\nDescription: ${item.snippet.description}\nVideoID: ${item.id.videoId}\n`)
    })
}).catch((e) => {
    console.log(e)
})