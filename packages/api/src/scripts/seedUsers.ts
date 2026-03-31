import mongoose from 'mongoose';
import User from '../models/User';
import Threat from '../models/Threat';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const usersData = [
  { wallet: "GCRA6G5ZLEKWNFFN3LP2GS2KXZ74C7H2P5AIKOMD42KYNB3IJMP4CH52", email: "aravinddeshmukh@gmail.com", name: "Aravind Deshmukh" },
  { wallet: "GD5QVXWGR3Y5O27UBCOQZYNAKNIHWYTCJ2RUIMBEWH7QJF7OEKRCBA5H", email: "sunitaagarwal@gmail.com", name: "Sunita Agarwal" },
  { wallet: "GCK2O3IZPV5WESR7QTKUGUKL5H46OCTI27XOHVZDR77NJQPOQ3ZPTU6D", email: "rajeshdas81@gmail.com", name: "Rajesh Das" },
  { wallet: "GDZF4G4RNEHSAMPKNNPI65IABZTAT5M23FB3BQK3AOS5OUMFLPNO2UHQ", email: "snehapathak@gmail.com", name: "Sneha Pathak" },
  { wallet: "GCNHSCGCWZZ3W5ETWZENPWORQIHTEPCB57OR52XK3MDTBWWWNNUMQOZI", email: "akshayawasthy83@gmail.com", name: "Akshaya Awasthy" },
  { wallet: "GCNHSCGCWZZ3W5ETWZENPWORQIHTEPCB57OR52XK3MDVF53FSGGETBSU", email: "udhaneshantanu@gmail.com", name: "Shantanu Udhane" },
  { wallet: "GALWWEGHOMU5YODTZBVGPFP2OHCJH5VO3VKWNMW7ZNT6OECINVPQT7SQ", email: "vaibhaviagale7799@gmail.com", name: "Vaibhavi Agale" },
  { wallet: "GAZ27SJ7YFLUGO2O4JCTOWLNNXQZ5C7H5A7WFWEBALT6F6JELKJKNV44", email: "neelpote44@gmail.com", name: "Neel pote" },
  { wallet: "GAYJALSDDA3QYIIQDFESHZCHNKGWV43C76Y2MSL6MZS6RCGO7YO3HTMQ", email: "tanmaytad23@gmail.com", name: "Tanmay tadd" },
  { wallet: "GBAFATOIWCWJ4VFQ3KQEMSVNW6N7WTZKSNHQ2ROFOUCFO6H57CFQKHXO", email: "omkarnanavare1969@gmail.com", name: "Omkar nanavare" },
  { wallet: "GBWDGDXAN4AW22OBEQADIOSK2GE7EFNDLZDTBJV6AP33SEPTGNNGFDAE", email: "yashannadate2005@gmail.com", name: "yash annadate" },
  { wallet: "GDHPNSQINMCUNO6DOWO7HSAW5NTNO2MDY6LDHGKPJMGLUSUMLVWBJKJ6", email: "thanchanb@gmail.com", name: "Thanchan Bhumij" },
  { wallet: "GAGKWDKAZYZ7GSK2K6YZGGEDEZXL2GEHDU2NMOAU4AVHSFAVZH336FFX", email: "mrunalghorpade16@gmail.com", name: "Mrunal Ghorpade" },
  { wallet: "GBFMIBZ4NFYE4Y5FDHZTGMCZ2QVRPUSQUBNVWBOT2AKE5XAQGDNIZZPI", email: "adityasisodiya56412@gmail.com", name: "Aditya Shisodiya" },
  { wallet: "GBJFXVARF5CHQ6VTGOCSOQXPNQBDFPGOSUJAX65NRED73LUKKMQMQ4CN", email: "nishitbhalerao@gmail.com", name: "Nishit Bhalerao" },
  { wallet: "GBDBESS2W3MLVFIEWLXHF3IS5A4GLODLQ553I2SHIO57CJRP5YZBQERE", email: "vedantpathak002@gmail.com", name: "Vedant Pathak" },
  { wallet: "GBAMHA6PN5SATYWZ2XS6YVQQWF5ZO7HFJMT7N2X4BF2C4Q46I4Q3FZG5", email: "bhilareaniket2424@gmail.com", name: "Aniket Bhilare" },
  { wallet: "GAHQ5AHXEILHHMLKSKEJSWD6P7ZYOKGVXOYC7PXAGVYAFLSI6FO6ZPKI", email: "deogaonkarsharayu@gmail.com", name: "Sharayu Deogaonkar" },
  { wallet: "GBIDO36LSBDLHLJ3NE4C4SML5UAV73T6UHSKHG2ACIXQPCHANRO7MLBK", email: "ashakumbhar2006@gmail.com", name: "Asha Kumbhar" },
  { wallet: "GDQICJ6DHLQQ7EPEZUJECJL5QK7GY5F4VRSKPXAXDQSWMLJ6ULCU56CD", email: "bahiratvedang05@gmail.com", name: "Vedang Bahirat" },
  { wallet: "GA2EA5JITKW5R2LZ54VZ4FPSZVZZ4OHW7ZZJEZC2YILRQ5AKH76VDF3O", email: "badaderajas66@gmail.com", name: "Rajas Badade" },
  { wallet: "GBHHRIX4A4VKB74UCN76EZQI35VFIJ5RIXR3UO2XKUFUSV4JSUAYN4SJ", email: "sudhirbhalerao@gmail.com", name: "Sudhir Bhalerao" },
  { wallet: "GAL2LXBPTRJGFZQFAYTIWZWP3SGKVLORUXY5T2JKFVYTN6UBMSWXOTPM", email: "dcnishitbhalerao@gmail.com", name: "DC Nishit Bhalerao" },
  { wallet: "GBFJVTUVOOS5GEPMNEYYQUJG6YNYYYK45OXGHZTUZG3JUVHIEVN45UNH", email: "vbahirat24@gmail.com", name: "Vedang Bahirat" },
  { wallet: "GANYZ35IZDDYJG46ED4FSYYVUG3BUHG7STODEPPNU7RJ3BWTWVXD6QKU", email: "Khushinagare8@gmail.com", name: "Khushi Nagare" },
  { wallet: "GCAJDHFEU39FHEKJ48FH84FJHEJF849FJ84HFJEKFL3FHEUFHDKS8F3J", email: "druvesdongre@gmail.com", name: "Druves Dongre" },
  { wallet: "GD5XVXWGR3Y5O27UBCOQZYNAKNIHWYTCJ2RUIMBEWH7QJF7OEKRCBA51", email: "yogeshnagare72@gmail.com", name: "Yogesh Nagare" },
  { wallet: "GCK2X3IZPV5WESR7QTKUGUKL5H46OCTI27XOHVZDR77NJQPOQ3ZPTU1D", email: "ayyush1326@gmail.com", name: "Ayyush gaikwad" },
  { wallet: "GCATAASNFHODIKA4VTIEZHONZB3BGZJL42FXHHZ3VS6YKX2PCDIJ3LDY", email: "harshaljagdale0296@gmail.com", name: "Harshal Jagdale" }
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log('Connected to MongoDB for seeding...');
        await User.deleteMany({ isAdmin: false });
        await User.insertMany(usersData.map(u => ({
            walletAddress: u.wallet,
            email: u.email,
            name: u.name,
            totalReports: Math.floor(Math.random() * 20) + 1,
            verifiedReports: Math.floor(Math.random() * 10),
            joinedAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 7),
            onboardingComplete: true
        })));
        
        await Threat.deleteMany({});
        const domains = ['malicious-site.net', 'fake-soroban.io', 'stellar-scam.xyz'];
        await Threat.insertMany(domains.map(d => ({
            urlHash: Buffer.from(d).toString('base64'),
            originalUrl: `https://${d}`,
            domain: d,
            threatType: 'phishing',
            severity: 3,
            reportedBy: [{ walletAddress: usersData[0].wallet, timestamp: new Date() }]
        })));
        
        await mongoose.disconnect();
        console.log('Seeding complete.');
    } catch (err) {
        process.exit(1);
    }
}
seed();
