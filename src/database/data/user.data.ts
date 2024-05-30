import { User } from '../../services/users/entities/user.entity';
import { UserRole } from '../../services/users/enums/user-role.enum';

/**
 * Dummy data for {@link User} entity.
 */
export const userData = [
  new User({
    id: '790b0795-cffe-41df-9d3a-c48216c78a08',
    username: 'super_admin',
    password:
      '$argon2id$v=19$m=65536,t=3,p=4$AJgltBJ0WY3dCBHs8/Hmgw$56y+zKfzef2qaaFWXYRLXw4VTjHjm1KJwgc8zngSp80', // password
    role: UserRole.SuperAdmin,
    createdById: '790b0795-cffe-41df-9d3a-c48216c78a08',
    updatedById: '790b0795-cffe-41df-9d3a-c48216c78a08',
  }),
  new User({
    id: 'd3e60d85-b9b9-4fa8-a48c-040b368ff179',
    username: 'user1',
    email: 'user1@gmail.com',
    password:
      '$argon2id$v=19$m=65536,t=3,p=4$AJgltBJ0WY3dCBHs8/Hmgw$56y+zKfzef2qaaFWXYRLXw4VTjHjm1KJwgc8zngSp80', // password
    role: UserRole.User,
    createdById: '790b0795-cffe-41df-9d3a-c48216c78a08',
    updatedById: '790b0795-cffe-41df-9d3a-c48216c78a08',
  }),
  new User({
    id: 'fbf69ccf-4780-4eea-951e-b75c65ddf75a',
    username: 'user2',
    email: 'user2@gmail.com',
    password:
      '$argon2id$v=19$m=65536,t=3,p=4$AJgltBJ0WY3dCBHs8/Hmgw$56y+zKfzef2qaaFWXYRLXw4VTjHjm1KJwgc8zngSp80', // password
    role: UserRole.User,
    createdById: '790b0795-cffe-41df-9d3a-c48216c78a08',
    updatedById: '790b0795-cffe-41df-9d3a-c48216c78a08',
  }),
  new User({
    id: 'dd194f84-6759-46af-86c9-b476b358d88e',
    username: 'user3',
    email: 'user3@gmail.com',
    password:
      '$argon2id$v=19$m=65536,t=3,p=4$AJgltBJ0WY3dCBHs8/Hmgw$56y+zKfzef2qaaFWXYRLXw4VTjHjm1KJwgc8zngSp80', // password
    role: UserRole.User,
    createdById: '790b0795-cffe-41df-9d3a-c48216c78a08',
    updatedById: '790b0795-cffe-41df-9d3a-c48216c78a08',
  }),
  new User({
    id: '34722e21-156c-498d-8f5c-2d0e7d2d40f3',
    username: 'user4',
    email: 'user4@gmail.com',
    password:
      '$argon2id$v=19$m=65536,t=3,p=4$AJgltBJ0WY3dCBHs8/Hmgw$56y+zKfzef2qaaFWXYRLXw4VTjHjm1KJwgc8zngSp80', // password
    role: UserRole.User,
    createdById: '790b0795-cffe-41df-9d3a-c48216c78a08',
    updatedById: '790b0795-cffe-41df-9d3a-c48216c78a08',
  }),
  new User({
    id: '3da13239-d2d7-412b-bbc4-2eb485051fa3',
    username: 'user5',
    email: 'user5@gmail.com',
    password:
      '$argon2id$v=19$m=65536,t=3,p=4$AJgltBJ0WY3dCBHs8/Hmgw$56y+zKfzef2qaaFWXYRLXw4VTjHjm1KJwgc8zngSp80', // password
    role: UserRole.User,
    createdById: '790b0795-cffe-41df-9d3a-c48216c78a08',
    updatedById: '790b0795-cffe-41df-9d3a-c48216c78a08',
  }),
  new User({
    id: '8e35ece9-1ff5-4126-8c2e-45416b4b69fc',
    username: 'user6',
    email: 'user6@gmail.com',
    password:
      '$argon2id$v=19$m=65536,t=3,p=4$AJgltBJ0WY3dCBHs8/Hmgw$56y+zKfzef2qaaFWXYRLXw4VTjHjm1KJwgc8zngSp80', // password
    role: UserRole.User,
    createdById: '790b0795-cffe-41df-9d3a-c48216c78a08',
    updatedById: '790b0795-cffe-41df-9d3a-c48216c78a08',
  }),
  new User({
    id: '09a7f5a7-85b2-4b25-a033-5a6cc0ee54db',
    username: 'user7',
    email: 'user7@gmail.com',
    password:
      '$argon2id$v=19$m=65536,t=3,p=4$AJgltBJ0WY3dCBHs8/Hmgw$56y+zKfzef2qaaFWXYRLXw4VTjHjm1KJwgc8zngSp80', // password
    role: UserRole.User,
    createdById: '790b0795-cffe-41df-9d3a-c48216c78a08',
    updatedById: '790b0795-cffe-41df-9d3a-c48216c78a08',
  }),
  new User({
    id: '090a48d4-ced7-44e2-947a-2f16ba8f866e',
    username: 'user8',
    email: 'user8@gmail.com',
    password:
      '$argon2id$v=19$m=65536,t=3,p=4$AJgltBJ0WY3dCBHs8/Hmgw$56y+zKfzef2qaaFWXYRLXw4VTjHjm1KJwgc8zngSp80', // password
    role: UserRole.User,
    createdById: '790b0795-cffe-41df-9d3a-c48216c78a08',
    updatedById: '790b0795-cffe-41df-9d3a-c48216c78a08',
  }),
  new User({
    id: 'a2fe7774-b61c-448d-b5fb-8ca3b1da7b91',
    username: 'user9',
    email: 'user9@gmail.com',
    password:
      '$argon2id$v=19$m=65536,t=3,p=4$AJgltBJ0WY3dCBHs8/Hmgw$56y+zKfzef2qaaFWXYRLXw4VTjHjm1KJwgc8zngSp80', // password
    role: UserRole.User,
    createdById: '790b0795-cffe-41df-9d3a-c48216c78a08',
    updatedById: '790b0795-cffe-41df-9d3a-c48216c78a08',
  }),
  new User({
    id: '35c323d3-2ac1-4328-851b-07384e192fb9',
    username: 'user10',
    email: 'user10@gmail.com',
    password:
      '$argon2id$v=19$m=65536,t=3,p=4$AJgltBJ0WY3dCBHs8/Hmgw$56y+zKfzef2qaaFWXYRLXw4VTjHjm1KJwgc8zngSp80', // password
    role: UserRole.User,
    createdById: '790b0795-cffe-41df-9d3a-c48216c78a08',
    updatedById: '790b0795-cffe-41df-9d3a-c48216c78a08',
  }),
  new User({
    id: 'c5492e61-dea3-4e1d-8b88-8d28eeb090ee',
    username: 'user11',
    email: 'user11@gmail.com',
    password:
      '$argon2id$v=19$m=65536,t=3,p=4$AJgltBJ0WY3dCBHs8/Hmgw$56y+zKfzef2qaaFWXYRLXw4VTjHjm1KJwgc8zngSp80', // password
    role: UserRole.User,
    createdById: '790b0795-cffe-41df-9d3a-c48216c78a08',
    updatedById: '790b0795-cffe-41df-9d3a-c48216c78a08',
  }),
  new User({
    id: '2c7a605b-6df7-4a78-94e5-e66e80f24666',
    username: 'user12',
    email: 'user12@gmail.com',
    password:
      '$argon2id$v=19$m=65536,t=3,p=4$AJgltBJ0WY3dCBHs8/Hmgw$56y+zKfzef2qaaFWXYRLXw4VTjHjm1KJwgc8zngSp80', // password
    role: UserRole.User,
    createdById: '790b0795-cffe-41df-9d3a-c48216c78a08',
    updatedById: '790b0795-cffe-41df-9d3a-c48216c78a08',
  }),
  new User({
    id: '977b8e0c-98bb-4c0e-b843-6712bff50da9',
    username: 'user13',
    email: 'user13@gmail.com',
    password:
      '$argon2id$v=19$m=65536,t=3,p=4$AJgltBJ0WY3dCBHs8/Hmgw$56y+zKfzef2qaaFWXYRLXw4VTjHjm1KJwgc8zngSp80', // password
    role: UserRole.User,
    createdById: '790b0795-cffe-41df-9d3a-c48216c78a08',
    updatedById: '790b0795-cffe-41df-9d3a-c48216c78a08',
  }),
  new User({
    id: '09c455bd-dd44-4cd6-971e-4a59cfbec036',
    username: 'user14',
    email: 'user14@gmail.com',
    password:
      '$argon2id$v=19$m=65536,t=3,p=4$AJgltBJ0WY3dCBHs8/Hmgw$56y+zKfzef2qaaFWXYRLXw4VTjHjm1KJwgc8zngSp80', // password
    role: UserRole.User,
    createdById: '790b0795-cffe-41df-9d3a-c48216c78a08',
    updatedById: '790b0795-cffe-41df-9d3a-c48216c78a08',
  }),
  new User({
    id: '1c9d7f61-be12-4236-95a8-3777c2186410',
    username: 'user15',
    email: 'user15@gmail.com',
    password:
      '$argon2id$v=19$m=65536,t=3,p=4$AJgltBJ0WY3dCBHs8/Hmgw$56y+zKfzef2qaaFWXYRLXw4VTjHjm1KJwgc8zngSp80', // password
    role: UserRole.User,
    createdById: '790b0795-cffe-41df-9d3a-c48216c78a08',
    updatedById: '790b0795-cffe-41df-9d3a-c48216c78a08',
  }),
] as const; // * Make it tuple to allow checked indexes {@see https://www.youtube.com/watch?v=nNse0r0aRT8&t=957s}
