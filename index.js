const fetch = require('node-fetch');
const delay = require('delay');
const cheerio = require('cheerio');
const { URLSearchParams } = require('url');
const readline = require("readline-sync");
const rp = require('request-promise');
var random = require('random-name')
var randomize = require('randomatic')
const ipv4gen = require("ipv4-gen");

const functionGoRegist = (ip, name, email, reff) => new Promise((resolve, reject) => {
    const params = new URLSearchParams;
    params.append('_csrf', 'NVF1bFYtWVdmPSQ6ZxwwNl0zMlQTbxQ0czM2GhkaEBpdOhMEOhs/FA==');
    params.append('Entries[contest_id]', '23657');
    params.append('Entries[referrer_id]', reff);
    params.append('Entries[registration_ip]', ip);
    params.append('Entries[gc]', '1e213483');
    params.append('Entries[full_name]', name);
    params.append('Entries[email]', email);
    params.append('terms_text', 'on')
    params.append('marketing_checkbox', 'on')


    fetch(`https://vyper.io/entries/create?contest_id=23657&referrer_id=${reff}&display_type=Landing%20Page`, { 
        method: 'POST', 
        body: params
    })
    .then(res => res.text())
    .then(result => {
    const $ = cheerio.load(result);
      const resText = $('h7').text();
        resolve(resText);
    })  
    .catch(err => reject(err))
});

const functionGetLink = (email, domain) =>
    new Promise((resolve, reject) => {
        fetch(`https://generator.email/`, {
            method: "get",
            headers: {
                accept:
                    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
                "accept-encoding": "gzip, deflate, br",
                cookie: `_ga=GA1.2.1164348503.1554262465; _gid=GA1.2.905585996.1554262465; embx=%5B%22${email}%40${domain}%22%2C%22hcycl%40nongzaa.tk%22%5D; _gat=1; io=-aUNS6XIdbbHj__faWS_; surl=${domain}%2F${email}`,
                "upgrade-insecure-requests": 1,
                "user-agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36"
            }
        })
            .then(res => res.text())
            .then(text => {
                const $ = cheerio.load(text);
                const src = $("div[class=content] table tr td p a").attr("href");
                resolve(src);
            })
            .catch(err => reject(err));
    });

const functionVeryf = (url) => new Promise((resolve, rejected) => {
    const options = {
        method: 'GET',
        uri: url
    };
    rp(options)
        .then(function (body) {
            const $ = cheerio.load(body);
            const src = $("strong").text();
            resolve(src)
        })
        .catch(function (err) {
            rejected(err)
        });
});


(async () => {
    const reff = readline.question('[?] Reff (ex => 9817747): ')
    const jumlah = readline.question('[?] Jumlah reff: ')
    for(var i=0; i < jumlah; i++){
    try {
        const ip = ipv4gen.genIP("192.168.1.1", "192.168.10.255");
        const rand = randomize('a', 10)
        const email = `${rand}@aminudin.me`
        const name = `${random.first()} ${random.last()}`
        console.log(`[!] Mencoba register ${rand}...`)
        const regist = await functionGoRegist(ip, name, email, reff)
        console.log('[+] Register sukses!!')
        console.log('[!] Mencoba mendapatkan link verif...')
        await delay(5000)
        const getLink = await functionGetLink(rand, 'aminudin.me')
        console.log(`[+] Link berhasil didapatkan ${getLink}`)
        const verif = await functionVeryf(getLink)
        console.log('[+] Berhasil verifikasi!\n')
    } catch (e) {
        console.log(e);
   }
}
})()
