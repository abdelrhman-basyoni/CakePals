import { HotOrNot } from '../../../../enums/order.enum';
import { UserRoles } from '../../../../enums/userRoles.enum';
import { Order } from '../../../../models/order.model';
import { addTime } from '../../../../shared/utils';
import { Types } from 'mongoose';
export const bakerEx1 = {
  username: 'baker1',
  email: 'baker1@email.com',
  password: 'password8',
  role: UserRoles.baker,
  profile: {
    IsAcceptingOrders: true,
    pic: 'https://www.seekpng.com/png/detail/110-1100707_person-avatar-placeholder.png',
    about: 'this is a dummy baker',
    location: [30.15645132, 30.4576541],
    collectionTimeRange: {
      start: {
        hours: 0,
        miutes: 0,
      },
      end: {
        hours: 23,
        miutes: 59,
      },
    },
  },
};

export const cakeEx1 = {
  title: 'first cake',
  description: 'best cake in town',
  price: 100,
  bakingTime: {
    hours: 0,
    miutes: 10,
  },
  cakeType: 'meat Pie',
};

export const memberEx1 = {
  username: 'user',
  _id: '63b0249c33d313743a72b74c',
  email: 'user@example.com',
  role: UserRoles.member,
  password: 'password',
};
export const bakerTokenEx1 = {
  username: 'baker',
  _id: '63b2c066b5caa0919f61dcb9',
  email: 'baker2@example.com',
  role: UserRoles.baker,
  password: 'password8',
};

export const createOrderEx1Hot = {
  hotOrNot: HotOrNot.hot,
  collectionTime: Number(addTime(0, 40)),
};
export const createOrderNotHot = {
  hotOrNot: HotOrNot.not,
  collectionTime: Number(addTime(0, 40)),
};

// export const orderEx1 : Order = {

// }

export const OrderEx1 = {
  member: new Types.ObjectId(memberEx1._id),
  cake: {
    title: 'string',
    description: 'string',
    price: 100,
    bakingTime: {
      hours: 1,
      miutes: 0,
    },
    cakeType: 'honeyPie',
    baker: new Types.ObjectId('63b2c066b5caa0919f61dcb9'),
    _id: '63b3d1f9077b7b2003b96cbe',
  },
  collectionCode: 123456,
  bakingStartTime: Number(addTime(0, 30)),
  bakingEndTime: Number(addTime(1, 30)),
  collectionTime: Number(addTime(2, 30)),
  status: 'pending',
};

// {  "_id": {    "$oid": "63b562a74af0681b05dc0363"  },  "member": {    "$oid": "63b0249c33d313743a72b74c"  },  "cake": {    "createdAt": 1672729081753,    "updatedAt": 1672831655826,    "title": "string",    "description": "string",    "price": 0,    "bakingTime": {      "hours": 1,      "miutes": 0    },    "cakeType": "honeyPie",    "baker": {      "$oid": "63b2c066b5caa0919f61dcb9"    },    "_id": {      "$oid": "63b3d1f9077b7b2003b96cbe"    }  },  "bakingStartTime": 1672830847286,  "bakingEndTime": 1672834447286,  "collectionTime": 1672834447286,  "status": "pending",  "createdAt": 1672831655826,  "updatedAt": 1672831655826,  "__v": 0}
