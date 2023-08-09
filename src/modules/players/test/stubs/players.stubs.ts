import { Player } from '@prisma/client';

export const playerStub = (): Player => ({
  id: 1,
  firstname: 'Eden',
  lastname: 'Hazard',
  goal: 93,
  salary: 118000000,
  devise: '$',
  pictureURl:
    'https://img.a.transfermarkt.technology/portrait/big/50202-1537861483.jpg?lm=1',
});

export const playersStub = (): Player[] => [
  playerStub(),
  {
    id: 2,
    firstname: 'Gareth',
    lastname: 'Bale',
    goal: 39,
    salary: 31200000,
    devise: '£',
    pictureURl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Liver-RM_%282%29_%28cropped%29.jpg/280px-Liver-RM_%282%29_%28cropped%29.jpg'
  },
  {
    id: 3,
    firstname: 'Paul',
    lastname: 'Pogba',
    goal: 69,
    salary: 34000000,
    devise: '€',
    pictureURl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Manchester_United_v_Leeds_United%2C_14_August_2021_%2823%29.jpg/220px-Manchester_United_v_Leeds_United%2C_14_August_2021_%2823%29.jpg'
  },
  {
    id: 4,
    firstname: 'Andres',
    lastname: 'Iniesta',
    goal: 126,
    salary: 35000000,
    devise: '$',
    pictureURl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Andr%C3%A9s_Iniesta.jpg/250px-Andr%C3%A9s_Iniesta.jpg'
  },
  {
    id: 5,
    firstname: 'Robert ',
    lastname: 'Lewandowski',
    goal: 134,
    salary: 23000000,
    devise: '€',
    pictureURl: 'https://upload.wikimedia.org/wikipedia/commons/0/03/Robert_Lewandowski%2C_FC_Bayern_M%C3%BCnchen_%28by_Sven_Mandel%2C_2019-05-27%29_01.jpg'
  },
  {
    id: 6,
    firstname: 'Mohamed',
    lastname: 'Salah',
    goal: 97,
    salary: 19730000,
    devise: '€',
    pictureURl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Mohamed_Salah%2C_Liverpool_FC_gegen_1._FSV_Mainz_05_%28Testspiel_23._Juli_2021%29_26.jpg/1200px-Mohamed_Salah%2C_Liverpool_FC_gegen_1._FSV_Mainz_05_%28Testspiel_23._Juli_2021%29_26.jpg'
  },
  {
    id: 7,
    firstname: 'Kylian',
    lastname: 'Mbappé',
    goal: 125,
    salary: 22000000,
    devise: '€',
    pictureURl: 'https://imgresizer.eurosport.com/unsafe/1200x0/filters:format(jpeg):focal(1118x429:1120x427)/origin-imgresizer.eurosport.com/2022/04/03/3349464-68469548-2560-1440.jpg'
  },
  {
    id: 8,
    firstname: 'Neymar',
    lastname: 'JR.',
    goal: 33,
    salary: 95000000,
    devise: '€',
    pictureURl: 'https://i0.wp.com/www.afriquesports.net/wp-content/uploads/2022/07/NEYMAR-JR-1437082.jpeg?fit=2048%2C1152&ssl=1'
  },
  {
    id: 9,
    firstname: 'Lionel',
    lastname: 'Messi',
    goal: 299,
    salary: 110000000,
    devise: '$',
    pictureURl: 'https://assets.goal.com/v3/assets/bltcc7a7ffd2fbf71f5/blt68e2d01a63826a80/60db38bcd9a5243b669adc7a/28587733bf577f983fbc38d2078c2dab388bf63a.jpg'
  },
  {
    id: 10,
    firstname: 'Cristiano',
    lastname: 'Ronaldo',
    goal: 298,
    salary: 125000000,
    devise: '£',
    pictureURl: 'https://images2.minutemediacdn.com/image/upload/c_crop,w_5306,h_2984,x_0,y_549/c_fill,w_720,ar_16:9,f_auto,q_auto,g_auto/images/GettyImages/mmsport/90min_fr_international_web/01g9pjecm167d0n6z7vj.jpg'
  },
  {
    id: 11,
    firstname: 'Marcos Aoás Corrêa',
    lastname: 'Marquinhos',
    goal: 44,
    salary: 1200000,
    devise: '€',
    pictureURl: 'https://www.allosport.net/uploads/2022/20/1/625_psg-marquinhos-a-hesite-a-quitter-la-bande-a-neymar-mbappe-et-messi.jpg'
  },
  {
    id: 12,
    firstname: 'Marco',
    lastname: 'Verratti',
    goal: 30,
    salary: 599999,
    devise: '€',
    pictureURl: 'https://img.a.transfermarkt.technology/portrait/big/102558-1602849501.jpg?lm=1'
  },
  {
    id: 13,
    firstname: 'karim',
    lastname: 'Benzema',
    goal: 99,
    salary: 5000999,
    devise: '€',
    pictureURl: ''
  },
  {
    id: 14,
    firstname: 'Michel',
    lastname: 'Platini',
    goal: 96,
    salary: 45,
    devise: 'Fr',
    pictureURl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Michel_Platini_en_1978%2C_%27Argentina_78%27%2C_Panini_figurina_n%C2%B090.jpg/250px-Michel_Platini_en_1978%2C_%27Argentina_78%27%2C_Panini_figurina_n%C2%B090.jpg'
  },
  {
    id: 15,
    firstname: 'Hakim ',
    lastname: 'Ziyech',
    goal: 399,
    salary: 15000000,
    devise: 'MAD',
    pictureURl: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/Hakim_Ziyech_2021.jpg'
  },
  {
    id: 16,
    firstname: 'Romain',
    lastname: 'Saïss',
    goal: 19,
    salary: 45000000,
    devise: 'MAD',
    pictureURl: 'https://upload.wikimedia.org/wikipedia/commons/7/76/Romain_Sa%C3%AFss_%28cropped%29.jpg'
  },
  {
    id: 17,
    firstname: 'Sofiane',
    lastname: 'Boufal',
    goal: 45,
    salary: 35000000,
    devise: 'MAD',
    pictureURl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/XXIII_Memorial_Quinocho_%28RC_Celta_vs_Mainz_05%29_-_23_%28cropped%29.jpg/1200px-XXIII_Memorial_Quinocho_%28RC_Celta_vs_Mainz_05%29_-_23_%28cropped%29.jpg'
  },
  {
    id: 18,
    firstname: 'Edson Arantes do Nascimento',
    lastname: 'Pelé',
    goal: 196,
    salary: 400000,
    devise: '$',
    pictureURl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Pel%C3%A9_%281966%29.jpg/220px-Pel%C3%A9_%281966%29.jpg'
  },
  {
    id: 19,
    firstname: 'Diego',
    lastname: 'Maradona',
    goal: 450,
    salary: 500000,
    devise: '$',
    pictureURl: 'http://t0.gstatic.com/licensed-image?q=tbn:ANd9GcTck8oykXTGN-rVMLmjZ_FMcVazdAEDF0sK62ciDBP_b5LtyoBxEr63Xl-6hRcQc5wX'
  },
  {
    id: 20,
    firstname: '',
    lastname: '',
    goal: 0,
    salary: 0,
    devise: '€',
    pictureURl: ''
  }
];