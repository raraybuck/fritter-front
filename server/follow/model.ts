import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {Persona} from '../persona/model';

/**
 * This file defines the properties stored in a Follower
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Follow on the backend
export type Follow = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  followerId: Types.ObjectId;
  followingId: Types.ObjectId;
  dateFollowed: Date;
};

export type PopulatedFollow = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  followerId: Persona;
  followingId: Persona;
  dateFollowed: Date;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Followers stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const FollowSchema = new Schema<Follow>({
  // The "author" personaId aka the person initiating the follow
  followerId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Persona'
  },
  // the persona being following
  followingId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Persona'
  },
  // The date the freet was created
  dateFollowed: {
    type: Date,
    required: true
  }
});

const FollowModel = model<Follow>('Follower', FollowSchema);
export default FollowModel;
