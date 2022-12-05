import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Follow, PopulatedFollow} from './model';

type FollowResponse = {
    _id: string; // MongoDB assigns each object this ID on creation
    follower: string;
    following: string;
    dateFollowed: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Follow object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Follow>} follow - A follow
 * @returns {FollowResponse} - The follow object formatted for the frontend
 */
 const constructFollowResponse = (follow: HydratedDocument<Follow>): FollowResponse => {
    const followCopy: PopulatedFollow = {
      ...follow.toObject({
        versionKey: false // Cosmetics; prevents returning of __v property
      })
    };
    const follower = followCopy.followerId.handle; // followCopy is populated so followerId is a Persona
    const following = followCopy.followingId.handle;
    delete followCopy.followerId;
    delete followCopy.followingId;
    return {
      ...followCopy,
      _id: followCopy._id.toString(),
      follower: follower,
      following: following,
      dateFollowed: formatDate(follow.dateFollowed),
    };
  };
  
  export {
    constructFollowResponse
  };
  