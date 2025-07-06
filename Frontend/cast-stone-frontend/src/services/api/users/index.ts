// User Services
export { UserGetService, userGetService } from './get';
export { UserPostService, userPostService } from './post';
export { UserUpdateService, userUpdateService } from './update';
export { UserDeleteService, userDeleteService } from './delete';

// Combined User Service
import { userGetService } from './get';
import { userPostService } from './post';
import { userUpdateService } from './update';
import { userDeleteService } from './delete';

export class UserService {
  get = userGetService;
  post = userPostService;
  update = userUpdateService;
  delete = userDeleteService;
}

// Export singleton instance
export const userService = new UserService();
