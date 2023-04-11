import * as dotenv from "dotenv";
dotenv.config()
import express from "express";
import axios, { isCancel, AxiosError } from "axios";
import qs from "qs";
import { tools, wallet, block } from "nanocurrency-web";
import { createClient } from "redis";
import { v4 as uuidv4 } from "uuid";
import WebSocket, { WebSocketServer } from "ws";

import { initializeApp } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
// import { credential } from "firebase-admin";
const admin = require("firebase-admin");

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const serviceAccountKey = require("../keys/serviceAccountKey.json");
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "nautilus-a7345.firebaseapp.com",
    projectId: "nautilus-a7345",
    storageBucket: "nautilus-a7345.appspot.com",
    messagingSenderId: "871480363204",
    appId: "1:871480363204:web:ba46845c2981a6aa492191",
    measurementId: "G-8R7ZQR7D8F",
    credential: admin.credential.cert(serviceAccountKey)
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
// const analytics = getAnalytics(firebaseApp);
// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = getMessaging(firebaseApp);

const app = express();
app.use(express.json());
const port = process.env.PORT || 6001;
app.listen(port, () => console.log(`listening on port ${port}`));

const HCAPTCHA_SECRET_KEY = process.env.HCAPTCHA_SECRET_KEY;
const REDIS_USERNAME = process.env.REDIS_USERNAME;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = process.env.REDIS_PORT;
const redisClient = createClient({
    url: `rediss://${REDIS_USERNAME}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`,
});
redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.connect();
// database 2 is the prod database:
redisClient.select(2, (err, res) => {
    // you'll want to check that the select was successful here
    // if(err) return err;
    if (err) console.error(err);
    console.log("Redis DB 2 selected");
    // db.set('key', 'string'); // this will be posted to database 1 rather than db 0
});

const fcm_api_key = process.env.FCM_API_KEY;
const MONTH_IN_SECONDS = 2592000;
const nonce_timeout_seconds = 100;
const nonce_separator = '^';



// listen to nano node via websockets:

const testing = false;
const HTTP_URL = "http://node.perish.co:9076";
const WS_URL = "ws://node.perish.co:9078";
// const WORK_URL = "http://workers.perish.co:5555";
const WORK_URL = "https://pow.nano.to";
const REPRESENTATIVE = "nano_38713x95zyjsqzx6nm1dsom1jmm668owkeb9913ax6nfgj15az3nu8xkx579";

async function rpc_call(data) {
    let res = await axios.post(HTTP_URL, data);
    return res.data;
}

async function get_work(hash) {
    let res = await axios.post(WORK_URL, { hash: hash }, {
        headers: {
            'Accept-Encoding': 'application/json'
        },
    });
    return res.data?.work;
}

async function confirmation_handler(message) {

    let send_amount = BigInt(message?.amount);
    let from_account = message?.block?.account;
    let account = message?.block?.link_as_account;

    let fcm_tokens_v2 = await get_fcm_tokens(account);

    if (fcm_tokens_v2 == null || fcm_tokens_v2.length == 0) {
        return;
    }

    // get username if it exists:
    let shorthand_account = await get_shorthand_account(from_account);

    // if int(send_amount) >= int(min_raw_receive):

    let notification_title = `Received ${raw_to_nano(send_amount)} NANO from ${shorthand_account}`;
    let notification_body = `Open Nautilus to view this transaction.`;

    await send_notification(fcm_tokens_v2,
        {
            "title": notification_title,
            "body": notification_body,
            // "sound": "default",
            // "tag": account
        },
        {
            "click_action": "FLUTTER_NOTIFICATION_CLICK",
            "account": `${account}`,
        },
    );

}

const funding_addresses = ["nano_38713x95zyjsqzx6nm1dsom1jmm668owkeb9913ax6nfgj15az3nu8xkx579", "nano_3xnr31q9p8pce5j4qjwnhmfwkry1mgs67x63149zp6kdbcztfmfqjxwb9bw7", "nano_1u844awm5ch3ktwwzpzjfchj54ay5o6a7kyop5jycue7bw5jr117m15tx8oa", "nano_1f5z6gy3mf6gyyen79sidopxizcp59u6iahcmhtatti3qeh7q7m9w5s548nc", "nano_14qojirkhwgekfpf1jbqfd58ks7t6rrjtzuaetytkxmmuhdgx5cmjhgr5wu5", "nano_3mt48meumbxzw3nsnpq43nzrrnx8rb6sjrxtwqdix564htc73hhra4gbuipo", "nano_3uzdra7hdf9qb19a3g61jrsyt8zkthexrtyx186oc8auyegpir8ezm6y9sra",
    "nano_3wneupytd8wxgjrydiq4axoipr9wbpkdycd83bfibemjgmreere1tgnn7ajh", "nano_13ddtgi44o3on9j1d6ughjakoe3s9m515q8fasissky7snsomf93cywsiq68", "nano_1n8syxftoknbadk8k46ou7rstawfmfr8qh1jq1dkuuskrspb9yygkise9drr", "nano_16uomspu1foykg7mumh39i3iosi73fsy74xfsr6rupiw3wzcrea8tnpax67h", "nano_1rw4ybt4hagog4uyhqd7mnaogeu6e4ik4kdswfbh9g3zfiyp1hz968mufyni", "nano_3s9dyxh6qm5uody1ou9g6a6g7qseqer1mgrwwoctwdgs37qt3i57w1dwt7wh"];

async function funding_balances() {
    for (let address of funding_addresses) {
        let response = await rpc_call({ "action": "account_balance", "account": address });
        if (!!response) {
            let balance = BigInt(response["balance"]) + BigInt(response["receivable"]);
            await redisClient.hSet("funding_balances", address, balance.toString());
        }
    }
}

// get account balances once every 10 minutes:
setInterval(funding_balances, 10 * 60 * 1000);
funding_balances();


new_websocket(WS_URL, (socket) => {
    // onopen
    let params = {
        action: "subscribe",
        topic: "confirmation",
        ack: true
    };
    socket?.send(JSON.stringify(params));
}, (response) => {
    // onmessage
    let data = JSON.parse(response.data);
    if (data.topic != "confirmation") return;	// discard ack
    let message = data.message;
    confirmation_handler(message);
});





async function get_shorthand_account(account) {
    let shorthand_account = await redisClient.hGet("usernames", `${account}`);
    if (!shorthand_account) {
        // set username to abbreviated account name:
        shorthand_account = account.substring(0, 12);
    } else {
        shorthand_account = "@" + shorthand_account;
    }
    return shorthand_account;
}



function new_websocket(url, ready_callback, message_callback) {
    let socket = new WebSocket(url);
    socket.onopen = function () {
        console.log('WebSocket is now open');
        if (ready_callback !== undefined) ready_callback(this);
    }
    socket.onerror = function (e) {
        console.error('WebSocket error');
        console.error(e);
    }
    socket.onmessage = function (response) {
        if (message_callback !== undefined) {
            message_callback(response);
        }
    }

    return socket;
}


async function send_notification(fcm_tokens_v2, notification, data) {

    // let fcm_tokens_v2 = await get_fcm_tokens(account);
    // if (fcm_tokens_v2 == null || fcm_tokens_v2.length == 0) {
    //     return {
    //         'error': 'fcm token error',
    //         'details': "no_tokens"
    //     };
    // }

    for (let t2 of fcm_tokens_v2) {
        let message = {
            token: t2,
            notification: notification,
            data: data,
        };
        await messaging.send(message).then((response) => {
            console.log('Successfully sent message:', response);
        }).catch((error) => {
            console.error('Error sending message:', error);
        });
    }
}







// add rest route for /api
app.get("/api", (req, res) => {

    // return json response
    res.json({
        message: "Hello World"
    });
});

app.get("/health", (req, res) => {
    // return OK
    res.json({
        message: "OK"
    });
});



app.get("/alerts/:lang", (req, res) => {
    res.json(get_active_alert(req.params.lang));
});

app.get("/funding/:lang", async (req, res) => {
    
    let activeFunding = get_active_funding(req.params.lang);

    for (let i = 0; i < activeFunding.length; i++) {
        if ("address" in activeFunding[i]) {
            let balanceRaw = await redisClient.hGet("funding_balances", activeFunding[i]["address"]);
            if (!!balanceRaw) {
                activeFunding[i]["current_amount_raw"] = balanceRaw;
            }
        }
    }

    res.json(activeFunding);
});

const HIGH_PRIORITY = "high"
const LOW_PRIORITY = "low"

const ACTIVE_ALERTS = [
    {
        "id": 1,
        "active": false,
        "priority": HIGH_PRIORITY,
        // # yyyy, M,  D,  H,  M,  S, MS
        // "timestamp": int((datetime(2022, 5, 23, 0, 0, 0, 0, tzinfo=timezone.utc) - datetime(1970, 1, 1, tzinfo=timezone.utc)).total_seconds() * 1000),
        "timestamp": Date.now(),
        "link": "https://google.com",
        "en": {
            "title": "Network Issues",
            "short_description": "Due to ongoing issues with the Nano network, many transactions are delayed.",
            "long_description": "The Nano network is experiencing issues.\n\nSome transactions may be significantly delayed, up to several days. We will keep our users updated with new information as the Nano team provides it.\n\nYou can read more by tapping \"Read More\" below.\n\nAll issues in regards to transaction delays are due to the Nano network issues, not Nautilus. We are not associated with the Nano Foundation or its developers.\n\nWe appreciate your patience during this time."
        },
        "sv": {
            "title": "NÃ¤tverksproblem",
            "short_description": "PÃ¥ grund av pÃ¥gÃ¥ende problem med Nano-nÃ¤tverket, finns det mÃ¥nga fÃ¶rdrÃ¶jda transaktioner.",
            "long_description": "Nano-nÃ¤tverket upplever problem som beror pÃ¥ en lÃ¥ngvarig och pÃ¥gÃ¥ende period med spamtransaktioner.\n\nNÃ¥gra transaktioner kan drÃ¶ja avsevÃ¤rt, upp till flera dagar. Vi kommer att hÃ¥lla vÃ¥ra anvÃ¤ndare uppdaterade med ny information sÃ¥ snart Nano-teamet fÃ¶rmedlar den.\n\nDu kan lÃ¤sa mer genom att trycka pÃ¥ \"LÃ¤s Mer\" nedan.\n\nAlla problem som rÃ¶r fÃ¶rdrÃ¶jda transaktioner Ã¤r pÃ¥ grund av nÃ¤tverksproblem hos Nano. Vi Ã¤r inte associerade med Nano Foundation eller dess utvecklare och kan dÃ¤rfÃ¶r inte pÃ¥skynda lÃ¥ngsamma transaktioner.\n\nVi uppskattar ditt tÃ¥lamod under denna period.",
        },
        "es": {
            "title": "Problemas de red",
            "short_description": "Debido a problemas continuos con la red Nano, muchas transacciones se retrasan.",
            "long_description": "La red Nano estÃ¡ experimentando problemas causados â€‹â€‹por un perÃ­odo prolongado y continuo de transacciones de spam.\n\nAlgunas transacciones pueden retrasarse significativamente, hasta varios dÃ­as. Mantendremos a nuestros usuarios actualizados con nueva informaciÃ³n a medida que el equipo de Nano la proporcione.\n\nPuede leer mÃ¡s apretando \"Leer MÃ¡s\" abajo\n\nTodos los problemas relacionados con las demoras en las transacciones se deben a problemas de la red Nano, no Natrium. No estamos asociados con la Nano Foundation o sus desarrolladores y no podemos hacer nada para acelerar las transacciones lentas.\n\nAgradecemos su paciencia durante este tiempo.",
        },
        "tr": {
            "title": "AÄŸ Problemleri",
            "short_description": "Nano aÄŸÄ±nda devam eden spam problemi nedeniyle bir Ã§ok iÅŸlem gecikmekte.",
            "long_description": "Nano aÄŸÄ± bir sÃ¼redir devam eden spam nedeniyle problem yaÅŸÄ±yor.\n\nBazÄ± iÅŸlemleriniz bir kaÃ§ gÃ¼n sÃ¼ren gecikmelere maruz kalabilir. Nano takÄ±mÄ±nÄ±n vereceÄŸi gÃ¼ncel haberleri size ileteceÄŸiz.\n\nAÅŸaÄŸÄ±daki \"DetaylÄ± Bilgi\" butonuna dokunarak daha detaylÄ± bilgi alabilirsiniz.\n\nÄ°ÅŸlem gecikmeleriyle alakalÄ± bu problemler Natrium'dan deÄŸil, Nano aÄŸÄ±nÄ±n kendisinden kaynaklÄ±. Nano Foundation veya geliÅŸtiricileriyle bir baÄŸÄ±mÄ±z olmadÄ±ÄŸÄ± iÃ§in iÅŸlemlerinizi hÄ±zlandÄ±rabilmek iÃ§in ÅŸu noktada yapabileceÄŸimiz bir ÅŸey ne yazÄ±k ki yok.\n\nAnlayÄ±ÅŸÄ±nÄ±z ve sabrÄ±nÄ±z iÃ§in teÅŸekkÃ¼r ederiz."
        },
        "ja": {
            "title": "ãƒãƒƒãƒˆãƒ¯ãƒ¼ã‚¯ã‚¨ãƒ©ãƒ¼",
            "short_description": "Nanoãƒãƒƒãƒˆãƒ¯ãƒ¼ã‚¯ã®ç¶™ç¶šçš„ãªå•é¡Œã«ã‚ˆã‚Šã€å¤šãã®å–å¼•ãŒé…å»¶ã—ã¦ã„ã¾ã™ã€‚",
            "long_description": "Nanoãƒãƒƒãƒˆãƒ¯ãƒ¼ã‚¯ã§ã¯ã€ã‚¹ãƒ‘ãƒ ã®å–å¼•ãŒé•·æœŸé–“ç¶™ç¶šã™ã‚‹ã“ã¨ã«ã‚ˆã£ã¦å•é¡ŒãŒç™ºç”Ÿã—ã¦ã„ã¾ã™ã€‚\n\nä¸€éƒ¨ã®å–å¼•ã¯æœ€å¤§æ•°æ—¥é…ã‚Œã‚‹å ´åˆãŒã‚ã‚Šã¾ã™ã€‚Nanoãƒãƒ¼ãƒ ãŒæä¾›ã™ã‚‹æ–°ã—ã„æƒ…å ±ã§ã€çš†ã•ã‚“ã‚’æœ€æ–°ã®çŠ¶æ…‹ã«ä¿ã¡ã¾ã™ã€‚\n\n è©³ã—ãã¯\"è©³ã—ãã¯\"ãƒœã‚¿ãƒ³ã‚’ã‚¯ãƒªãƒƒã‚¯ã—ã¦ä¸‹ã•ã„ã€‚\n\nå–å¼•ã®é…å»¶ã«é–¢ã™ã‚‹ã™ã¹ã¦ã®å•é¡Œã¯ã€Natriumã§ã¯ãªãã€Nanoãƒãƒƒãƒˆãƒ¯ãƒ¼ã‚¯ã®å•é¡ŒãŒåŽŸå› ã§ã™ã€‚Natriumã¯Nano Foundationã‚„ãã®é–‹ç™ºè€…ã¨ã¯é–¢ä¿‚ãŒãªãã€é…ã„å–å¼•ã‚’ã‚¹ãƒ”ãƒ¼ãƒ‰ã‚¢ãƒƒãƒ—ã™ã‚‹ãŸã‚ã«ä½•ã‚‚ã™ã‚‹ã“ã¨ã¯ã§ãã¾ã›ã‚“ã€‚\n\nã”ç†è§£ãŠé¡˜ã„ã„ãŸã—ã¾ã™ã€‚",
        },
        "de": {
            "title": "Netzwerkprobleme",
            "short_description": "Aufgrund von anhaltenden Problemen mit dem Nano-Netzwerk sind aktuell viele Transaktionen verzÃ¶gert.",
            "long_description": "Das Nano-Netzwerk kÃ¤mpft derzeit mit Problemen, die durch eine lang andauernde Serie von Spam-Transaktionen verursacht wurden.\n\nManche Transaktionen kÃ¶nnen daher stark verzÃ¶gert sein, teilweise um bis zu mehrere Tage. Wir werden unsere Nutzer Ã¼ber wichtige Neuigkeiten informieren, sobald das Nano-Team diese verÃ¶ffentlicht.\n\nErfahre mehr, indem du auf \"Mehr Infos\" klickst.\n\nDie Probleme mit verzÃ¶gerten Transaktionen sind verursacht durch das Nano-Netzwerk, nicht durch Natrium. Wir stehen in keinem Zusammenhang mit der Nano Foundation oder ihren Entwicklern und kÃ¶nnen daher nichts tun, um die Transaktionen zu beschleunigen.\n\nVielen Dank fÃ¼r dein VerstÃ¤ndnis.",
        },
        "fr": {
            "title": "ProblÃ¨mes de rÃ©seau",
            "short_description": "En raison des problÃ¨mes en cours avec le rÃ©seau Nano, de nombreuses transactions sont retardÃ©es.",
            "long_description": "Le rÃ©seau Nano connaÃ®t des problÃ¨mes causÃ©s par une pÃ©riode prolongÃ©e et continue de transactions de spam.\n\nCertaines transactions peuvent Ãªtre considÃ©rablement retardÃ©es, jusqu'Ã  plusieurs jours. Nous tiendrons nos utilisateurs Ã  jour avec de nouvelles informations au fur et Ã  mesure que l'Ã©quipe Nano les fournira.\n\nVous pouvez en savoir plus en appuyant sur \"Lire la suite\" ci-dessous.\n\nTous les problÃ¨mes liÃ©s aux retards de transaction sont dus aux problÃ¨mes de rÃ©seau Nano, et non Ã  Natrium. Nous ne sommes pas associÃ©s Ã  la Fondation Nano ou Ã  ses dÃ©veloppeurs et ne pouvons rien faire pour accÃ©lÃ©rer les transactions lentes.\n\nNous apprÃ©cions votre patience pendant cette pÃ©riode.",
        },
        "nl": {
            "title": "Netwerkproblemen",
            "short_description": "Door aanhoudende problemen met het Nano-netwerk lopen veel transacties vertraging op.",
            "long_description": "Het Nano-netwerk ondervindt problemen die worden veroorzaakt door een langdurige, aanhoudende periode van spamtransacties.\n\nSommige transacties kunnen aanzienlijk worden vertraagd, tot enkele dagen. We houden onze gebruikers op de hoogte van nieuwe informatie zodra het Nano-team dit communiceert.\n\nJe kan meer lezen door hieronder op \"Meer lezen\" te klikken.\n\nAlle problemen met betrekking tot transactievertragingen zijn te wijten aan problemen met het Nano-netwerk, niet aan Natrium. We zijn niet geassocieerd met de Nano Foundation of hun ontwikkelaars en kunnen niets doen om langzame transacties te versnellen.\n\nWe stellen jouw geduld gedurende deze tijd op prijs.",
        },
        "iDD": {
            "title": "Masalah Jaringan",
            "short_description": "Karena masalah yang sedang berlangsung dengan jaringan Nano, banyak transaksi yang tertunda.",
            "long_description": "Jaringan Nano mengalami masalah yang disebabkan oleh periode transaksi spam yang berkepanjangan dan berkelanjutan.\n\nBeberapa transaksi mungkin tertunda secara signifikan, hingga beberapa hari. Kami akan terus memperbarui informasi baru kepada pengguna kami saat tim Nano menyediakannya.\n\nAnda dapat membaca selengkapnya dengan mengetuk \"Baca Selengkapnya\" di bawah.\n\nSemua masalah terkait penundaan transaksi disebabkan oleh masalah jaringan Nano, bukan Natrium. Kami tidak terkait dengan Nano Foundation atau pengembangnya dan tidak dapat melakukan apa pun untuk mempercepat transaksi yang lambat.\n\nKami menghargai kesabaran anda selama ini.",
        },
        "ru": {
            "title": "ÐŸÑ€Ð¾Ð±Ð»ÐµÐ¼Ñ‹ Ñ ÑÐµÑ‚ÑŒÑŽ",
            "short_description": "Ð˜Ð·-Ð·Ð° Ñ‚ÐµÐºÑƒÑ‰Ð¸Ñ… Ð¿Ñ€Ð¾Ð±Ð»ÐµÐ¼ Ñ ÑÐµÑ‚ÑŒÑŽ Nano Ð¼Ð½Ð¾Ð³Ð¸Ðµ Ñ‚Ñ€Ð°Ð½Ð·Ð°ÐºÑ†Ð¸Ð¸ Ð·Ð°Ð´ÐµÑ€Ð¶Ð¸Ð²Ð°ÑŽÑ‚ÑÑ.",
            "long_description": "Ð’ ÑÐµÑ‚Ð¸ Nano Ð²Ð¾Ð·Ð½Ð¸ÐºÐ°ÑŽÑ‚ Ð¿Ñ€Ð¾Ð±Ð»ÐµÐ¼Ñ‹, Ð²Ñ‹Ð·Ð²Ð°Ð½Ð½Ñ‹Ðµ Ð¿Ñ€Ð¾Ð´Ð¾Ð»Ð¶Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ñ‹Ð¼ Ð¿ÐµÑ€Ð¸Ð¾Ð´Ð¾Ð¼ ÑÐ¿Ð°Ð¼-Ñ‚Ñ€Ð°Ð½Ð·Ð°ÐºÑ†Ð¸Ð¹.\n\nÐÐµÐºÐ¾Ñ‚Ð¾Ñ€Ñ‹Ðµ Ñ‚Ñ€Ð°Ð½Ð·Ð°ÐºÑ†Ð¸Ð¸ Ð¼Ð¾Ð³ÑƒÑ‚ Ð±Ñ‹Ñ‚ÑŒ Ð·Ð½Ð°Ñ‡Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ð¾ Ð·Ð°Ð´ÐµÑ€Ð¶Ð°Ð½Ñ‹, Ð´Ð¾ Ð½ÐµÑÐºÐ¾Ð»ÑŒÐºÐ¸Ñ… Ð´Ð½ÐµÐ¹. ÐœÑ‹ Ð±ÑƒÐ´ÐµÐ¼ Ð´ÐµÑ€Ð¶Ð°Ñ‚ÑŒ Ð½Ð°ÑˆÐ¸Ñ… Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»ÐµÐ¹ Ð² ÐºÑƒÑ€ÑÐµ Ð½Ð¾Ð²Ð¾Ð¹ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸Ð¸, Ð¿Ð¾ÑÐºÐ¾Ð»ÑŒÐºÑƒ ÐºÐ¾Ð¼Ð°Ð½Ð´Ð° Nano  Ð¿Ñ€ÐµÐ´Ð¾ÑÑ‚Ð°Ð²Ð»ÑÐµÑ‚ ÐµÐ³Ð¾.\n\nÐ’Ñ‹ Ð¼Ð¾Ð¶ÐµÑ‚Ðµ ÑƒÐ·Ð½Ð°Ñ‚ÑŒ Ð±Ð¾Ð»ÑŒÑˆÐµ, Ð½Ð°Ð¶Ð°Ð² \"ÐŸÐ¾Ð´Ñ€Ð¾Ð±Ð½ÐµÐµ\" Ð½Ð¸Ð¶Ðµ.\n\nÐ’ÑÐµ Ð¿Ñ€Ð¾Ð±Ð»ÐµÐ¼Ñ‹, ÑÐ²ÑÐ·Ð°Ð½Ð½Ñ‹Ðµ Ñ Ð·Ð°Ð´ÐµÑ€Ð¶ÐºÐ°Ð¼Ð¸ Ñ‚Ñ€Ð°Ð½Ð·Ð°ÐºÑ†Ð¸Ð¹, Ð²Ñ‹Ð·Ð²Ð°Ð½Ñ‹ Ð¿Ñ€Ð¾Ð±Ð»ÐµÐ¼Ð°Ð¼Ð¸ ÑÐµÑ‚Ð¸ Nano, Ð° Ð½Ðµ Natrium. ÐœÑ‹ Ð½Ðµ ÑÐ²ÑÐ·Ð°Ð½Ñ‹ Ñ Nano Foundation ÐµÐ³Ð¾ Ñ€Ð°Ð·Ñ€Ð°Ð±Ð¾Ñ‚Ñ‡Ð¸ÐºÐ¸ Ð½Ðµ Ð¼Ð¾Ð³ÑƒÑ‚ Ð½Ð¸Ñ‡ÐµÐ³Ð¾ ÑÐ´ÐµÐ»Ð°Ñ‚ÑŒ Ð´Ð»Ñ ÑƒÑÐºÐ¾Ñ€ÐµÐ½Ð¸Ñ Ð¼ÐµÐ´Ð»ÐµÐ½Ð½Ñ‹Ñ…  Ñ‚Ñ€Ð°Ð½Ð·Ð°ÐºÑ†Ð¸Ð¹.\n\nÐœÑ‹ Ð±Ð»Ð°Ð³Ð¾Ð´Ð°Ñ€Ð¸Ð¼ Ð²Ð°Ñ Ð·Ð° Ñ‚ÐµÑ€Ð¿ÐµÐ½Ð¸Ðµ Ð² ÑÑ‚Ð¾ Ð²Ñ€ÐµÐ¼Ñ.",
        },
        "da": {
            "title": "NetvÃ¦rksproblemer",
            "short_description": "PÃ¥ grund af igangvÃ¦rende problemer med Nano-netvÃ¦rket er der mange forsinkede transaktioner.",
            "long_description": "Nano-netvÃ¦rket oplever problemer pÃ¥ grund af en lang og lÃ¸bende periode med spamtransaktioner.\n\nNogle transaktioner kan tage lang tid, op til flere dage. Vi holder vores brugere opdateret med nye oplysninger, sÃ¥ snart Nano-teamet giver dem.\n\nDu kan lÃ¦se mere ved at klikke \"LÃ¦s mere\" nedenfor.\n\nAlle problemer med hensyn til transaktionsforsinkelser skyldes problemer med Nano-netvÃ¦rket, ikke Natrium. Vi er ikke tilknyttet Nano Foundation eller dets udviklere og kan ikke gÃ¸re noget for at fremskynde langsomme transaktioner.\n\nVi sÃ¦tter pris pÃ¥ din tÃ¥lmodighed i denne periode.",
        }
    },
    {
        "id": 2,
        "active": false,
        "priority": LOW_PRIORITY,
        // # yyyy, M,  D,  H,  M,  S, MS
        // "timestamp": int((datetime(2022, 6, 24, 0, 0, 0, 0, tzinfo=timezone.utc) - datetime(1970, 1, 1, tzinfo=timezone.utc)).total_seconds() * 1000),
        "timestamp": Date.now(),
        "en": {
            "title": "Planned Maintenance",
            "short_description": "Backend work",
            "long_description": "Backend work is being done, features of the app may stop working for the next few hours"
        },
    },
    {
        "id": 3,
        "active": false,
        "priority": LOW_PRIORITY,
        // # yyyy, M,  D,  H,  M,  S, MS
        // "timestamp": int((datetime(2022, 7, 3, 0, 0, 0, 0, tzinfo=timezone.utc) - datetime(1970, 1, 1, tzinfo=timezone.utc)).total_seconds() * 1000),
        "timestamp": Date.now(),
        "en": {
            "title": "Server Outage",
            "short_description": "Unknown PoW issue",
            "long_description": "Something is wrong with the PoW server, we are working on a fix"
        },
    },
    {
        "id": 4,
        "active": false,
        "priority": LOW_PRIORITY,
        "link": "https://www.reddit.com/r/nanocurrency/comments/zy6z1h/upcoming_nautilus_potassius_changes_backup_your/",
        // # yyyy, M,  D,  H,  M,  S, MS
        // "timestamp": int((datetime(2022, 7, 3, 0, 0, 0, 0, tzinfo=timezone.utc) - datetime(1970, 1, 1, tzinfo=timezone.utc)).total_seconds() * 1000),
        "timestamp": Date.now(),
        "en": {
            "title": "Backup your seed",
            "short_description": "Upcoming update will break magic link login credentials",
            "long_description": "In a coming update, existing login credentials will be invalidated, and you will have to make your account again, (if your seed is backed up you can ignore this alert), sorry for the inconvienience, but you can follow the link for more details."
        },
    }
]

const LOCALES = ["en", "sv", "es", "tr", "ja", "de", "fr", "nl", "iDD", "ru", "da"]

const ACTIVE_FUNDING = [
    {
        "id": 0,
        "active": true,
        "show_on_ios": false,
        "address": "nano_3xnr31q9p8pce5j4qjwnhmfwkry1mgs67x63149zp6kdbcztfmfqjxwb9bw7",
        "goal_amount_raw": "150000000000000000000000000000000",
        "current_amount_raw": "0",
        "en": {
            "title": "Monthly Server Costs",
            "short_description": "Keep the backend alive!",
            "long_description": "Help fund the backend server and node costs.",
        },
    },
    {
        "id": 1,
        "active": false,
        "show_on_ios": false,
        "address": "nano_1u844awm5ch3ktwwzpzjfchj54ay5o6a7kyop5jycue7bw5jr117m15tx8oa",
        "goal_amount_raw": "500000000000000000000000000000000",
        "current_amount_raw": "0",
        "en": {
            "title": "Hardware Wallet Support",
            "short_description": "Starting with the Ledger Nano S/X",
        },
    },
    {
        "id": 2,
        "active": false,
        "show_on_ios": false,
        "address": "nano_1f5z6gy3mf6gyyen79sidopxizcp59u6iahcmhtatti3qeh7q7m9w5s548nc",
        "goal_amount_raw": "500000000000000000000000000000000",
        "current_amount_raw": "0",
        "en": {
            "title": "Offline Proof of Work",
            "short_description": "Add support for doing Proof of Work even if the server is offline.",
            "long_description": "This would include a progress bar of some kind on the home screen + a notification to let you know that the PoW is done.",
        },
    },
    {
        "id": 3,
        "active": false,
        "show_on_ios": false,
        "address": "nano_14qojirkhwgekfpf1jbqfd58ks7t6rrjtzuaetytkxmmuhdgx5cmjhgr5wu5",
        "goal_amount_raw": "200000000000000000000000000000000",
        "current_amount_raw": "0",
        "en": {
            "title": "Login with Nautilus",
            "short_description": "Authentication scheme for logging in with Nautilus",
        },
    },
    {
        "id": 4,
        "active": false,
        "show_on_ios": false,
        "address": "nano_3mt48meumbxzw3nsnpq43nzrrnx8rb6sjrxtwqdix564htc73hhra4gbuipo",
        "goal_amount_raw": "2000000000000000000000000000000000",
        "current_amount_raw": "0",
        "en": {
            "title": "Security Audit",
            "short_description": "Get the code base audited by a security firm",
        },
    },
    {
        "id": 5,
        "active": false,
        "show_on_ios": false,
        "address": "nano_3uzdra7hdf9qb19a3g61jrsyt8zkthexrtyx186oc8auyegpir8ezm6y9sra ",
        "goal_amount_raw": "5000000000000000000000000000000000",
        "current_amount_raw": "0",
        "en": {
            "title": "Legal Financing",
            "short_description": "(i.e. On/Offramps + Monetary Services)",
            "long_description": "There are features and services I want to create, but just don't have the financial backing to make it happen.\nThis will go towards things like paying a lawyer, (corporation) registration fees, and any other costs involved with making these features possible.\n\nAn example of what this would help achieve: A Nautilus Debit Card that lets you spend your nano as fiat",
        },
    },
    {
        "id": 6,
        "active": false,
        "show_on_ios": false,
        "address": "nano_3wneupytd8wxgjrydiq4axoipr9wbpkdycd83bfibemjgmreere1tgnn7ajh",
        "goal_amount_raw": "5000000000000000000000000000000000",
        "current_amount_raw": "0",
        "en": {
            "title": "Perishable",
            "short_description": "Decentralized L2 Storage Network using nano",
            "long_description": "Still a WIP Business idea, but feel free to ask about it on the discord",
        },
    },
    {
        "id": 7,
        "active": false,
        "show_on_ios": false,
        "address": "nano_13ddtgi44o3on9j1d6ughjakoe3s9m515q8fasissky7snsomf93cywsiq68",
        "goal_amount_raw": "1000000000000000000000000000000000",
        "current_amount_raw": "0",
        "en": {
            "title": "Block Handoff Support",
            "short_description": "First Implementation of Block Handoff",
            "long_description": "This will be used to facilitate / replace the current payment requests system, though some details still need to be worked out",
        },
    },
    {
        "id": 8,
        "active": false,
        "show_on_ios": false,
        "address": "nano_1n8syxftoknbadk8k46ou7rstawfmfr8qh1jq1dkuuskrspb9yygkise9drr",
        "goal_amount_raw": "1000000000000000000000000000000000",
        "current_amount_raw": "0",
        "en": {
            "title": "Obscured Payments",
            "short_description": "Not true privacy but good enough for day to day use",
            "long_description": "Will work by mixing between random sub-addresses",
        },
    },
    {
        "id": 9,
        "active": true,
        "show_on_ios": false,
        "address": "nano_16uomspu1foykg7mumh39i3iosi73fsy74xfsr6rupiw3wzcrea8tnpax67h",
        "goal_amount_raw": "300000000000000000000000000000000",
        "current_amount_raw": "0",
        "en": {
            "title": "Memo and Request Caching",
            "short_description": "Better deliverability of memos and requests",
            "long_description": "This would cache memos and requests (Encrypted still) on the server until the recipient's device confirms that they've received the message",
        },
    },
    {
        "id": 10,
        "active": false,
        "show_on_ios": false,
        "address": "nano_1rw4ybt4hagog4uyhqd7mnaogeu6e4ik4kdswfbh9g3zfiyp1hz968mufyni",
        "goal_amount_raw": "500000000000000000000000000000000",
        "current_amount_raw": "0",
        "en": {
            "title": "Artist Fund",
            "short_description": "Help pay for a new logo and other assets",
            "long_description": "This is to help pay for a graphic designer to make a new logo or re-design the current one.",
        },
    },
    {
        "id": 11,
        "active": false,
        "show_on_ios": false,
        "address": "nano_3s9dyxh6qm5uody1ou9g6a6g7qseqer1mgrwwoctwdgs37qt3i57w1dwt7wh",
        "goal_amount_raw": "5000000000000000000000000000000000",
        "current_amount_raw": "0",
        "en": {
            "title": "Desktop / Web Support",
            "short_description": "Just a *minor* rewrite",
            "long_description": "This involves rewriting major sections of the app to use more cross platform libraries, and may not be feasible / easier to just start from scratch.",
        },
    }
]

function gen_for_locales(message) {
    let final = {};
    for (let loc in LOCALES) {
        final[loc] = message
    }
    return final;
}


function get_active_alert(lang) {
    let ret = [];
    for (let a of ACTIVE_ALERTS) {
        let active = a["active"];
        if (!active) continue;
        if (lang == 'id' && 'iDD' in a) {
            lang = 'iDD'
        } else if (!(lang in a)) {
            lang = 'en'
        }
        let retItem = {
            "id": a["id"],
            "priority": a["priority"],
            "active": a["active"],
        };
        if ("timestamp" in a) {
            retItem["timestamp"] = a["timestamp"]
        }
        if ("link" in a) {
            retItem["link"] = a["link"]
        }
        // for (let k, v in a[lang].items()) {
        //     retItem[k] = v
        // }

        for (let k in a[lang]) {
            retItem[k] = a[lang][k];
        }

        ret.push(retItem);

    }

    return ret
}

function get_active_funding(lang) {
    let ret = []
    for (let a of ACTIVE_FUNDING) {
        let active = a["active"]
        if (!active) continue;


        if (lang == 'id' && 'iDD' in a) {
            lang = 'iDD'
        } else if (!(lang in a)) {
            lang = 'en'
        }
        let retItem = {
            "id": a["id"],
            "active": a["active"],
        }
        if ("timestamp" in a) {
            retItem["timestamp"] = a["timestamp"]
        }
        if ("link" in a) {
            retItem["link"] = a["link"]
        }
        if ("address" in a) {
            retItem["address"] = a["address"]
        }
        if ("goal_amount_raw" in a) {
            retItem["goal_amount_raw"] = a["goal_amount_raw"]
        }
        if ("current_amount_raw" in a) {
            retItem["current_amount_raw"] = a["current_amount_raw"]
        }
        if ("show_on_ios" in a) {
            retItem["show_on_ios"] = a["show_on_ios"]
        }

        for (let k in a[lang]) {
            retItem[k] = a[lang][k];
        }
        ret.push(retItem)
    }
    return ret;

}





// payments API:

async function validate_signature(requesting_account, request_signature, request_nonce) {
    // TODO:

    let ret = null;
    // check if the nonce is valid
    // req_account_bin = unhexlify(util.address_decode(requesting_account));

    // nonce_fields = request_nonce.split(nonce_separator)
    // // make sure the nonce is recent:
    // request_epoch_time = int(nonce_fields[0], 16)

    // current_epoch_time = int(time.time())
    // if ((current_epoch_time - request_epoch_time) > nonce_timeout_seconds) {
    //     // nonce is too old
    //     ret = {
    //         'error':'nonce error',
    //         'details': 'nonce is too old'
    //     };
    //     return ret
    // }

    // vk = VerifyingKey(req_account_bin)
    // try {
    //     vk.verify(
    //         sig=unhexlify(request_signature),
    //         msg=unhexlify(request_nonce),
    //     )
    // } catch (e) {
    //     ret = json.dumps({
    //         'error':'sig error',
    //         'details': 'invalid signature'
    //     })
    // }
    return ret;
}

function raw_to_nano(amount) {
    const converted = tools.convert(amount, "RAW", "NANO");
    // return "" + parseFloat(Number(converted).toFixed(6));
    let n = converted;
    let r = (+n).toFixed(6).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, '$1');
    return r;
}

// # allow sends with the original uuid if they are valid:
// # TODO:
function check_local_uuid(local_uuid) {
    // new_uuid = str(uuid.uuid4())
    // if local_uuid is None:
    //     return new_uuid
    // # TODO:
    // return new_uuid
    return uuidv4();
}

async function push_payment_request(account, amount_raw, requesting_account, memo_enc, local_uuid) {
    if (fcm_api_key == null) {
        return {
            'error': 'fcm token error',
            'details': "no_api_key"
        };
    }

    let fcm_tokens_v2 = await get_fcm_tokens(account);
    if (fcm_tokens_v2 == null || fcm_tokens_v2.length == 0) {
        return {
            'error': 'fcm token error',
            'details': "no_tokens"
        };
    }

    // get username if it exists:
    let shorthand_account = await get_shorthand_account(requesting_account);

    // push notifications
    // fcm = aiofcm.FCM(fcm_sender_id, fcm_api_key)


    let request_uuid = await check_local_uuid(local_uuid)
    let request_time = parseInt(Date.now() / 1000);

    // Send notification with generic title, send amount as body. App should have localizations and use this information at its discretion
    let notification_title = `Request for ${raw_to_nano(amount_raw)} NANO from ${shorthand_account}`;
    let notification_body = `Open Nautilus to pay this request.`;
    await send_notification(fcm_tokens_v2,
        {
            "title": notification_title,
            "body": notification_body,
        },
        {
            "click_action": "FLUTTER_NOTIFICATION_CLICK",
            "account": `${account}`,
            "payment_request": "true",
            "uuid": `${request_uuid}`,
            "local_uuid": `${local_uuid}`,
            "memo_enc": `${memo_enc}`,
            "amount_raw": `${amount_raw}`,
            "requesting_account": `${requesting_account}`,
            "requesting_account_shorthand": `${shorthand_account}`,
            "request_time": `${request_time}`
        },
    );

    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    // also push to the requesting account, so they add the account to their list of payment requests
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

    fcm_tokens_v2 = await get_fcm_tokens(requesting_account);
    if (fcm_tokens_v2 == null || fcm_tokens_v2.length == 0) {
        return {
            'error': 'fcm token error',
            'details': "no_tokens"
        };
    }

    await send_notification(fcm_tokens_v2,
        {},
        {
            "account": `${account}`,
            "payment_record": "true",
            "is_request": "true",
            "memo_enc": `${memo_enc}`,
            "uuid": `${request_uuid}`,
            "local_uuid": `${local_uuid}`,
            "amount_raw": `${amount_raw}`,
            "requesting_account": requesting_account,
            "requesting_account_shorthand": shorthand_account,
            "request_time": `${request_time}`
        },
    );
}

async function push_payment_ack(request_uuid, account, requesting_account) {

    let fcm_tokens_v2 = await get_fcm_tokens(account);
    if (fcm_tokens_v2 == null || fcm_tokens_v2.length == 0) {
        return {
            'error': 'fcm token error',
            'details': "no_tokens"
        };
    }

    // # Send notification
    for (let token of fcm_tokens_v2) {
        let message = {
            token: token,
            data: {
                "account": account,
                "payment_ack": "true",
                "uuid": request_uuid,
                "requesting_account": requesting_account
            },
        };
        await messaging.send(message).then((response) => {
            console.log('Successfully sent message:', response);
        }).catch((error) => {
            console.error('Error sending message:', error);
        });
        return null;
    }
}

async function push_payment_memo(account, requesting_account, memo_enc, block, local_uuid) {

    let fcm_tokens_v2 = await get_fcm_tokens(account);
    if (fcm_tokens_v2 == null || fcm_tokens_v2.length == 0) {
        return {
            'error': 'fcm token error',
            'details': "no_tokens"
        };
    }

    let request_uuid = await check_local_uuid(local_uuid);
    let request_time = parseInt(Date.now() / 1000);

    // # send memo to the recipient
    await send_notification(fcm_tokens_v2,
        {},
        {
            // # "click_action": "FLUTTER_NOTIFICATION_CLICK",
            "account": account,
            "requesting_account": requesting_account,
            "payment_memo": "true",
            "memo_enc": `${memo_enc}`,
            "block": `${block}`,
            "uuid": request_uuid,
            "local_uuid": local_uuid,
            "request_time": `${request_time}`
        },
    );

    // # @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    // # also push to the requesting account, so they get the uuid
    // # @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

    fcm_tokens_v2 = await get_fcm_tokens(requesting_account);
    if (fcm_tokens_v2 == null || fcm_tokens_v2.length == 0) {
        return "no_tokens"
    }

    await send_notification(fcm_tokens_v2,
        {},
        {
            // # "click_action": "FLUTTER_NOTIFICATION_CLICK",
            "account": `${account}`,
            "requesting_account": `${requesting_account}`,
            "payment_record": "true",
            "is_memo": "true",
            "memo_enc": `${memo_enc}`,
            "uuid": `${request_uuid}`,
            "local_uuid": `${local_uuid}`,
            "block": `${block}`,
            // # "amount_raw": str(send_amount),
            // # "requesting_account": requesting_account,
            // # "requesting_account_shorthand": shorthand_account,
            "request_time": `${request_time}`
        },
    );

    return null;
}

async function push_payment_message(account, requesting_account, memo_enc, local_uuid) {
    let fcm_tokens_v2 = await get_fcm_tokens(account);
    if (fcm_tokens_v2 == null || fcm_tokens_v2.length == 0) {
        return {
            'error': 'fcm token error',
            'details': "no_tokens"
        };
    }

    let request_uuid = await check_local_uuid(local_uuid);
    let request_time = parseInt(Date.now() / 1000);

    // get username if it exists:
    let shorthand_account = await get_shorthand_account(requesting_account);

    // Send notification with generic title, send amount as body. App should have localizations and use this information at its discretion
    let notification_title = `Message from ${shorthand_account}`
    let notification_body = `Open Nautilus to view.`;
    for (let token of fcm_tokens_v2) {
        let message = {
            token: token,
            notification: {
                "title": notification_title,
                "body": notification_body,
                // "sound":"default",
                // "tag": account
            },
            data: {
                "click_action": "FLUTTER_NOTIFICATION_CLICK",
                "account": `${account}`,
                "payment_message": "true",
                "uuid": `${request_uuid}`,
                "local_uuid": `${local_uuid}`,
                "memo_enc": `${memo_enc}`,
                "requesting_account": `${requesting_account}`,
                "requesting_account_shorthand": `${shorthand_account}`,
                "request_time": `${request_time}`
            },
        };
        await messaging.send(message).then((response) => {
            console.log('Successfully sent message:', response);
        }).catch((error) => {
            console.error('Error sending message:', error);
        });
    }

    // # @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    // # also push to the requesting account, so they add the account to their list of payment requests
    // # @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

    fcm_tokens_v2 = await get_fcm_tokens(requesting_account);
    if (fcm_tokens_v2 == null || fcm_tokens_v2.length == 0) {
        return "no_tokens"
    }

    for (let token of fcm_tokens_v2) {
        let message = {
            token: token,
            data: {
                // # "click_action": "FLUTTER_NOTIFICATION_CLICK",
                "account": account,
                "payment_record": "true",
                "is_message": "true",
                "memo_enc": `${memo_enc}`,
                "uuid": request_uuid,
                "local_uuid": local_uuid,
                "requesting_account": requesting_account,
                "requesting_account_shorthand": shorthand_account,
                "request_time": `${request_time}`
            },
        };
        await messaging.send(message).then((response) => {
            console.log('Successfully sent message:', response);
        }).catch((error) => {
            console.error('Error sending message:', error);
        });
    }
    return null;
}


app.post("/payments", async (req, res) => {

    // get request json:
    let request_json = req.body || {};
    let ret;

    // console.log(request_json);

    switch (request_json["action"]) {
        case "payment_request":
            // check the signature:
            ret = await validate_signature(request_json.requesting_account, request_json.request_signature, request_json.request_nonce,)
            if (ret != null) {
                break;
            }
            ret = await push_payment_request(request_json.account, request_json.amount_raw, request_json.requesting_account, request_json.memo_enc, request_json.local_uuid,)
            if (ret != null) break;
            ret = {
                'success': 'payment request sent',
            };
            break;
        case "payment_ack":
            ret = await push_payment_ack(request_json.uuid, request_json.account, request_json.requesting_account,)
            if (ret != null) break;
            // send again to the sender:
            // ret = await push_payment_ack(r, request_json["uuid"], request_json["requesting_account"], request_json["requesting_account"])
            // if (ret != null) break;
            ret = {
                "success": "payment_ack sent",
            };
            break;
        case "payment_memo":
            // check the signature:
            ret = await validate_signature(request_json.requesting_account, request_json.request_signature, request_json.request_nonce,)
            if (ret != null) break;
            ret = await push_payment_memo(request_json.account, request_json.requesting_account, request_json.memo_enc, request_json.block, request_json.local_uuid,)
            if (ret != null) break;
            ret = {
                "success": "payment memo sent",
            };
            break;
        case "payment_message":
            // check the signature:
            ret = await validate_signature(request_json.requesting_account, request_json.request_signature, request_json.request_nonce,)
            if (ret != null) break;
            ret = await push_payment_message(request_json.account, request_json.requesting_account, request_json.memo_enc, request_json.local_uuid,)
            if (ret != null) break;
            // todo: save the message struct for re-sending later:
            ret = {
                "success": "payment memo sent",
            };
            break;
        default:
            ret = {
                "error": "invalid action",
            };
            break;
    }

    res.json(ret);
});


app.post("/notifications", async (req, res) => {

    // get request json:
    let request_json = req.body || {};
    let ret = {};

    switch (request_json.action) {
        case "fcm_update":
            if (request_json.enabled) {
                console.log("updating: " + request_json.account + " " + request_json.fcm_token_v2);
                await update_fcm_token_for_account(request_json.account, request_json.fcm_token_v2)
            } else {
                await delete_fcm_token_for_account(request_json.account, request_json.fcm_token_v2)
            }
            break;
        // case "subscribe":
        //     break;
    }
    // returns nothing:
    res.json(ret);
});


app.post("/price", async (req, res) => {

    // get request json:
    let request_json = req.body || {};
    let ret;

    try {
        if (currency_list.includes(request_json.currency.toUpperCase())) {
            try {
                let price = await redisClient.hGet("prices", `${price_prefix}-` + request_json.currency.toLowerCase())
                ret = {
                    'currency': request_json.currency.toLowerCase(),
                    'price': "" + price
                }
            } catch (error) {
                // log.server_logger.error(
                //     'price data error, unable to get price;%s;%s', util.get_request_ip(r), uid)
                ret = {
                    'error': 'price data error - unable to get price'
                };
            }
        } else {
            // log.server_logger.error(
            //     'price data error, unknown currency;%s;%s', util.get_request_ip(r), uid)
            ret = {
                'error': 'unknown currency'
            };
        }
    } catch (error) {
        // log.server_logger.error('price data error;%s;%s;%s', str(e), util.get_request_ip(r), uid)
        ret = {
            'error': 'price data error',
            'details': error
        }
    }

    res.json(ret);
});




// giftcard API:


async function generate_account_from_seed(seed) {
    let w = wallet.fromLegacySeed(seed);
    return w.accounts[0];
}

async function branch_create_link({ paperWalletSeed, paperWalletAccount, memo, fromAddress, amountRaw, giftUUID, requireCaptcha }) {
    let url = "https://api2.branch.io/v1/url";

    let branch_api_key = process.env.BRANCH_API_KEY;

    let giftDescription = "Get the app to open this gift card!";

    if (BigInt(amountRaw) > BigInt(1000000000000000000000000000000)) {
        // more than 1 NANO:
        // TEST:
        formattedAmount = BigInt(amountRaw) / BigInt(1000000000000000000000000000000);
        giftDescription = `Someone sent you ${formattedAmount} NANO! Get the app to open this gift card!`;
    }

    let data = {
        "branch_key": branch_api_key,
        "channel": "nautilus-backend",
        "feature": "splitgift",
        "stage": "new share",
        "data": {
            "seed": `${paperWalletSeed}`,
            "address": `${paperWalletAccount}`,
            "memo": `${memo}`,
            "senderAddress": `${fromAddress}`,
            "signature": "sig",
            "nonce": "nonce",
            "from_address": `${fromAddress}`,
            "amount_raw": `${amountRaw}`,
            "gift_uuid": `${giftUUID}`,
            "require_captcha": `${requireCaptcha}`,
            "$canonical_identifier": `server/splitgift/${paperWalletSeed}`,
            "$og_title": "Nautilus Wallet",
            "$og_description": giftDescription,
        },
    };

    // resp = requests.post(url, headers=headers, data=data)
    // TODO: axios:
    let resp = await axios.post(url, data);
    return resp;
}

async function gift_split_create({ seed, split_amount_raw, memo, requesting_account, require_captcha }) {

    let giftUUID = uuidv4().slice(-12);
    let giftData = {
        "seed": seed,
        "split_amount_raw": split_amount_raw,
        "memo": memo,
        "from_address": requesting_account,
        "gift_uuid": giftUUID,
        "require_captcha": require_captcha,
    };

    await redisClient.hSet("gift_data", giftUUID, JSON.stringify(giftData));

    if (BigInt(split_amount_raw) > BigInt(1000000000000000000000000000000000)) {
        return { "error": "split_amount_raw is too large" };
    }

    let paperWalletAccount = await generate_account_from_seed(seed);

    let branchResponse = await branch_create_link(
        {
            paperWalletSeed: seed,
            paperWalletAccount, memo,
            fromAddress: requesting_account,
            amountRaw: split_amount_raw,
            giftUUID: giftUUID,
            requireCaptcha: require_captcha,
        },
    );

    if (branchResponse?.data?.url == null) {
        return { "error": "error creating branch link" }
    }

    let branchLink = branchResponse.data?.url;
    return { success: true, link: branchLink, gift_data: giftData };
}

const sleep = time => new Promise(res => setTimeout(res, time));

async function gift_claim({ gift_uuid, requesting_account, requesting_device_uuid }, headers) {
    // get the gift data from the db
    let giftData = await redisClient.hGet("gift_data", gift_uuid);
    giftData = JSON.parse(giftData);
    let giftUUID = giftData.gift_uuid;
    let seed = giftData.seed;
    let fromAddress = giftData.from_address;
    let splitAmountRaw = giftData.split_amount_raw;
    let amountRaw = giftData.amount_raw;
    let memo = giftData.memo;
    let requireCaptcha = giftData.require_captcha;
    let requestingDeviceUUID = requesting_device_uuid;

    // if 'app-version' in r.headers:
    //     appVersion = r.headers.get('app-version')
    //     appVersion = appVersion.replace(".", "")
    //     appVersion = int(appVersion)
    //     if appVersion < 60:
    //         return json.dumps({"error": "App version is too old!"})
    // else:
    //     return json.dumps({"error": "App version is too old!"})

    if (requireCaptcha) {
        // TODO:

        console.log(headers);

        if (!!headers["hcaptcha-token"]) {

            let hcaptchaToken = headers["hcaptcha-token"];

            // // post to hcaptcha to verify the token:
            // let resp = await axios.post("https://hcaptcha.com/siteverify", qs.stringify({
            //     "response": hcaptchaToken,
            //     "secret": HCAPTCHA_SECRET_KEY,
            // }), {
            //     headers: {
            //         'Accept-Encoding': 'application/json',
            //         'Content-Type': 'application/x-www-form-urlencoded'
            //     },
            // });
            // console.log(resp.data);


            // TODO:
            if (hcaptchaToken.length < 30) {
                return { "error": "hcaptcha-token invalid!" };
            }

            // response = requests.post("https://hcaptcha.com/siteverify", data=data)

            // if response.json().get("success") != true {
            //     return json.dumps({"error": "hcaptcha-token invalid!"})
            // }
        } else {
            return { "error": "no hcaptcha-token!" };
        }
    }

    let sendAmountRaw = null;
    if (!!splitAmountRaw) {
        sendAmountRaw = splitAmountRaw;
    } else if (!!amountRaw) {
        sendAmountRaw = amountRaw;
    }

    if (!sendAmountRaw) {
        return { "error": "sendAmountRaw is None" };
    }


    // check the gift card balance and receive any incoming funds:
    if (!giftUUID) {
        return { "error": "gift not found!" };
    }

    if (!requestingDeviceUUID || requestingDeviceUUID == "") {
        return { "error": "requestingDeviceUUID is None" };
    }

    // check if it was claimed by this user:
    // splitID = util.get_request_ip(r) + nonce_separator + giftUUID + nonce_separator + requestingAccount
    let splitID = requestingDeviceUUID + nonce_separator + giftUUID;
    // splitID = util.get_request_ip(r) + nonce_separator + giftUUID
    let claimed = await redisClient.hGet("gift_claims", splitID);
    if (!!claimed && !testing) {
        return { "error": "gift has already been claimed" };
    }

    let giftSeed = seed;
    let giftAccount = (await generate_account_from_seed(giftSeed)).address;
    let giftPrivateKey = (await generate_account_from_seed(giftSeed)).privateKey;
    let giftPublicKey = (await generate_account_from_seed(giftSeed)).publicKey;

    // receive any receivable funds from the paper wallet first:

    let giftWalletBalanceInt = null;

    // get account_info:
    let response = await rpc_call({ "action": "account_info", "account": giftAccount });
    let account_not_opened = false;
    if (response.error == "Account not found") {
        account_not_opened = true;
    } else if (!!response.error) {
        return { "error": response.error };
    } else {
        giftWalletBalanceInt = response.balance;
    }

    let frontier = null;
    if (!account_not_opened) {
        frontier = response.frontier;
    }

    // get the receivable blocks:
    let receivable_resp = await rpc_call({ "action": "receivable", "source": true, "count": 10, "include_active": true, "account": giftAccount });
    if (receivable_resp.blocks == "") {
        receivable_resp.blocks = {};
    }

    // receive each block:
    for (let hash in receivable_resp.blocks) {
        let item = receivable_resp.blocks[hash];

        // we have a frontier, i.e. the account is already opened:
        if (!!frontier) {
            giftWalletBalanceInt = item.amount;

            let blockData = {
                frontier: frontier,
                toAddress: giftAccount,
                representativeAddress: REPRESENTATIVE,
                walletBalanceRaw: giftWalletBalanceInt,
                amountRaw: item.amount,
                transactionHash: hash,
                work: await get_work(hash),
            };

            const signedBlock = block.receive(blockData, giftPrivateKey);

            let resp = await rpc_call({ action: "process", json_block: true, subtype: "receive", block: signedBlock });
            if (!!resp.hash) {
                frontier = resp.hash;
            }

        } else {

            // should be an open block:
            let blockData = {
                frontier: "0000000000000000000000000000000000000000000000000000000000000000",
                toAddress: giftAccount,
                representativeAddress: REPRESENTATIVE,
                walletBalanceRaw: "0",
                amountRaw: item.amount,
                transactionHash: hash,
                work: await get_work(giftPublicKey),
            }

            const signedBlock = block.receive(blockData, giftPrivateKey);
            let resp = await rpc_call({ action: "process", json_block: true, subtype: "receive", block: signedBlock });
            if (!!resp.hash) {
                frontier = resp.hash;
            }
        }
    }
    // Hack that waits for blocks to be confirmed
    await sleep(4000);



    // # get the gift frontier:
    let giftFrontier = frontier;

    let frontiers_resp = await rpc_call({ "action": "frontiers", "count": 1, "account": giftAccount });
    if (frontiers_resp.frontiers == "") {
        giftFrontier = frontier
    } else {
        let returnedFrontiers = frontiers_resp.frontiers;
        for (let addr in returnedFrontiers) {
            giftFrontier = returnedFrontiers[addr];
            break
        }
    }


    // get account_info(again) so we can be 100 % sure of the balance:
    giftWalletBalanceInt = null;
    console.log(giftAccount);
    response = await rpc_call({ "action": "account_info", "account": giftAccount });
    if (!!response.error) {
        return { "error": response.error };
    } else {
        giftWalletBalanceInt = BigInt(response.balance);
    }
    // # send sendAmountRaw to the requester:
    // # get account_info:
    if (!giftWalletBalanceInt) {
        return { "error": "giftWalletBalanceInt shouldn't be None" };
    } else if (giftWalletBalanceInt == BigInt(0)) {
        // the gift wallet is empty, so we can't send anything:
        return { "error": "Gift wallet is empty!" };
    }

    let newBalanceRaw = BigInt(giftWalletBalanceInt) - BigInt(sendAmountRaw);

    if (newBalanceRaw == null) {
        return { "error": "newBalanceRaw is None" };
    } else if (BigInt(newBalanceRaw) < BigInt(0)) {
        // send whatever is left in the gift wallet:
        newBalanceRaw = "0";
    }

    // create the send block:
    let sendBlock = {
        walletBalanceRaw: giftWalletBalanceInt.toString(),
        fromAddress: giftAccount,
        toAddress: requesting_account,
        representativeAddress: REPRESENTATIVE,
        frontier: giftFrontier,
        amountRaw: sendAmountRaw,
        work: await get_work(giftFrontier),
    };

    const signedBlock = block.send(sendBlock, giftPrivateKey);

    let sendResp = await rpc_call({ action: "process", json_block: true, subtype: "send", block: signedBlock });

    if (!sendResp.hash) {
        return { "error": "error sending to paper wallet: " + sendResp };
    }

    // cache the response for this UUID:
    await redisClient.hSet("gift_claims", splitID, "claimed")

    return { "success": true };
}

async function gift_info({ gift_uuid, requesting_account, requesting_device_uuid }) {
    // console.info(`gift_info: ${gift_uuid} ${requesting_account} ${requesting_device_uuid}`);

    // check if the gift exists:
    let giftData = await redisClient.hGet("gift_data", gift_uuid);
    if (!giftData) {
        return { "error": "gift does not exist" };
    }
    giftData = JSON.parse(giftData);

    if (!requesting_device_uuid || requesting_device_uuid == "") {
        return { "error": "requesting_device_uuid is None" };
    }

    // # check if it was claimed by this user:
    // # splitID = util.get_request_ip(r) + nonce_separator + giftUUID + nonce_separator + requestingAccount
    // # splitID = util.get_request_ip(r) + nonce_separator + giftUUID
    let splitID = requesting_device_uuid + nonce_separator + gift_uuid;
    let claimed = await redisClient.hGet("gift_claims", splitID);
    // todo: reenable:
    if (!!claimed && !testing) {
        return { "error": "gift has already been claimed" };
    }

    // check the balance of the gift wallet:
    // let giftWalletSeed = giftData.seed;
    // let giftWalletAccount = (await generate_account_from_seed(giftWalletSeed)).address;


    // TODO: finish getting gift balance:
    // giftWalletBalance = await rpc.json_post({"action": "account_balance", "account": giftWalletAccount})

    let amount = giftData.split_amount_raw;
    if (!amount) {
        amount = giftData.get("amount_raw")
    }

    let returnable = {
        "gift_uuid": gift_uuid,
        "amount_raw": amount,
        "memo": giftData.memo,
        "from_address": giftData.from_address,
        require_captcha: giftData.require_captcha,
    };

    // if giftWalletBalance.get("balance") != None:
    //     returnable["gift_wallet_balance"] = giftWalletBalance.get("balance")

    return { "success": true, "gift_data": returnable };
}

app.post("/gift", async (req, res) => {
    // get request json:
    let request_json = req.body || {};
    let ret;

    switch (request_json.action) {
        case "gift_split_create":
            // # # check the signature:
            // # ret = await validate_signature(request_json.get("requesting_account"), request_json.get("request_signature"), request_json.get("request_nonce"))
            // # if ret == None:
            // #     pass
            ret = await gift_split_create(request_json);
            break;
        case "gift_info":
            ret = await gift_info(request_json);
            break;
        case "gift_claim":
            ret = await gift_claim(request_json, req.headers);
            break;
        default:
            ret = {
                "error": "invalid action",
            };
            break;
    }

    console.log("RES:");
    console.log(ret);

    res.json(ret);
});























// Push notifications

async function delete_fcm_token_for_account(token) {
    await redisClient.del(token);
}

async function update_fcm_token_for_account(account, token) {
    // """Store device FCM registration tokens in redis"""
    await set_or_upgrade_token_account_list(account, token);
    // Keep a list of tokens associated with this account
    let cur_list = await redisClient.get(account);
    if (cur_list != null) {
        // cur_list = json.loads(cur_list.replace('\'', '"'))
        // CHECK:
        cur_list = JSON.parse(cur_list);
    } else {
        cur_list = {};
    }
    if (!("data" in cur_list)) {
        cur_list['data'] = [];
    }
    if (!(cur_list['data'].includes(token))) {
        cur_list['data'].push(token);
    }
    await redisClient.set(account, JSON.stringify(cur_list));
}

async function get_or_upgrade_token_account_list(account, token) {
    let curTokenList = await redisClient.get(token);
    if (!curTokenList) {
        return [];
    }

    try {
        let tokenList = JSON.parse(curTokenList);
        return tokenList;
    } catch (e) {
        let token = curTokenList;
        // CHECK (expire):
        await redisClient.set(token, JSON.stringify([token]), "EX", MONTH_IN_SECONDS);
        if (account != token) {
            return [];
        }
    }

    return JSON.parse(await redisClient.get(token));
}

async function set_or_upgrade_token_account_list(account, token) {
    let curTokenList = await redisClient.get(token);
    if (!curTokenList) {
        await redisClient.set(token, JSON.stringify([account]), "EX", MONTH_IN_SECONDS)
    } else {
        try {
            let tokenList = JSON.parse(curTokenList);
            if (!tokenList.includes(account)) {
                tokenList.push(account);
                await redisClient.set(token, JSON.stringify(tokenList), "EX", MONTH_IN_SECONDS);
            }
        } catch (e) {
            let token = curTokenList;
            await redisClient.set(token, JSON.stringify([token]), "EX", MONTH_IN_SECONDS);
        }
    }
    // suspicious?:
    return JSON.parse(await redisClient.get(token));
}

async function get_fcm_tokens(account) {
    // """Return list of FCM tokens that belong to this account"""
    let tokens = await redisClient.get(account)
    if (!tokens) {
        return [];
    }

    tokens = JSON.parse(tokens);
    // Rebuild the list for this account removing tokens that dont belong anymore
    let new_token_list = {
        data: [],
    };
    if (!('data' in tokens)) {
        return [];
    }
    for (let t of tokens['data']) {
        let account_list = await get_or_upgrade_token_account_list(account, t);
        // TODO: re-enable:
        if (!account_list.includes(account)) {
            continue;
        }
        new_token_list['data'].push(t)
    }
    await redisClient.set(account, JSON.stringify(new_token_list));
    // removes duplicates:
    return [...new Set(new_token_list['data'])];
}