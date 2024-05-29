import { Swipe } from '../../services/swipes/entities/swipe.entity';
import { SwipeType } from '../../services/swipes/enums/swipe-type.enum';

/**
 * Dummy data for {@link Swipe} entity.
 */
export const swipeData = [
  new Swipe({
    id: '838ede1b-b61b-405a-9085-63728c1f0524',
    type: SwipeType.Like,
    userId: 'd3e60d85-b9b9-4fa8-a48c-040b368ff179',
    profileId: '1c9d7f61-be12-4236-95a8-3777c2186410',
  }),
] as const; // * Make it tuple to allow checked indexes {@see https://www.youtube.com/watch?v=nNse0r0aRT8&t=957s}
