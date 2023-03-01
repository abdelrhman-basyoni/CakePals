import { CakeDto } from '../../../../dtos/cake.dto';

export const cakeBaker = {
  username: 'baker',
  email: 'baker1@email.com',
  profile: {
    IsAcceptingOrders: true,
    pic: 'https://www.mona.uwi.edu/modlang/sites/default/files/modlang/male-avatar-placeholder.png',
    about: 'string',
    location: [30.15645132, 30.4576541],
    collectionTimeRange: {
      start: {
        hour: 12,
        miutes: 0,
      },
      end: {
        hour: 22,
        miutes: 0,
      },
    },
  },
  role: 'baker',
  _id: '63b2c066b5caa0919f61dcb9',
  createdAt: 1672659046643,
  updatedAt: 1672659046643,
  __v: 0,
};

export const cake1 = {
  title: 'first cake',
  description: 'best cake in town',
  price: 100,
  bakingTime: {
    hours: 2,
    miutes: 0,
  },
  cakeType: 'meat Pie',
};
