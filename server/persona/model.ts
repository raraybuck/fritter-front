/* eslint-disable no-trailing-spaces */
import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
// import type {Follow} from '../follow/model';

/**
 * This file defines the properties stored in a Persona
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Persona on the backend
export type Persona = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  user: string; //username of the user
  handle: string;
  name: string;
  // followers: [Types.ObjectId];
  // following: [Types.ObjectId];
};

export type PopulatedPersona = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  user: string; 
  handle: string;
  name: string;
  // followers: [Persona];
  // following: [Follow];
};


// Mongoose schema definition for interfacing with a MongoDB table
// Persona stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const PersonaSchema = new Schema({
  // The persona's parent user (creator)
  user: {
    type: String, 
    required: true,
    // ref: 'User'
  },
  // The persona's public identifier/handle (should be unique)
  handle: {
    type: String,
    required: true
  },
  // The public name associated with the persona
  name: {
    type: String,
    required: true
  }, 
  // // list of a persona's followers
  // followers: {
  //   type: [Schema.Types.ObjectId],
  //   required: true,
  //   ref: 'Persona'
  // },
  // // list of persona's that this persona follows
  // following: {
  //   type: [Schema.Types.ObjectId],
  //   required: true,
  //   ref: 'Persona'
  // }
}, {
  toObject: { virtuals: true, versionKey: false },
  toJSON: { virtuals: true, versionKey: false }
});

// // Define virtual property upvotes in the Freet schema associating referencing
// // Upvotes by its foreignField freet and tying it back to the freet’s localField of its ID.
// // -----
// // Define virtual property followers in the Persona schema associating referencing
// // Follow by its foreignField following and tying it back to the persona’s localField of its ID.
// // -----
// // (virtual-population)
// // Auto-populate a Persona.followers field with any followers associated with this persona such that Persona._id === Submission.assignment._id
// PersonaSchema.virtual('followers', {
//   ref: 'Follow',
//   localField: '_id',
//   foreignField: 'followingId'
// });

// // of a Follow, associate the Follow with this persona (id) since they were the "follower"
// PersonaSchema.virtual('following', {
//   ref: 'Follow',
//   localField: '_id',
//   foreignField: 'followerId'
// });

// // // (virtual-population)
// // // Auto-populate a Assignment.submissions field with any submissions are associated with this assignment such that Assignment._id === Submission.assignment._id
// // AssignmentSchema.virtual('submissions', {
// //   ref: 'Submission',
// //   localField: '_id',
// //   foreignField: 'assignment'
// // });

  
const PersonaModel = model<Persona>('Persona', PersonaSchema);
export default PersonaModel;
  
