import type {HydratedDocument, Types} from 'mongoose';
import PersonaCollection from '../persona/collection';
import type {Follow} from './model';
import FollowModel from './model';
// import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore freets
 * stored in MongoDB, including adding, finding, updating, and deleting freets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Freet> is the output of the FreetModel() constructor,
 * and contains all the information in Freet. https://mongoosejs.com/docs/typescript.html
 */
class FollowCollection {
    /**
     * Add a follow to the collection
     *
     * @param {string} followerId - The id of the author of the follow
     * @param {string} followingId - The id of the persona being followed
     * @return {Promise<HydratedDocument<Follow>>} - The newly created follow
     */
    static async addOne(followerId: Types.ObjectId | string, followingId: Types.ObjectId | string): Promise<HydratedDocument<Follow>> {
        const date = new Date();
        const follow = new FollowModel({
            followerId,
            followingId,
            dateFollowed: date,
        });
        await follow.save(); // Saves follow to MongoDB
        return follow.populate(['followerId', 'followingId']);
    }

    /**
     * Find a follow by followId
     *
     * @param {string} followId - The id of the follow to find
     * @return {Promise<HydratedDocument<Follow>> | Promise<null> } - The follow with the given followId, if any
     */
    static async findOne(followId: Types.ObjectId | string): Promise<HydratedDocument<Follow>> {
        return FollowModel.findOne({_id: followId}).populate(['followerId', 'followingId']);
    }

    /**
     * Get all the follows in the database
     *
     * @return {Promise<HydratedDocument<Follow>[]>} - An array of all of the freets
     */
    static async findAll(): Promise<Array<HydratedDocument<Follow>>> {
        // Retrieves follows and sorts them from most to least recent
        return FollowModel.find({}).sort({dateFollowed: -1}).populate(['followerId', 'followingId']);
    }

    // /**
    //  * Get all the follows in the database that include a certain person
    //  *
    //  * @param personaId - the id of the persona to find followers and following for
    //  * @return {Promise<HydratedDocument<Follow>[]>} - An array of all of the freets
    //  */
    // static async findAllWithPersonaId(personaId: Types.ObjectId | string): Promise<Array<HydratedDocument<Follow>>> {
    //     // Retrieves follows and sorts them from most to least recent
    //     const following = await FollowCollection.findAllInitiatedById(personaId);
    //     const followers = await FollowCollection.findAllReceivedById(personaId);
    //     const follows:Follow[] = following.concat(followers);
    //     return follows.sort({dateFollowed: -1}));
    // }

    /**
     * Find a follow by the two parties of the Follow
     *
     * @param {string} followerId - The id of the person who initiated the follow
     * @param {string} followingId - The id of the person who was followed
     * @return {Promise<HydratedDocument<Follow>> | Promise<null> } - The follow with the given followId, if any
     */
    static async findOneByPartyIds(followerId: Types.ObjectId | string, followingId: Types.ObjectId | string): Promise<HydratedDocument<Follow>> {
        return FollowModel.findOne({followerId: followerId, followingId: followingId}).populate(['followerId', 'followingId']);
    }


    /**
     * Get all the follows by a given persona (ID); (the people they are following/that they followed)
     *
     * @param {string} personaId - The id of author (persona) of the follows
     * @return {Promise<HydratedDocument<Follow>[]>} - An array of all of the follows
     */
     static async findAllInitiatedById(personaId: Types.ObjectId | string): Promise<Array<HydratedDocument<Follow>>> {
        return FollowModel.find({followerId: personaId}).populate(['followerId', 'followingId']);
    }

    /**
     * Get all the follows by a given persona (handle); (the people they are following/that they followed)
     *
     * @param {string} handle - The handle of author (persona) of the follows
     * @return {Promise<HydratedDocument<Follow>[]>} - An array of all of the follows
     */
    static async findAllInitiatedByHandle(handle: string): Promise<Array<HydratedDocument<Follow>>> {
        const personaAuthor = await PersonaCollection.findOneByHandle(handle);
        return FollowModel.find({followerId: personaAuthor._id}).populate(['followerId', 'followingId']);
    }

    /**
     * Get all the followers of a given persona (ID); (the Follows where the persona was the one being followed)
     *
     * @param {string} personaId - The id of persona being followed (received a follow)
     * @return {Promise<HydratedDocument<Follow>[]>} - An array of all of the follows
     */
    static async findAllReceivedById(personaId: Types.ObjectId | string): Promise<Array<HydratedDocument<Follow>>> {
        return FollowModel.find({followingId: personaId}).populate(['followerId', 'followingId']);
    }

    /**
     * Get all the followers of a given persona (handle); (the Follows where the handle was the one being followed)
     *
     * @param {string} handle - The handle of the persona on the receiving end of the follows
     * @return {Promise<HydratedDocument<Follow>[]>} - An array of all of the follows
     */
     static async findAllReceiveddByHandle(handle: string): Promise<Array<HydratedDocument<Follow>>> {
        const personaAuthor = await PersonaCollection.findOneByHandle(handle);
        return FollowModel.find({followingId: personaAuthor._id}).populate(['followerId', 'followingId']);
    }

    /**
     * Delete a follow with given followId.
     *
     * @param {string} followId - The followId of the Follow to delete
     * @return {Promise<Boolean>} - true if the follow has been deleted, false otherwise
     */
    static async deleteOne(followId: Types.ObjectId | string): Promise<boolean> {
        const follow = await FollowModel.deleteOne({_id: followId});
        return follow !== null;
    }

    /**
     * Delete all the follows by the given persona (unfollow all those they are currently following)
     *
     * @param {string} personaId - The id of the "follower"
     */
    static async deleteMany(personaId: Types.ObjectId | string): Promise<void> {
        await FollowModel.deleteMany({followerId: personaId});
    }

}

export default FollowCollection;