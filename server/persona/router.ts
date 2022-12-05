import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import PersonaCollection from './collection';
import * as userValidator from '../user/middleware';
import * as personaValidator from './middleware';
import * as util from './util';
import UserCollection from '../user/collection';

const router = express.Router();

/**
 * Sign in a persona or switch the currently active persona.
 *
 * @name POST /api/persona/session
 * 
 * @param {string} handle - The user's persona's handle
 * @return {PersonaResponse} - An object with user's details
 * @throws {400} - If handle is  not in the correct format,
 *                 or missing in the req
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the persona doesn't exist with the user
 *
 */
router.post(
  '/session',
  [
    userValidator.isUserLoggedIn,
    personaValidator.isValidHandle,
    personaValidator.isPersonaHandleExistWithUser, // checks if the handle exists w/ the logged in user
  ],
  async (req: Request, res: Response) => {
    const persona = await PersonaCollection.findOneByHandle(req.body.handle);
    req.session.personaId = persona._id.toString();
    res.status(200).json({
      message: `You have logged in successfully as persona ${persona.handle}`,
      persona: util.constructPersonaResponse(persona)
    });
  }
);


/**
 * Get personas of the logged in user.
 *
 * @name GET /api/persona
 * 
 * @return {PersonaResponse[]} - An array of personas created by user
 * @throws {403} - If the user is not logged in
 */
/**
 * Get personas of a user.
 *
 * @name GET /api/persona?author=username
 * 
 * @return {PersonaResponse[]} - An array of personas created by user (author)
 * @throws {400} - If author is not given (empty)
 * @throws {403} - If the user is not logged in
 * @throws {404} - If no user is not found
 *
 */
 router.get(
  '/', 
  // case where the user doesnt pass in anything, requesting own info 
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if authorId query parameter was supplied
    if (req.query.author !== undefined) {
      next();
      return;
    }
    const { username } = await UserCollection.findOneByUserId(req.session.userId as string);
    const allPersonas = await PersonaCollection.findAllByUsername(username);
    const response = allPersonas.map(util.constructPersonaResponse);
    res.status(200).json({
      user: username,
      personas: response 
    });
  },

  // case where request is for a different user
  [
    userValidator.isUserLoggedIn,
    userValidator.isAuthorExists
  ],
  async (req: Request, res: Response) => {
    const allPersonas = await PersonaCollection.findAllByUsername(req.query.author as string);
    const response = allPersonas.map(util.constructPersonaResponse);
    res.status(200).json(response);
    }
);

/**
 * Create a persona.
 *
 * @name POST /api/persona
 *
 * @param {string} username - username of user
 * @param {string} handle - persona's handle
 * @param {string} name - persona's name
 * @return {PersonaResponse} - The created persona
 * @throws {403} - If the user is not logged in
 * @throws {409} - If handle is already taken
 * @throws {400} - If name or handle is not in correct format
 *
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    personaValidator.isValidName,
    personaValidator.isValidHandle,
    personaValidator.isHandleNotAlreadyInUse,
  ],
  async (req: Request, res: Response) => {
    const persona = await PersonaCollection.addOne(req.body.username, req.body.handle, req.body.name);
    req.session.personId = persona._id.toString();
    res.status(201).json({
      message: `Your persona was created successfully. You are now active as @${persona.handle}`,
      persona: util.constructPersonaResponse(persona)
    });
  }
);

/**
 * Update a user's persona's details.
 *
 * @name PUT /api/persona/:personaId
 *
 * @param {string} username - username of the persona's user
 * @param {string} handle - The persona's (new) handle
 * @param {string} name - The persona's (new) name
 * @return {PersonaResponse} - The updated persona
 * @throws {403} - If user is not logged in
 * @throws {400} - If persona does not exist under the user or could not be found at all
 * @throws {400} - If handle or name are not of the correct format
 * @throws {409} - If handle already taken
 */
router.put(
  '/:personaId?',
  [
    userValidator.isUserLoggedIn,
    personaValidator.isPersonaExistWithUser,
    personaValidator.isValidName,
    personaValidator.isValidHandle,
    personaValidator.isNewHandleNotAlreadyInUse,
  ],
  async (req: Request, res: Response) => {
    const persona = await PersonaCollection.updateOne(req.params.personaId, req.body);
    res.status(200).json({
      message: 'Your persona was updated successfully.',
      persona: util.constructPersonaResponse(persona)
    });
  }
);

/**
 * Delete a persona.
 *
 * @name DELETE /api/persona?personaId=id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the persona with personaId is not found
 * @throws {401} - If the persona to delete is the currently active one
 */
router.delete(
  '/',
  [
    userValidator.isUserLoggedIn,
    personaValidator.isPersonaQueryExists
  ],
  async (req: Request, res: Response) => {
    if (req.query.personaId.toString() === req.session.personaId) {
      res.status(401).json({
        error: 'Cannot delete the currently signed in persona. Please switch to a different persona or sign out of the currently active one before deleting it.'
      });
      return;
    }
    await PersonaCollection.deleteOne(req.query.personaId as string);
    res.status(200).json({
      message: 'Your persona has been deleted successfully.'
    });
  }
);

// /**
//  * Delete a persona by handle (and signed in user).
//  *
//  * @name DELETE /api/persona
//  * 
//  * @param {string} handle - handle of the persona to delete
//  *
//  * @return {string} - A success message
//  * @throws {403} - If the user is not logged in
//  * @throws {404} - If the persona is not found under this user
//  */
//  router.delete(
//   '/',
//   [
//     userValidator.isUserLoggedIn,
//     // personaValidator.isPersonaHandleExistWithUser
//   ],
//   async (req: Request, res: Response) => {
//     const username = (await UserCollection.findOneByUserId(req.session.userId)).username;
//     await PersonaCollection.deleteOneByUserAndHandle(username, req.body.handle);
//     res.status(200).json({
//       message: 'Your persona has been deleted successfully.',
//     });
//   }
// );

export {router as personaRouter};
