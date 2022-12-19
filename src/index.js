import * as dotenv from "dotenv";
dotenv.config()
import express from "express";
import axios, { isCancel, AxiosError } from "axios";
import { tools } from "nanocurrency-web";
import { createClient } from "redis";
import { v4 as uuidv4 } from "uuid";

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

// add rest route for /api
app.get("/api", (req, res) => {

    // return json response
    res.json({
        message: "Hello World"
    });
});



app.get("/alerts/:lang", (req, res) => {
    res.json(get_active_alert(req.params.lang));
});

app.get("/funding/:lang", (req, res) => {
    res.json(get_active_funding(req.params.lang));
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
            "title": "Nätverksproblem",
            "short_description": "På grund av pågående problem med Nano-nätverket, finns det många fördröjda transaktioner.",
            "long_description": "Nano-nätverket upplever problem som beror på en långvarig och pågående period med spamtransaktioner.\n\nNågra transaktioner kan dröja avsevärt, upp till flera dagar. Vi kommer att hålla våra användare uppdaterade med ny information så snart Nano-teamet förmedlar den.\n\nDu kan läsa mer genom att trycka på \"Läs Mer\" nedan.\n\nAlla problem som rör fördröjda transaktioner är på grund av nätverksproblem hos Nano. Vi är inte associerade med Nano Foundation eller dess utvecklare och kan därför inte påskynda långsamma transaktioner.\n\nVi uppskattar ditt tålamod under denna period.",
        },
        "es": {
            "title": "Problemas de red",
            "short_description": "Debido a problemas continuos con la red Nano, muchas transacciones se retrasan.",
            "long_description": "La red Nano está experimentando problemas causados ​​por un período prolongado y continuo de transacciones de spam.\n\nAlgunas transacciones pueden retrasarse significativamente, hasta varios días. Mantendremos a nuestros usuarios actualizados con nueva información a medida que el equipo de Nano la proporcione.\n\nPuede leer más apretando \"Leer Más\" abajo\n\nTodos los problemas relacionados con las demoras en las transacciones se deben a problemas de la red Nano, no Natrium. No estamos asociados con la Nano Foundation o sus desarrolladores y no podemos hacer nada para acelerar las transacciones lentas.\n\nAgradecemos su paciencia durante este tiempo.",
        },
        "tr": {
            "title": "Ağ Problemleri",
            "short_description": "Nano ağında devam eden spam problemi nedeniyle bir çok işlem gecikmekte.",
            "long_description": "Nano ağı bir süredir devam eden spam nedeniyle problem yaşıyor.\n\nBazı işlemleriniz bir kaç gün süren gecikmelere maruz kalabilir. Nano takımının vereceği güncel haberleri size ileteceğiz.\n\nAşağıdaki \"Detaylı Bilgi\" butonuna dokunarak daha detaylı bilgi alabilirsiniz.\n\nİşlem gecikmeleriyle alakalı bu problemler Natrium'dan değil, Nano ağının kendisinden kaynaklı. Nano Foundation veya geliştiricileriyle bir bağımız olmadığı için işlemlerinizi hızlandırabilmek için şu noktada yapabileceğimiz bir şey ne yazık ki yok.\n\nAnlayışınız ve sabrınız için teşekkür ederiz."
        },
        "ja": {
            "title": "ネットワークエラー",
            "short_description": "Nanoネットワークの継続的な問題により、多くの取引が遅延しています。",
            "long_description": "Nanoネットワークでは、スパムの取引が長期間継続することによって問題が発生しています。\n\n一部の取引は最大数日遅れる場合があります。Nanoチームが提供する新しい情報で、皆さんを最新の状態に保ちます。\n\n 詳しくは\"詳しくは\"ボタンをクリックして下さい。\n\n取引の遅延に関するすべての問題は、Natriumではなく、Nanoネットワークの問題が原因です。NatriumはNano Foundationやその開発者とは関係がなく、遅い取引をスピードアップするために何もすることはできません。\n\nご理解お願いいたします。",
        },
        "de": {
            "title": "Netzwerkprobleme",
            "short_description": "Aufgrund von anhaltenden Problemen mit dem Nano-Netzwerk sind aktuell viele Transaktionen verzögert.",
            "long_description": "Das Nano-Netzwerk kämpft derzeit mit Problemen, die durch eine lang andauernde Serie von Spam-Transaktionen verursacht wurden.\n\nManche Transaktionen können daher stark verzögert sein, teilweise um bis zu mehrere Tage. Wir werden unsere Nutzer über wichtige Neuigkeiten informieren, sobald das Nano-Team diese veröffentlicht.\n\nErfahre mehr, indem du auf \"Mehr Infos\" klickst.\n\nDie Probleme mit verzögerten Transaktionen sind verursacht durch das Nano-Netzwerk, nicht durch Natrium. Wir stehen in keinem Zusammenhang mit der Nano Foundation oder ihren Entwicklern und können daher nichts tun, um die Transaktionen zu beschleunigen.\n\nVielen Dank für dein Verständnis.",
        },
        "fr": {
            "title": "Problèmes de réseau",
            "short_description": "En raison des problèmes en cours avec le réseau Nano, de nombreuses transactions sont retardées.",
            "long_description": "Le réseau Nano connaît des problèmes causés par une période prolongée et continue de transactions de spam.\n\nCertaines transactions peuvent être considérablement retardées, jusqu'à plusieurs jours. Nous tiendrons nos utilisateurs à jour avec de nouvelles informations au fur et à mesure que l'équipe Nano les fournira.\n\nVous pouvez en savoir plus en appuyant sur \"Lire la suite\" ci-dessous.\n\nTous les problèmes liés aux retards de transaction sont dus aux problèmes de réseau Nano, et non à Natrium. Nous ne sommes pas associés à la Fondation Nano ou à ses développeurs et ne pouvons rien faire pour accélérer les transactions lentes.\n\nNous apprécions votre patience pendant cette période.",
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
            "title": "Проблемы с сетью",
            "short_description": "Из-за текущих проблем с сетью Nano многие транзакции задерживаются.",
            "long_description": "В сети Nano возникают проблемы, вызванные продолжительным периодом спам-транзакций.\n\nНекоторые транзакции могут быть значительно задержаны, до нескольких дней. Мы будем держать наших пользователей в курсе новой информации, поскольку команда Nano  предоставляет его.\n\nВы можете узнать больше, нажав \"Подробнее\" ниже.\n\nВсе проблемы, связанные с задержками транзакций, вызваны проблемами сети Nano, а не Natrium. Мы не связаны с Nano Foundation его разработчики не могут ничего сделать для ускорения медленных  транзакций.\n\nМы благодарим вас за терпение в это время.",
        },
        "da": {
            "title": "Netværksproblemer",
            "short_description": "På grund af igangværende problemer med Nano-netværket er der mange forsinkede transaktioner.",
            "long_description": "Nano-netværket oplever problemer på grund af en lang og løbende periode med spamtransaktioner.\n\nNogle transaktioner kan tage lang tid, op til flere dage. Vi holder vores brugere opdateret med nye oplysninger, så snart Nano-teamet giver dem.\n\nDu kan læse mere ved at klikke \"Læs mere\" nedenfor.\n\nAlle problemer med hensyn til transaktionsforsinkelser skyldes problemer med Nano-netværket, ikke Natrium. Vi er ikke tilknyttet Nano Foundation eller dets udviklere og kan ikke gøre noget for at fremskynde langsomme transaktioner.\n\nVi sætter pris på din tålmodighed i denne periode.",
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
    let shorthand_account = await redisClient.hGet("usernames", `${requesting_account}`);
    if (!shorthand_account) {
        // set username to abbreviated account name:
        shorthand_account = requesting_account.substring(0, 12);
    } else {
        shorthand_account = "@" + shorthand_account
    }

    // push notifications
    // fcm = aiofcm.FCM(fcm_sender_id, fcm_api_key)


    let request_uuid = await check_local_uuid(local_uuid)
    let request_time = parseInt(Date.now() / 1000);

    // Send notification with generic title, send amount as body. App should have localizations and use this information at its discretion
    let notification_title = `Request for ${raw_to_nano(amount_raw)} NANO from ${shorthand_account}`;
    let notification_body = `Open Nautilus to pay this request.`;
    for (let t2 of fcm_tokens_v2) {
        let message = {
            token: t2,
            notification: {
                "title": notification_title,
                "body": notification_body,
                // "sound": "default",
                // "tag": account
            },
            data: {
                "click_action": "FLUTTER_NOTIFICATION_CLICK",
                "account": account,
                "payment_request": "true",
                "uuid": request_uuid,
                "local_uuid": local_uuid,
                "memo_enc": `${memo_enc}`,
                "amount_raw": `${amount_raw}`,
                "requesting_account": requesting_account,
                "requesting_account_shorthand": shorthand_account,
                "request_time": `${request_time}`
            },
            // priority: aiofcm.PRIORITY_HIGH,
            // content_available: true,
        };
        await messaging.send(message).then((response) => {
            console.log('Successfully sent message:', response);
        }).catch((error) => {
            console.error('Error sending message:', error);
        });
    }

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

    // push notifications
    // fcm = aiofcm.FCM(fcm_sender_id, fcm_api_key)

    for (let t2 of fcm_tokens_v2) {
        let message = {
            token: t2,
            data: {
                // "click_action": "FLUTTER_NOTIFICATION_CLICK",
                "account": account,
                "payment_record": "true",
                "is_request": "true",
                "memo_enc": `${memo_enc}`,
                "uuid": request_uuid,
                "local_uuid": local_uuid,
                "amount_raw": `${amount_raw}`,
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
    for (let token of fcm_tokens_v2) {
        let message = {
            token: token,
            data: {
                // # "click_action": "FLUTTER_NOTIFICATION_CLICK",
                "account": account,
                "requesting_account": requesting_account,
                "payment_memo": True,
                "memo_enc": str(memo_enc),
                "block": str(block),
                "uuid": request_uuid,
                "local_uuid": local_uuid,
                "request_time": request_time
            },
        }
        await messaging.send(message).then((response) => {
            console.log('Successfully sent message:', response);
        }).catch((error) => {
            console.error('Error sending message:', error);
        });
    }

    // # @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    // # also push to the requesting account, so they get the uuid
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
                "requesting_account": requesting_account,
                "payment_record": "true",
                "is_memo": "true",
                "memo_enc": `${memo_enc}`,
                "uuid": request_uuid,
                "local_uuid": local_uuid,
                "block": `${block}`,
                // # "amount_raw": str(send_amount),
                // # "requesting_account": requesting_account,
                // # "requesting_account_shorthand": shorthand_account,
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
    let shorthand_account = await redisClient.hGet("usernames", `${requesting_account}`);
    if (!shorthand_account) {
        // set username to abbreviated account name:
        shorthand_account = requesting_account.substring(0, 12);
    } else {
        shorthand_account = "@" + shorthand_account
    }

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
                "account": account,
                "payment_message": True,
                "uuid": request_uuid,
                "local_uuid": local_uuid,
                "memo_enc": str(memo_enc),
                "requesting_account": requesting_account,
                "requesting_account_shorthand": shorthand_account,
                "request_time": request_time
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

    console.log(ret);

    res.json(ret);

});


app.post("/notifications", async (req, res) => {

    // get request json:
    let request_json = req.body || {};
    let ret = {};

    switch (request_json.action) {
        case "fcm_update":
            if (request_json.enabled) {
                await update_fcm_token_for_account(request_json.account, request_json.fcm_token_v2)
            } else {
                await delete_fcm_token_for_account(request_json.account, request_json.fcm_token_v2)
            }
            break;
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


async function generate_account_id(seed, index) {
    // TODO:
    return "0";
}

async function branch_create_link({ paperWalletSeed, paperWalletAccount, memo, fromAddress, amountRaw, giftUUID, requireCaptcha }) {
    let url = "https://api2.branch.io/v1/url"
    let headers = { 'Content-Type': 'application/json' }

    let branch_api_key = process.env.BRANCH_API_KEY;

    let giftDescription = "Get the app to open this gift card!";

    if (BigInt(amountRaw) > BigInt(1000000000000000000000000000000)) {
        // more than 1 NANO:
        // TEST:
        formattedAmount = BigInt(amountRaw) / BigInt(1000000000000000000000000000000);
        giftDescription = `Someone sent you ${formattedAmount} NANO! Get the app to open this gift card!`;
    }

    data = {
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
    console.log(resp);
    return resp;
}

async function gift_split_create(res, { seed, split_amount_raw, memo, requesting_account, require_captcha }) {
    // TODO:
    // let giftUUID = str(uuid.uuid4())[-12:];
    let giftUUID = "";
    giftData = {
        "seed": seed,
        "split_amount_raw": splitAmountRaw,
        "memo": memo,
        "from_address": fromAddress,
        "gift_uuid": giftUUID,
        "require_captcha": requireCaptcha,
    };
    await redisClient.hset("gift_data", giftUUID, giftData);

    if (BigInt(splitAmountRaw) > BigInt(1000000000000000000000000000000000)) {
        res.json({ "error": "splitAmountRaw is too large" });
        return;
    }

    paperWalletAccount = generate_account_id(seed, 0);

    branchResponse = await branch_create_link({ paperWalletSeed: seed, paperWalletAccount, memo, fromAddress, amountRaw: splitAmountRaw, giftUUID, requireCaptcha });
    if (branchResponse == null || branchResponse.status_code != 200) {
        return { "error": "error creating branch link" }
    }

    branchLink = branchResponse.json().url;
    return { "link": branchLink, "gift_data": giftData }
}

async function gift_claim({ gift_uuid, requesting_account, requesting_device_uuid }) {
    return null;
}

async function gift_info({ gift_uuid, requesting_account, requesting_device_uuid }) {
    return null;
}


app.get("/gift", async (req, res) => {

    // get request json:
    let request_json = req.body || {};
    let ret;

    switch (request_json["action"]) {
        case "gift_split_create":
            // # # check the signature:
            // # ret = await validate_signature(request_json.get("requesting_account"), request_json.get("request_signature"), request_json.get("request_nonce"))
            // # if ret == None:
            // #     pass
            ret = await gift_split_create(request_json);
            if (ret != null) break;
            ret = {
                "success": true,
                "link": ret["link"],
                "gift_data": ret["gift_data"],
            };
            break;
        case "gift_info":
            ret = await gift_info(request_json);
            break;
        case "gift_claim":
            ret = await gift_claim(request_json);
            break;
        default:
            ret = {
                "error": "invalid action",
            };
            break;
    }

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
    if (!(token in cur_list['data'])) {
        cur_list['data'].push(token);
    }
    await redisClient.set(account, JSON.stringify(cur_list));
}

async function get_or_upgrade_token_account_list(account, token) {
    let curTokenList = await redisClient.get(token);
    if (!!curTokenList) {
        return [];
    } else {
        try {
            let curToken = JSON.parse(curTokenList);
            return curToken;
        } catch (e) {
            let curToken = curTokenList;
            // CHECK (expire):
            await redisClient.set(token, JSON.stringify([curToken]), "EX", 2592000);
            if (account != curToken) {
                return [];
            }
        }
    }
    return JSON.parse(await redisClient.get(token));
}

async function set_or_upgrade_token_account_list(account, token) {
    let curTokenList = await redisClient.get(token);
    if (!!curTokenList) {
        await redisClient.set(token, JSON.stringify([account]), "EX", 2592000)
    } else {
        try {
            let curToken = JSON.parse(curTokenList)
            if (!(account in curToken)) {
                curToken.push(account);
                await redisClient.set(token, JSON.stringify(curToken), "EX", 2592000);
            }
        } catch (e) {
            let curToken = curTokenList
            await redisClient.set(token, JSON.stringify([curToken]), "EX", 2592000);
        }
    }
    // suspicious?:
    return JSON.parse(await redisClient.get(token));
}

async function get_fcm_tokens(account) {
    // """Return list of FCM tokens that belong to this account"""
    let tokens = await redisClient.get(account)
    if (!tokens) return [];

    // tokens = JSON.parse(tokens.replace('\'', '"'))
    tokens = JSON.parse(tokens);
    // Rebuild the list for this account removing tokens that dont belong anymore
    let new_token_list = {};
    new_token_list['data'] = [];
    if (!('data' in tokens)) {
        return [];
    }
    for (let t of tokens['data']) {
        let account_list = await get_or_upgrade_token_account_list(account, t);
        if (!account_list.includes(account)) {
            continue;
        }
        new_token_list['data'].push(t)
    }
    await redisClient.set(account, JSON.stringify(new_token_list));
    return new_token_list['data'];
}