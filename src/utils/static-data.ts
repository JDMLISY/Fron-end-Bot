import { timeFormater } from './helpers';

export const sampleChatHeaderJson = {
  chatGrpName: 'United',
  profile: 'assets/images/pexels-dids.jpg',
  videocall: 'assets/images/video-call.svg',
  settings: 'assets/images/three-dots.svg',
};

export const sampleChatJson = [
  {
    userId: '1',
    username: 'Harry Maguire',
    content: 'Hey guys',
    time: timeFormater(new Date().toISOString()),
    image: '/assets/images/userimg.svg',
    type: 'sender',
  },
  {
    userId: '1',
    username: 'Harry Maguire',
    content:
      'The sun hung low in the sky, casting long shadows across the tranquil meadow. Birds chirped merrily in the distance, and a gentle breeze rustled the leaves of the tall oak trees that lined the edge of the field. It was a perfect day for a leisurely picnic, and Sarah and John had spread out a checkered blanket under the shade of a massive oak',
    time: timeFormater(new Date().toISOString()),
    image: '/assets/images/userimg.svg',
    type: 'sender',
  },
  {
    userId: '1',
    username: 'Harry Maguire',
    content:
      'I hope you find this sample text enjoyable! If you have any specific topics or themes in mind, please let me know, and I can generate text accordingly.',
    time: timeFormater(new Date().toISOString()),
    image: '/assets/images/userimg.svg',
    type: 'sender',
  },
  {
    userId: '0',
    username: 'You',
    content:
      'You can further customize the CSS styles to match your specific design requirements. This is just a starting point to create a chat input field with CSS.',
    time: timeFormater(new Date().toISOString()),
    image: '/assets/images/userimg.svg',
    type: 'user',
  },
];

export const sampleInputJson = {
  attachBtn: 'assets/images/plus.svg',
  sendBtn: 'assets/images/send-white.svg',
};

export const sampleChatDetail = {
  chatGrpName: 'United',
  profile: 'assets/images/pexels-dids.jpg',
  close: 'assets/images/cross.svg',
  title: 'Detail group',
  settingsIcon: 'assets/images/settings.svg',
  descriptionTitle: 'Description',
  linkTitle: 'Link Group',
  link: 'https://google.com',
  membersTitle: 'Members',
  description:
    'Join us for engaging discussions on all things related to lifestyle, from fitness and fashion to travel and food.',
};

export const sampleMediaDetail = {
  close: 'assets/images/cross.svg',
  title: 'Media',
};

export const availableChats = [
  {
    userName: 'Harry Maguire',
  },
  {
    userName: 'Harry Maguire',
  },
  {
    userName: 'Harry Maguire',
  },
  {
    userName: 'Harry Maguire',
  },
  {
    userName: 'Harry Maguire',
  },
  {
    userName: 'Harry Maguire',
  },
];

export const mediaStaticFiles = [
  {
    name: '1',
    img: 'assets/images/media/1.jpg',
  },
  {
    name: '2',
    img: 'assets/images/media/2.jpg',
  },
  {
    name: '3',
    img: 'assets/images/media/3.jpg',
  },
  {
    name: '4',
    img: 'assets/images/media/4.jpg',
  },
  {
    name: '5',
    img: 'assets/images/media/5.jpg',
  },
  {
    name: '6',
    img: 'assets/images/media/6.jpg',
  },
  {
    name: '7',
    img: 'assets/images/media/7.jpg',
  },
  {
    name: '8',
    img: 'assets/images/media/8.jpg',
  },
  {
    name: '9',
    img: 'assets/images/media/9.jpg',
  },
];

export const linkStaticFiles = [
  {
    id: '1',
    link: 'https://google.com',
    name: 'Better your game',
    desc: '',
    img: 'assets/images/link.svg',
  },
  {
    id: '2',
    link: 'https://google.com',
    name: 'Chelsea Own goal',
    desc: '',
    img: 'assets/images/link.svg',
  },
  {
    id: '3',
    link: 'https://google.com',
    name: 'Manchester to buy',
    desc: '',
    img: 'assets/images/link.svg',
  },
  {
    id: '4',
    link: 'https://google.com',
    name: 'Messi vs Ronaldo',
    desc: '',
    img: 'assets/images/link.svg',
  },
  {
    id: '5',
    link: 'https://google.com',
    name: 'Messi',
    desc: '',
    img: 'assets/images/link.svg',
  },
  {
    id: '6',
    link: 'https://google.com',
    name: '',
    desc: '',
    img: 'assets/images/link.svg',
  },
  {
    id: '7',
    link: 'https://google.com',
    name: '',
    desc: '',
    img: 'assets/images/link.svg',
  },
  {
    id: '8',
    link: 'https://google.com',
    name: '',
    desc: '',
    img: 'assets/images/link.svg',
  },
  {
    id: '9',
    link: 'https://google.com',
    name: '',
    desc: '',
    img: 'assets/images/link.svg',
  },
];

export const availableLinks = [
  {
    link: 'https://www.youtube.com/watch?v=EL4UdaLTVWc',
    title: 'Family Guy Best Moments #1',
    description: '',
    image:
      'https://i.ytimg.com/vi/EL4UdaLTVWc/hqdefault.jpg?sqp=-oaymwEmCOADEOgC8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGE4gZChlMA8=&rs=AOn4CLCLAebnhYX8Z4uU0v4_OP_oAKPZ8Q',
  },
  {
    link: 'https://www.youtube.com/watch?v=vkhMfgOT9Xs',
    title: "America's Deadliest Drug: Fentanyl | Patriot Act ",
    image: 'https://i.ytimg.com/vi/vkhMfgOT9Xs/maxresdefault.jpg',
    description:
      'On the latest episode of Patriot Act, Hasan discusses America’s opioid epidemic and the recent spike in deaths due to one drug in particular: fentanyl. ',
  },
  {
    link: 'https://www.youtube.com/watch?v=_NgQ9kmSl6Q',
    title: 'adblock users on youtube right now:',
    image: 'https://i.ytimg.com/vi/_NgQ9kmSl6Q/maxresdefault.jpg',
    description:
      'Twitter: https://twitter.com/ManCarryingOur second channel: https://www.youtube.com/channel/UC8aGE10t6QrcdRMpgorwkAAPatreon: https://www.patreon.com/mancarry',
  },
  {
    link: 'https://www.youtube.com/watch?v=etlXPx6lrAE',
    image: 'https://i.ytimg.com/vi/etlXPx6lrAE/maxresdefault.jpg',
    title:
      'Why did the world let India annex Goa? (Short Animated Documentary)',
    description:
      'In 1961 the Indian army marched into Portuguese Goa and after two days of fighting formally annexed it into the country. Given that the world largely believe...',
  },
  {
    link: 'https://www.youtube.com/watch?v=L2wW5lpa-HM',
    image: 'https://i.ytimg.com/vi/L2wW5lpa-HM/maxresdefault.jpg',
    description:
      'Checkout my Introductory course Bharata: A Biography of the Oldest CivilizationEnroll here - https://abhijitchavda7460.ongraphy.com/s/storeFor business/colla...',
    title:
      'Was Netaji Alive As Gumnami Baba? | Anuj Dhar on Subhas Chandra Bose | Abhijit Chavda Podcast 43',
  },
  {
    link: 'https://www.youtube.com/watch?v=VPIeUw3Zyds',
    title: 'System76 Pangolin Review: the 15" all rounder AMD Linux laptop',
    description:
      'Head to https://squarespace.com/thelinuxexperiment to save 10% off your first purchase of a website or domain using code thelinuxexperiment👏 SUPPORT THE CHA...',
    image: 'https://i.ytimg.com/vi/VPIeUw3Zyds/maxresdefault.jpg',
  },
];
