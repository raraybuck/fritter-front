import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import FollowCollection from './collection';
// import UserCollection from '../user/collection';

/**
 * Checks if a follow does not exists under the signed in user for the requested personaId in req.body
 */
const isFollowNotExistUnderSignedInPersona = async (req: Request, res: Response, next: NextFunction) => {
    console.log("checking if middleware is good");
    const checkFollow = await FollowCollection.findOneByPartyIds(req.session.personaId, req.body.personaId);
    if (checkFollow) {
        console.log("follow already exists");
        res.status(409).json({
            error: `You are already following persona with id ${req.body.personaId}.`
        });
        return;
    }
    next();
};

/**
 * Checks if a follow does exists under the signed in user for the requested personaId in req.body
 */
 const isFollowExistUnderSignedInPersona = async (req: Request, res: Response, next: NextFunction) => {
    const checkFollow = await FollowCollection.findOneByPartyIds(req.session.personaId, req.body.personaId);
    if (!checkFollow) {
      res.status(404).json({
        error: `You do not appear to be following this persona, so there is nothing to delete.`
      });
      return;
    }
    next();
  };

export {
    isFollowNotExistUnderSignedInPersona,
    isFollowExistUnderSignedInPersona
};