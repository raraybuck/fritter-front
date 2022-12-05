import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
// import type {Persona, PopulatedPersona} from './model';
import type {Persona} from './model';
import UserCollection from '../user/collection';

// Update this if you add a property to the Persona type!
type PersonaResponse = {
    _id: string;
    user: string;
    handle: string;
    name: string;
};

/**
 * Transform a raw Persona object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Persona>} persona - A persona
 * @returns {PersonaResponse} - The persona object formatted for the frontend
 */
const constructPersonaResponse = (persona: HydratedDocument<Persona>): PersonaResponse => {
    const personaCopy: Persona = {
      ...persona.toObject({
        versionKey: false // Cosmetics; prevents returning of __v property
      })
    };
    // const { username } = await UserCollection.findOneByUserId(personaCopy.user); // basically username = personaCopy.user.username
    // delete personaCopy.user; 
    return {
      ...personaCopy,
      _id: personaCopy._id.toString(),
      // user: personaCopy.user.username
    };
  };
  
  export {
    constructPersonaResponse
  };