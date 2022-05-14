import {ISpace} from './Models';

export class MissingFildError extends Error{}

export function ValidateAsSpaceEntry(arg: any) {
    if(!(arg as ISpace).name){
        throw new MissingFildError('Value for name is required!');
    }
    if(!(arg as ISpace).location){
        throw new MissingFildError('Value for location is required!');
    }
    if(!(arg as ISpace).spaceId){
        throw new MissingFildError('Value for SpaceId is required!');
    }

}