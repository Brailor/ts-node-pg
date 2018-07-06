import { check, validationResult, ValidationChain } from 'express-validator/check';
import { NextFunction } from 'connect';

export enum Roles {
  User = 'USER',
  Admin = 'ADMIN'
}

const ROLES = [Roles.Admin, Roles.User];
const MIN_PASSWORD_LENGTH = 3;

export function basicCheck(valuesToCheck: string[]): ValidationChain[] {
  return valuesToCheck.map(value => {
    switch (value) {
      case 'email':
        return check(value)
          .exists()
          .isEmail();

      case 'password':
        return check(value)
          .exists()
          .isLength({ min: MIN_PASSWORD_LENGTH });

      case 'role':
        return check(value)
          .exists()
          .isIn(ROLES);

      default:
        return check(value).exists();
    }
  });
}

// TODO
// export function basicCheckMW(valuesToCheck: string[]) {
//   basicCheck(valuesToCheck);
//   return function(req: Request, res: Response, next: NextFunction) {
//     const errors = validationResult(req);

//     if (!errors.isEmpty()) {
//       res.status(422).json({ erros: errors.array() });
//     }
//     next();
//   };
// }
